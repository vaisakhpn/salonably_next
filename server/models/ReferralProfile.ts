import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReferralProfile extends Document {
  userId: mongoose.Types.ObjectId;
  phone: string;
  phoneVerified: boolean;
  referralCode?: string;
  payoutMethod: "UPI_ID" | "UPI_PHONE";
  upiId?: string;
  upiPhone?: string;
  status: "active" | "suspended";
  totalEarned: number;
  availableBalance: number;
  pendingBalance: number;
  withdrawnAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralProfileSchema = new Schema<IReferralProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for a Referral Profile."],
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required for Referral Profile."],
      unique: true,
      index: true,
      trim: true,
    },
    phoneVerified: {
      type: Boolean,
      default: true,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    payoutMethod: {
      type: String,
      enum: ["UPI_ID", "UPI_PHONE"],
      default: "UPI_ID",
    },
    upiId: {
      type: String,
      default: "",
      trim: true,
    },
    upiPhone: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },
    totalEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    withdrawnAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.ReferralProfile) {
  delete (mongoose.models as any).ReferralProfile;
}

const ReferralProfileModel: Model<IReferralProfile> =
  mongoose.models.ReferralProfile ||
  mongoose.model<IReferralProfile>("ReferralProfile", ReferralProfileSchema, "referral_profiles");

export default ReferralProfileModel;
