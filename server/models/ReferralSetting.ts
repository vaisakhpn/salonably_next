import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReferralSetting extends Document {
  key: string;
  initialRewardAmount: number;
  bookingCommissionAmount: number;
  minWithdrawalAmount: number;
  isProgramActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSettingSchema = new Schema<IReferralSetting>(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
      required: true,
      trim: true,
    },
    initialRewardAmount: {
      type: Number,
      default: 100,
      min: [0, "Initial reward cannot be negative."],
    },
    bookingCommissionAmount: {
      type: Number,
      default: 5,
      min: [0, "Booking commission cannot be negative."],
    },
    minWithdrawalAmount: {
      type: Number,
      default: 100,
      min: [1, "Minimum withdrawal amount must be at least ₹1."],
    },
    isProgramActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.ReferralSetting) {
  delete (mongoose.models as any).ReferralSetting;
}

const ReferralSettingModel: Model<IReferralSetting> =
  mongoose.models.ReferralSetting ||
  mongoose.model<IReferralSetting>(
    "ReferralSetting",
    ReferralSettingSchema,
    "referral_settings"
  );

export default ReferralSettingModel;
