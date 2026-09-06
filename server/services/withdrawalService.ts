import mongoose, { Types } from "mongoose";
import dbConnect from "@/server/db/mongodb";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import WithdrawalRequestModel, { IWithdrawalRequest, PayoutMethod } from "@/server/models/WithdrawalRequest";
import ReferralTransactionModel from "@/server/models/ReferralTransaction";
import { getOrCreateReferralSettings, recalculateProfileBalances } from "./referralService";

/**
 * Submits a new withdrawal request for a user:
 * 1. Checks minimum withdrawal threshold
 * 2. Checks real-time available balance
 * 3. Creates PENDING withdrawal request
 * 4. Locks the amount to prevent double spending
 */
export async function requestWithdrawal(params: {
  userId: string | Types.ObjectId;
  amount: number;
  payoutMethod: PayoutMethod;
  payoutAddress: string;
}): Promise<{
  success: boolean;
  message: string;
  withdrawal?: IWithdrawalRequest;
  availableBalance?: number;
}> {
  await dbConnect();
  const settings = await getOrCreateReferralSettings();

  if (!settings.isProgramActive) {
    return { success: false, message: "The referral & withdrawal program is currently inactive." };
  }

  const requestedAmount = Number(params.amount);
  if (isNaN(requestedAmount) || requestedAmount <= 0) {
    return { success: false, message: "Please enter a valid withdrawal amount." };
  }

  const minWithdrawal = settings.minWithdrawalAmount || 100;
  if (requestedAmount < minWithdrawal) {
    return {
      success: false,
      message: `Minimum withdrawal amount is ₹${minWithdrawal}.`,
    };
  }

  const targetUserId = typeof params.userId === "string" ? new Types.ObjectId(params.userId) : params.userId;

  const profile = await ReferralProfileModel.findOne({ userId: targetUserId });
  if (!profile || profile.status !== "active") {
    return { success: false, message: "Active referral profile not found." };
  }

  // 1. Recalculate baseline balance
  await recalculateProfileBalances(profile._id);

  // Validate payout address
  const cleanAddress = params.payoutAddress?.trim();
  if (!cleanAddress) {
    return { success: false, message: "Please provide a valid UPI ID or UPI-linked phone number." };
  }

  // 2. ATOMIC BALANCE RESERVATION:
  // Use MongoDB atomic compare-and-swap ($gte + $inc) to guarantee that concurrent requests
  // cannot double-spend or exceed available balance under any circumstances.
  const reservedProfile = await ReferralProfileModel.findOneAndUpdate(
    {
      _id: profile._id,
      status: "active",
      availableBalance: { $gte: requestedAmount },
    },
    {
      $inc: {
        availableBalance: -requestedAmount,
        pendingBalance: requestedAmount,
      },
    },
    { new: true }
  );

  if (!reservedProfile) {
    const currentBalances = await recalculateProfileBalances(profile._id);
    return {
      success: false,
      message: `Insufficient balance. Available to withdraw: ₹${currentBalances.availableBalance}.`,
      availableBalance: currentBalances.availableBalance,
    };
  }

  // 3. Create PENDING withdrawal request
  try {
    const withdrawal = await WithdrawalRequestModel.create({
      referralProfileId: profile._id,
      userId: targetUserId,
      amount: requestedAmount,
      payoutMethod: params.payoutMethod,
      payoutAddress: cleanAddress,
      status: "PENDING",
      requestedAt: new Date(),
    });

    return {
      success: true,
      message: `Withdrawal request for ₹${requestedAmount} submitted successfully. Admin will process your payout shortly.`,
      withdrawal,
      availableBalance: reservedProfile.availableBalance,
    };
  } catch (creationError) {
    // Atomic rollback in case document insertion failed
    await ReferralProfileModel.findByIdAndUpdate(profile._id, {
      $inc: {
        availableBalance: requestedAmount,
        pendingBalance: -requestedAmount,
      },
    });
    throw creationError;
  }
}

/**
 * Admin processes a withdrawal:
 * - Action 'PAY': Marks as PAID, logs transaction, updates balances
 * - Action 'REJECT': Marks as REJECTED, restores available balance
 * Uses atomic conditional update to guarantee idempotency across concurrent admin actions.
 */
export async function processWithdrawal(params: {
  withdrawalId: string | Types.ObjectId;
  action: "PAY" | "REJECT";
  paymentReference?: string;
  adminNote?: string;
}): Promise<{
  success: boolean;
  message: string;
  withdrawal?: IWithdrawalRequest;
}> {
  await dbConnect();

  if (params.action === "PAY") {
    const updated = await WithdrawalRequestModel.findOneAndUpdate(
      { _id: params.withdrawalId, status: "PENDING" },
      {
        $set: {
          status: "PAID",
          paidAt: new Date(),
          paymentReference: params.paymentReference?.trim() || "",
          adminNote: params.adminNote?.trim() || "",
        },
      },
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        message: "Withdrawal request has already been processed or not found.",
      };
    }

    // Create ledger debit entry
    const transaction = await ReferralTransactionModel.create({
      referralProfileId: updated.referralProfileId,
      withdrawalId: updated._id,
      type: "WITHDRAWAL",
      amount: updated.amount,
      status: "COMPLETED",
      description: `Withdrawal paid via ${updated.payoutMethod} (${updated.payoutAddress})`,
      metadata: {
        paymentReference: updated.paymentReference,
        adminNote: updated.adminNote,
        paidAt: updated.paidAt,
      },
    });

    await WithdrawalRequestModel.findByIdAndUpdate(updated._id, {
      transactionId: transaction._id,
    });

    // Recompute balances
    await recalculateProfileBalances(updated.referralProfileId);

    return {
      success: true,
      message: `Withdrawal marked as PAID successfully.`,
      withdrawal: updated,
    };
  } else {
    const updated = await WithdrawalRequestModel.findOneAndUpdate(
      { _id: params.withdrawalId, status: "PENDING" },
      {
        $set: {
          status: "REJECTED",
          rejectedAt: new Date(),
          adminNote: params.adminNote?.trim() || "",
        },
      },
      { new: true }
    );

    if (!updated) {
      return {
        success: false,
        message: "Withdrawal request has already been processed or not found.",
      };
    }

    // Recompute balances (frees locked pending amount back to available balance)
    await recalculateProfileBalances(updated.referralProfileId);

    return {
      success: true,
      message: `Withdrawal request rejected. Funds returned to user balance.`,
      withdrawal: updated,
    };
  }
}
