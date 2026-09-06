import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompetitionRankedEntry {
  rank: number;
  shopId: mongoose.Types.ObjectId;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  completedBookings: number;
  rewardAmount: number;
  isWinner: boolean;
  tieBrokenBy?: "bookings" | "milestone_time" | "registration_time" | "none";
}

export interface ICompetitionTopWinner {
  rank: number;
  shopId: mongoose.Types.ObjectId;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  completedBookings: number;
  rewardAmount: number;
}

export interface ICompetitionResult extends Document {
  cohortId: mongoose.Types.ObjectId;
  cohortNumber: number;
  cohortName: string;
  entryWindowStart: Date;
  entryWindowEnd: Date;
  competitionStartDate: Date;
  competitionEndDate: Date;
  totalParticipants: number;
  rankings: ICompetitionRankedEntry[];
  topWinners: ICompetitionTopWinner[];
  snapshottedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitionResultSchema = new Schema<ICompetitionResult>(
  {
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: "CompetitionCohort",
      required: [true, "Cohort ID is required."],
      unique: true,
      index: true,
    },
    cohortNumber: {
      type: Number,
      required: [true, "Cohort number is required."],
      unique: true,
      index: true,
    },
    cohortName: {
      type: String,
      required: [true, "Cohort name is required."],
    },
    entryWindowStart: {
      type: Date,
      required: true,
    },
    entryWindowEnd: {
      type: Date,
      required: true,
    },
    competitionStartDate: {
      type: Date,
      required: true,
    },
    competitionEndDate: {
      type: Date,
      required: true,
    },
    totalParticipants: {
      type: Number,
      default: 0,
    },
    rankings: [
      {
        rank: { type: Number, required: true },
        shopId: { type: Schema.Types.ObjectId, ref: "shop", required: true },
        shopName: { type: String, required: true },
        ownerName: { type: String, required: true },
        ownerPhone: { type: String, required: true },
        completedBookings: { type: Number, required: true },
        rewardAmount: { type: Number, default: 0 },
        isWinner: { type: Boolean, default: false },
        tieBrokenBy: {
          type: String,
          enum: ["bookings", "milestone_time", "registration_time", "none"],
          default: "none",
        },
      },
    ],
    topWinners: [
      {
        rank: { type: Number, required: true },
        shopId: { type: Schema.Types.ObjectId, ref: "shop", required: true },
        shopName: { type: String, required: true },
        ownerName: { type: String, required: true },
        ownerPhone: { type: String, required: true },
        completedBookings: { type: Number, required: true },
        rewardAmount: { type: Number, required: true },
      },
    ],
    snapshottedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

// High-speed index to check historical participation and wins by shopId
CompetitionResultSchema.index({ "rankings.shopId": 1 });
CompetitionResultSchema.index({ "topWinners.shopId": 1 });

if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models.CompetitionResult
) {
  delete (mongoose.models as any).CompetitionResult;
}

const CompetitionResultModel: Model<ICompetitionResult> =
  mongoose.models.CompetitionResult ||
  mongoose.model<ICompetitionResult>(
    "CompetitionResult",
    CompetitionResultSchema,
    "competition_results"
  );

export default CompetitionResultModel;
