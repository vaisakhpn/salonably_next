import mongoose, { Document, Model, Schema } from "mongoose";

export type WithdrawalStatus = "PENDING" | "PAID" | "REJECTED";
export type PayoutMethod = "UPI_ID" | "UPI_PHONE";

export interface IWithdrawalRequest extends Document {
  referralProfileId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  payoutMethod: PayoutMethod;
  payoutAddress: string;
  status: WithdrawalStatus;
  transactionId?: mongoose.Types.ObjectId;
  paymentReference?: string;
  adminNote?: string;
  requestedAt: Date;
  paidAt?: Date;
  rejectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    referralProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ReferralProfile",
      required: [true, "Referral Profile ID is required."],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Withdrawal amount is required."],
      min: [1, "Withdrawal amount must be at least ₹1."],
    },
    payoutMethod: {
      type: String,
      enum: ["UPI_ID", "UPI_PHONE"],
      required: [true, "Payout method is required."],
    },
    payoutAddress: {
      type: String,
      required: [true, "UPI ID or UPI-linked phone number is required."],
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "ReferralTransaction",
    },
    paymentReference: {
      type: String,
      default: "",
      trim: true,
    },
    adminNote: {
      type: String,
      default: "",
      trim: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    paidAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Fast query for user requests sorted by newest
WithdrawalRequestSchema.index({ referralProfileId: 1, requestedAt: -1 });
WithdrawalRequestSchema.index({ status: 1, requestedAt: -1 });
// Covered index for ultra-fast balance aggregation
WithdrawalRequestSchema.index({ referralProfileId: 1, status: 1, amount: 1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.WithdrawalRequest) {
  delete (mongoose.models as any).WithdrawalRequest;
}

const WithdrawalRequestModel: Model<IWithdrawalRequest> =
  mongoose.models.WithdrawalRequest ||
  mongoose.model<IWithdrawalRequest>(
    "WithdrawalRequest",
    WithdrawalRequestSchema,
    "withdrawal_requests"
  );

export default WithdrawalRequestModel;
