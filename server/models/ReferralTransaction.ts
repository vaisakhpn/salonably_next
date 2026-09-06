import mongoose, { Document, Model, Schema } from "mongoose";

export type ReferralTransactionType =
  | "REFERRAL_BONUS"
  | "BOOKING_COMMISSION"
  | "WITHDRAWAL"
  | "REVERSAL"
  | "ADJUSTMENT";

export type ReferralTransactionStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";

export interface IReferralTransaction extends Document {
  referralProfileId: mongoose.Types.ObjectId;
  referralId?: mongoose.Types.ObjectId;
  shopId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  withdrawalId?: mongoose.Types.ObjectId;
  type: ReferralTransactionType;
  amount: number;
  status: ReferralTransactionStatus;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralTransactionSchema = new Schema<IReferralTransaction>(
  {
    referralProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ReferralProfile",
      required: [true, "Referral Profile ID is required."],
      index: true,
    },
    referralId: {
      type: Schema.Types.ObjectId,
      ref: "Referral",
      index: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "booking",
      index: true,
    },
    withdrawalId: {
      type: Schema.Types.ObjectId,
      ref: "WithdrawalRequest",
      index: true,
    },
    type: {
      type: String,
      enum: [
        "REFERRAL_BONUS",
        "BOOKING_COMMISSION",
        "WITHDRAWAL",
        "REVERSAL",
        "ADJUSTMENT",
      ],
      required: [true, "Transaction type is required."],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required."],
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED", "FAILED"],
      default: "COMPLETED",
      index: true,
    },
    description: {
      type: String,
      required: [true, "Transaction description is required."],
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Fast sorted query for transaction history
ReferralTransactionSchema.index({ referralProfileId: 1, createdAt: -1 });
ReferralTransactionSchema.index({ referralProfileId: 1, type: 1, createdAt: -1 });

// Covered index for ultra-fast balance aggregations at scale
ReferralTransactionSchema.index({ referralProfileId: 1, status: 1, type: 1, amount: 1 });

// Idempotency: Prevent duplicate booking commissions for the same booking
ReferralTransactionSchema.index(
  { bookingId: 1, type: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { bookingId: { $exists: true }, type: "BOOKING_COMMISSION" },
  }
);

// Idempotency: Prevent duplicate initial referral bonus for the same referral
ReferralTransactionSchema.index(
  { referralId: 1, type: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { referralId: { $exists: true }, type: "REFERRAL_BONUS" },
  }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.ReferralTransaction) {
  delete (mongoose.models as any).ReferralTransaction;
}

const ReferralTransactionModel: Model<IReferralTransaction> =
  mongoose.models.ReferralTransaction ||
  mongoose.model<IReferralTransaction>(
    "ReferralTransaction",
    ReferralTransactionSchema,
    "referral_transactions"
  );

export default ReferralTransactionModel;
