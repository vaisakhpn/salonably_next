import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompetitionParticipant extends Document {
  cohortId: mongoose.Types.ObjectId;
  cohortNumber: number;
  shopId: mongoose.Types.ObjectId;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  shopRegisteredAt: Date;
  eligibilityDate: Date;
  liveBookingCount: number;
  lastBookingMilestoneAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompetitionParticipantSchema = new Schema<ICompetitionParticipant>(
  {
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: "CompetitionCohort",
      required: [true, "Cohort ID is required."],
      index: true,
    },
    cohortNumber: {
      type: Number,
      required: [true, "Cohort number is required."],
      index: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      required: [true, "Shop ID is required."],
      index: true,
    },
    shopName: {
      type: String,
      required: [true, "Shop name is required."],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required."],
      trim: true,
    },
    ownerPhone: {
      type: String,
      required: [true, "Owner phone is required."],
      trim: true,
    },
    shopRegisteredAt: {
      type: Date,
      required: [true, "Shop registration date is required."],
    },
    eligibilityDate: {
      type: Date,
      required: [true, "Eligibility date is required."],
      index: true,
    },
    liveBookingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastBookingMilestoneAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Idempotency: A shop can only be registered ONCE per cohort
CompetitionParticipantSchema.index({ cohortId: 1, shopId: 1 }, { unique: true });

// High-speed sorting index for cohort live leaderboard queries with milestone tie-breaker
CompetitionParticipantSchema.index({
  cohortId: 1,
  liveBookingCount: -1,
  lastBookingMilestoneAt: 1,
  shopRegisteredAt: 1,
});

if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models.CompetitionParticipant
) {
  delete (mongoose.models as any).CompetitionParticipant;
}

const CompetitionParticipantModel: Model<ICompetitionParticipant> =
  mongoose.models.CompetitionParticipant ||
  mongoose.model<ICompetitionParticipant>(
    "CompetitionParticipant",
    CompetitionParticipantSchema,
    "competition_participants"
  );

export default CompetitionParticipantModel;
