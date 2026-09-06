import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReferral extends Document {
  referrerProfileId: mongoose.Types.ObjectId;
  referrerUserId: mongoose.Types.ObjectId;
  referredShopId: mongoose.Types.ObjectId;
  referrerPhone: string;
  shopPhone: string;
  status: "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED";
  initialRewardAmount: number;
  initialRewardStatus: "PENDING" | "CREDITED" | "REJECTED";
  totalBookingsCompleted: number;
  totalCommissionEarned: number;
  verifiedAt?: Date;
  rejectedAt?: Date;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrerProfileId: {
      type: Schema.Types.ObjectId,
      ref: "ReferralProfile",
      required: [true, "Referrer Profile ID is required."],
      index: true,
    },
    referrerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Referrer User ID is required."],
      index: true,
    },
    referredShopId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      required: [true, "Referred Shop ID is required."],
      unique: true, // Strictly 1 referrer per salon
      index: true,
    },
    referrerPhone: {
      type: String,
      required: [true, "Referrer phone number is required."],
      index: true,
      trim: true,
    },
    shopPhone: {
      type: String,
      required: [true, "Shop owner phone number is required."],
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING_VERIFICATION", "ACTIVE", "REJECTED"],
      default: "PENDING_VERIFICATION",
      index: true,
    },
    initialRewardAmount: {
      type: Number,
      default: 100,
      min: 0,
    },
    initialRewardStatus: {
      type: String,
      enum: ["PENDING", "CREDITED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    totalBookingsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCommissionEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    verifiedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    adminNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// High-speed compound queries and aggregation coverage
ReferralSchema.index({ referrerProfileId: 1, status: 1 });
ReferralSchema.index({ referrerProfileId: 1, status: 1, initialRewardStatus: 1, initialRewardAmount: 1 });
ReferralSchema.index({ status: 1, createdAt: -1 });

if (process.env.NODE_ENV !== "production" && mongoose.models.Referral) {
  delete (mongoose.models as any).Referral;
}

const ReferralModel: Model<IReferral> =
  mongoose.models.Referral ||
  mongoose.model<IReferral>("Referral", ReferralSchema, "referrals");

export default ReferralModel;
