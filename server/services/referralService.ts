import mongoose, { Types } from "mongoose";
import dbConnect from "@/server/db/mongodb";
import ReferralProfileModel, { IReferralProfile } from "@/server/models/ReferralProfile";
import ReferralModel, { IReferral } from "@/server/models/Referral";
import ReferralTransactionModel, { IReferralTransaction } from "@/server/models/ReferralTransaction";
import WithdrawalRequestModel from "@/server/models/WithdrawalRequest";
import ReferralSettingModel, { IReferralSetting } from "@/server/models/ReferralSetting";
import UserModel from "@/server/models/User";

/**
 * Normalizes phone numbers into a standard 10-digit format (Indian numbers)
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return "";
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  // If number starts with 91 and has 12 digits, strip country code
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  // If number starts with 0 and has 11 digits, strip leading zero
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Fetches the global referral settings or initializes default settings if none exist
 */
export async function getOrCreateReferralSettings(): Promise<IReferralSetting> {
  await dbConnect();
  let settings = await ReferralSettingModel.findOne({ key: "global" });
  if (!settings) {
    settings = await ReferralSettingModel.create({
      key: "global",
      initialRewardAmount: 100,
      bookingCommissionAmount: 5,
      minWithdrawalAmount: 100,
      isProgramActive: true,
    });
  }
  return settings;
}

/**
 * Validates whether a phone number belongs to an active ReferralProfile
 * Returns sanitized details for display during salon registration
 */
/**
 * Masks a full name for public API responses to preserve privacy and prevent PII harvesting
 * e.g., "Vaisakh Paravath" -> "Vaisakh P.***"
 */
export function maskName(fullName?: string): string {
  if (!fullName || typeof fullName !== "string") return "LockMyTime Member";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    const first = parts[0];
    if (first.length <= 2) return `${first}*`;
    return `${first.slice(0, 2)}${"*".repeat(Math.min(first.length - 2, 4))}`;
  }
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first} ${last[0]}.***`;
}

/**
 * Validates whether a phone number belongs to an active referral profile
 */
export async function validateReferrerPhone(phone: string): Promise<{
  valid: boolean;
  message?: string;
  profile?: {
    id: string;
    userId: string;
    phone: string;
    referrerName?: string;
  };
}> {
  await dbConnect();
  const normalized = normalizePhoneNumber(phone);

  if (!normalized || normalized.length < 10) {
    return { valid: false, message: "Please enter a valid 10-digit phone number." };
  }

  const profile = await ReferralProfileModel.findOne({
    phone: normalized,
    status: "active",
  }).lean();

  if (!profile) {
    return {
      valid: false,
      message: "No active referral profile found for this phone number.",
    };
  }

  const user = await UserModel.findById(profile.userId).select("name").lean();
  const rawName = user ? (user as any).name : "LockMyTime Member";

  return {
    valid: true,
    profile: {
      id: (profile._id as any).toString(),
      userId: (profile.userId as any).toString(),
      phone: profile.phone,
      referrerName: maskName(rawName),
    },
  };
}

/**
 * Recalculates and updates balances on a ReferralProfile based on ledger transactions
 * Ensures strict mathematical balance integrity
 */
export async function recalculateProfileBalances(profileId: string | Types.ObjectId): Promise<{
  totalEarned: number;
  availableBalance: number;
  pendingBalance: number;
  withdrawnAmount: number;
}> {
  await dbConnect();
  const targetId = typeof profileId === "string" ? new Types.ObjectId(profileId) : profileId;

  // 1. Calculate Total Earned from COMPLETED credit transactions
  const earnedAgg = await ReferralTransactionModel.aggregate([
    {
      $match: {
        referralProfileId: targetId,
        status: "COMPLETED",
        type: { $in: ["REFERRAL_BONUS", "BOOKING_COMMISSION", "ADJUSTMENT"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);
  const totalEarned = earnedAgg[0]?.total || 0;

  // 2. Calculate Pending Balance from salons awaiting admin verification
  const pendingAgg = await ReferralModel.aggregate([
    {
      $match: {
        referrerProfileId: targetId,
        status: "PENDING_VERIFICATION",
        initialRewardStatus: "PENDING",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$initialRewardAmount" },
      },
    },
  ]);
  const pendingBalance = pendingAgg[0]?.total || 0;

  // 3. Calculate Withdrawn Amount (PAID withdrawals)
  const paidWithdrawalsAgg = await WithdrawalRequestModel.aggregate([
    {
      $match: {
        referralProfileId: targetId,
        status: "PAID",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);
  const withdrawnAmount = paidWithdrawalsAgg[0]?.total || 0;

  // 4. Calculate Pending Withdrawals (amount currently locked/reserved in PENDING status)
  const pendingWithdrawalsAgg = await WithdrawalRequestModel.aggregate([
    {
      $match: {
        referralProfileId: targetId,
        status: "PENDING",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);
  const pendingWithdrawalAmount = pendingWithdrawalsAgg[0]?.total || 0;

  // 5. Available balance = Total Earned - Paid Withdrawals - Pending Locked Withdrawals
  const rawAvailable = totalEarned - withdrawnAmount - pendingWithdrawalAmount;
  const availableBalance = Math.max(0, rawAvailable);

  // Update ReferralProfile document with fresh computed counters
  await ReferralProfileModel.findByIdAndUpdate(targetId, {
    totalEarned,
    availableBalance,
    pendingBalance,
    withdrawnAmount,
  });

  return {
    totalEarned,
    availableBalance,
    pendingBalance,
    withdrawnAmount,
  };
}

/**
 * Creates a new Referral record when a salon registers with a referrer's phone
 */
export async function createReferralLink(params: {
  shopId: string | Types.ObjectId;
  referrerPhone: string;
  shopPhone: string;
  shopOwnerEmail?: string;
}): Promise<IReferral | null> {
  await dbConnect();
  const settings = await getOrCreateReferralSettings();

  if (!settings.isProgramActive) {
    return null;
  }

  const normalizedReferrerPhone = normalizePhoneNumber(params.referrerPhone);
  const normalizedShopPhone = normalizePhoneNumber(params.shopPhone);

  // Self-referral prevention: Shop phone cannot match Referrer phone
  if (normalizedReferrerPhone === normalizedShopPhone) {
    console.warn("Self-referral attempt blocked: Shop phone equals Referrer phone.");
    return null;
  }

  // Find active referrer profile
  const referrerProfile = await ReferralProfileModel.findOne({
    phone: normalizedReferrerPhone,
    status: "active",
  });

  if (!referrerProfile) {
    console.warn("Referral link skipped: Referrer profile not found or inactive.");
    return null;
  }

  // Check if this shop already has a referral record
  const existingReferral = await ReferralModel.findOne({
    referredShopId: params.shopId,
  });

  if (existingReferral) {
    return existingReferral;
  }

  const newReferral = await ReferralModel.create({
    referrerProfileId: referrerProfile._id,
    referrerUserId: referrerProfile.userId,
    referredShopId: params.shopId,
    referrerPhone: normalizedReferrerPhone,
    shopPhone: normalizedShopPhone,
    status: "PENDING_VERIFICATION",
    initialRewardAmount: settings.initialRewardAmount,
    initialRewardStatus: "PENDING",
    totalBookingsCompleted: 0,
    totalCommissionEarned: 0,
  });

  // Update referrer's pending balance
  await recalculateProfileBalances(referrerProfile._id);

  return newReferral;
}

/**
 * Admin verifies a referred salon:
 * 1. Updates Referral status to ACTIVE
 * 2. Credits ₹100 initial reward via ReferralTransaction
 * 3. Updates referrer profile balances
 */
export async function verifyReferral(
  referralId: string | Types.ObjectId,
  adminNote?: string
): Promise<{ success: boolean; message: string; referral?: IReferral }> {
  await dbConnect();
  const referral = await ReferralModel.findById(referralId);

  if (!referral) {
    return { success: false, message: "Referral record not found." };
  }

  if (referral.status === "ACTIVE") {
    return { success: true, message: "Referral is already active.", referral };
  }

  referral.status = "ACTIVE";
  referral.initialRewardStatus = "CREDITED";
  referral.verifiedAt = new Date();
  if (adminNote) referral.adminNote = adminNote;

  await referral.save();

  // Create initial reward transaction with idempotency protection
  try {
    await ReferralTransactionModel.create({
      referralProfileId: referral.referrerProfileId,
      referralId: referral._id,
      shopId: referral.referredShopId,
      type: "REFERRAL_BONUS",
      amount: referral.initialRewardAmount || 100,
      status: "COMPLETED",
      description: `Referral reward for verified salon partner`,
      metadata: {
        verifiedAt: referral.verifiedAt,
        adminNote: adminNote || "",
      },
    });
  } catch (err: any) {
    // If duplicate key error (code 11000), transaction was already created previously
    if (err.code !== 11000) {
      console.error("Error creating referral bonus transaction:", err);
    }
  }

  // Recalculate balances
  await recalculateProfileBalances(referral.referrerProfileId);

  return {
    success: true,
    message: `Referral verified successfully! ₹${referral.initialRewardAmount} credited to referrer.`,
    referral,
  };
}

/**
 * Admin rejects a referred salon:
 * 1. Updates Referral status to REJECTED
 * 2. Updates referrer profile pending balance
 */
export async function rejectReferral(
  referralId: string | Types.ObjectId,
  adminNote?: string
): Promise<{ success: boolean; message: string; referral?: IReferral }> {
  await dbConnect();
  const referral = await ReferralModel.findById(referralId);

  if (!referral) {
    return { success: false, message: "Referral record not found." };
  }

  referral.status = "REJECTED";
  referral.initialRewardStatus = "REJECTED";
  referral.rejectedAt = new Date();
  if (adminNote) referral.adminNote = adminNote;

  await referral.save();

  // Recalculate balances (removes pending reward)
  await recalculateProfileBalances(referral.referrerProfileId);

  return {
    success: true,
    message: "Referral rejected.",
    referral,
  };
}

/**
 * Credits booking commission (₹5) to the referrer when an appointment is completed.
 * Highly idempotent: won't create duplicate commission even if called repeatedly.
 */
export async function creditBookingCommission(
  bookingId: string | Types.ObjectId,
  shopId: string | Types.ObjectId
): Promise<IReferralTransaction | null> {
  await dbConnect();
  const settings = await getOrCreateReferralSettings();

  if (!settings.isProgramActive) {
    return null;
  }

  const targetShopId = typeof shopId === "string" ? new Types.ObjectId(shopId) : shopId;
  const targetBookingId = typeof bookingId === "string" ? new Types.ObjectId(bookingId) : bookingId;

  // 1. Check if this shop has an ACTIVE referral link
  const referral = await ReferralModel.findOne({
    referredShopId: targetShopId,
    status: "ACTIVE",
  });

  if (!referral) {
    // Shop was not referred or referral is not yet verified
    return null;
  }

  // 2. Check if a commission transaction already exists for this booking (Idempotency)
  const existingTransaction = await ReferralTransactionModel.findOne({
    bookingId: targetBookingId,
    type: "BOOKING_COMMISSION",
  });

  if (existingTransaction) {
    return existingTransaction;
  }

  const commissionAmount = settings.bookingCommissionAmount || 5;

  try {
    // 3. Create the Booking Commission Ledger Entry
    const transaction = await ReferralTransactionModel.create({
      referralProfileId: referral.referrerProfileId,
      referralId: referral._id,
      shopId: referral.referredShopId,
      bookingId: targetBookingId,
      type: "BOOKING_COMMISSION",
      amount: commissionAmount,
      status: "COMPLETED",
      description: `Booking commission for completed appointment`,
      metadata: {
        bookingId: targetBookingId.toString(),
        shopId: targetShopId.toString(),
      },
    });

    // 4. Update Referral cumulative booking counters
    await ReferralModel.findByIdAndUpdate(referral._id, {
      $inc: {
        totalBookingsCompleted: 1,
        totalCommissionEarned: commissionAmount,
      },
    });

    // 5. Update referrer profile balances via high-speed O(1) atomic increment
    await ReferralProfileModel.findByIdAndUpdate(referral.referrerProfileId, {
      $inc: {
        totalEarned: commissionAmount,
        availableBalance: commissionAmount,
      },
    });

    return transaction;
  } catch (err: any) {
    // Duplicate index collision caught safely
    if (err.code === 11000) {
      return await ReferralTransactionModel.findOne({
        bookingId: targetBookingId,
        type: "BOOKING_COMMISSION",
      });
    }
    console.error("Error creating booking commission transaction:", err);
    throw err;
  }
}
