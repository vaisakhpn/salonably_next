import mongoose, { Document, Model, Schema } from "mongoose";

export type CohortStatus = "UPCOMING" | "ACTIVE" | "COMPLETED";

export interface ICompetitionCohortRewards {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
}

export interface ICompetitionCohort extends Document {
  cohortNumber: number;
  name: string;
  entryWindowStart: Date;
  entryWindowEnd: Date;
  competitionStartDate: Date;
  competitionEndDate: Date;
  status: CohortStatus;
  participantCount: number;
  rewardsConfig: ICompetitionCohortRewards;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitionCohortSchema = new Schema<ICompetitionCohort>(
  {
    cohortNumber: {
      type: Number,
      required: [true, "Cohort number is required."],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Cohort name is required."],
      trim: true,
    },
    entryWindowStart: {
      type: Date,
      required: [true, "Entry window start date is required."],
      index: true,
    },
    entryWindowEnd: {
      type: Date,
      required: [true, "Entry window end date is required."],
      index: true,
    },
    competitionStartDate: {
      type: Date,
      required: [true, "Competition start date is required."],
      index: true,
    },
    competitionEndDate: {
      type: Date,
      required: [true, "Competition end date is required."],
      index: true,
    },
    status: {
      type: String,
      enum: ["UPCOMING", "ACTIVE", "COMPLETED"],
      default: "UPCOMING",
      index: true,
    },
    participantCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rewardsConfig: {
      firstPlace: { type: Number, default: 10000 },
      secondPlace: { type: Number, default: 5000 },
      thirdPlace: { type: Number, default: 2000 },
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// High-speed compound queries for lifecycle and admin filtering
CompetitionCohortSchema.index({ status: 1, competitionEndDate: 1 });
CompetitionCohortSchema.index({ entryWindowStart: 1, entryWindowEnd: 1 });

if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models.CompetitionCohort
) {
  delete (mongoose.models as any).CompetitionCohort;
}

const CompetitionCohortModel: Model<ICompetitionCohort> =
  mongoose.models.CompetitionCohort ||
  mongoose.model<ICompetitionCohort>(
    "CompetitionCohort",
    CompetitionCohortSchema,
    "competition_cohorts"
  );

export default CompetitionCohortModel;
