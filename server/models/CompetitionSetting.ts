import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompetitionRewards {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
}

export interface ICompetitionSetting extends Document {
  key: string;
  waitingPeriodDays: number;
  entryWindowDays: number;
  competitionDurationDays: number;
  rewards: ICompetitionRewards;
  isCompetitionActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitionSettingSchema = new Schema<ICompetitionSetting>(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
      required: true,
      trim: true,
    },
    waitingPeriodDays: {
      type: Number,
      default: 30,
      min: [0, "Waiting period cannot be negative."],
    },
    entryWindowDays: {
      type: Number,
      default: 15,
      min: [1, "Entry window must be at least 1 day."],
    },
    competitionDurationDays: {
      type: Number,
      default: 90,
      min: [1, "Competition duration must be at least 1 day."],
    },
    rewards: {
      firstPlace: {
        type: Number,
        default: 10000,
        min: [0, "Reward cannot be negative."],
      },
      secondPlace: {
        type: Number,
        default: 5000,
        min: [0, "Reward cannot be negative."],
      },
      thirdPlace: {
        type: Number,
        default: 2000,
        min: [0, "Reward cannot be negative."],
      },
    },
    isCompetitionActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models.CompetitionSetting
) {
  delete (mongoose.models as any).CompetitionSetting;
}

const CompetitionSettingModel: Model<ICompetitionSetting> =
  mongoose.models.CompetitionSetting ||
  mongoose.model<ICompetitionSetting>(
    "CompetitionSetting",
    CompetitionSettingSchema,
    "competition_settings"
  );

export default CompetitionSettingModel;
