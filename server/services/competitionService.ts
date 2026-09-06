import mongoose, { Types } from "mongoose";
import dbConnect from "@/server/db/mongodb";
import CompetitionSettingModel, {
  ICompetitionSetting,
} from "@/server/models/CompetitionSetting";
import CompetitionCohortModel, {
  ICompetitionCohort,
  CohortStatus,
} from "@/server/models/CompetitionCohort";
import CompetitionParticipantModel, {
  ICompetitionParticipant,
} from "@/server/models/CompetitionParticipant";
import CompetitionResultModel, {
  ICompetitionResult,
  ICompetitionRankedEntry,
  ICompetitionTopWinner,
} from "@/server/models/CompetitionResult";
import ShopModel from "@/server/models/Shop";
import BookingModel from "@/server/models/Booking";
import { parseSlotDateTime, isBookingCompleted } from "@/lib/utils";

// Base Genesis Anchor Date for Cohort #1 (06-10-2026 00:00:00 UTC)
export const GENESIS_ANCHOR_ISO = "2026-10-06T00:00:00.000Z";

export interface CohortScheduleDetails {
  cohortNumber: number;
  name: string;
  entryWindowStart: Date;
  entryWindowEnd: Date;
  competitionStartDate: Date;
  competitionEndDate: Date;
  status: CohortStatus;
}

/**
 * Normalizes input date/timestamp to a clean Date instance
 */
export function normalizeDate(input: Date | number | string): Date {
  if (input instanceof Date) return input;
  if (typeof input === "number") return new Date(input);
  return new Date(input);
}

/**
 * Calculates shop's competition eligibility date by adding the waiting period (default 30 days)
 */
export function calculateEligibilityDate(
  registrationDate: Date | number | string,
  waitingPeriodDays = 30
): Date {
  const regDate = normalizeDate(registrationDate);
  const eligibilityMs =
    regDate.getTime() + waitingPeriodDays * 24 * 60 * 60 * 1000;
  return new Date(eligibilityMs);
}

/**
 * Computes deterministic cohort schedule parameters given an eligibility date
 */
export function calculateCohortSchedule(
  eligibilityDate: Date | number | string,
  entryWindowDays = 15,
  competitionDurationDays = 90,
  referenceNow: Date = new Date()
): CohortScheduleDetails {
  const eligDate = normalizeDate(eligibilityDate);
  const genesisAnchor = new Date(GENESIS_ANCHOR_ISO);

  const windowMs = entryWindowDays * 24 * 60 * 60 * 1000;
  const timeDiff = eligDate.getTime() - genesisAnchor.getTime();

  // If eligibility date is before or at the anchor, map to Cohort #1
  const cohortNumber =
    timeDiff <= 0 ? 1 : Math.floor(timeDiff / windowMs) + 1;

  const entryWindowStartMs =
    genesisAnchor.getTime() + (cohortNumber - 1) * windowMs;
  const entryWindowEndMs = entryWindowStartMs + windowMs;

  const entryWindowStart = new Date(entryWindowStartMs);
  const entryWindowEnd = new Date(entryWindowEndMs);

  // Competition starts on the entry window start date and runs for 90 days (3 calendar months)
  const competitionStartDate = new Date(entryWindowStartMs);
  const competitionEndDate = new Date(
    entryWindowStartMs + competitionDurationDays * 24 * 60 * 60 * 1000
  );

  // Determine initial status based on reference time
  const nowMs = referenceNow.getTime();
  let status: CohortStatus = "UPCOMING";

  if (nowMs >= competitionEndDate.getTime()) {
    status = "COMPLETED";
  } else if (nowMs >= competitionStartDate.getTime()) {
    status = "ACTIVE";
  }

  const name = `Cohort #${cohortNumber}`;

  return {
    cohortNumber,
    name,
    entryWindowStart,
    entryWindowEnd,
    competitionStartDate,
    competitionEndDate,
    status,
  };
}

/**
 * Fetches global competition settings or initializes defaults
 */
export async function getOrCreateCompetitionSettings(): Promise<ICompetitionSetting> {
  await dbConnect();
  let settings = await CompetitionSettingModel.findOne({ key: "global" });
  if (!settings) {
    settings = await CompetitionSettingModel.create({
      key: "global",
      waitingPeriodDays: 30,
      entryWindowDays: 15,
      competitionDurationDays: 90,
      rewards: {
        firstPlace: 10000,
        secondPlace: 5000,
        thirdPlace: 2000,
      },
      isCompetitionActive: true,
    });
  }
  return settings;
}

/**
 * Retrieves or creates a CompetitionCohort by its cohortNumber
 */
export async function getOrCreateCohortByNumber(
  cohortNumber: number,
  customSettings?: ICompetitionSetting
): Promise<ICompetitionCohort> {
  await dbConnect();

  let cohort = await CompetitionCohortModel.findOne({ cohortNumber });
  if (cohort) {
    return cohort;
  }

  const settings = customSettings || (await getOrCreateCompetitionSettings());
  const genesisAnchor = new Date(GENESIS_ANCHOR_ISO);
  const windowMs = settings.entryWindowDays * 24 * 60 * 60 * 1000;

  // Derive exact eligibility timestamp corresponding to this cohort index
  const cohortRepresentativeEligDate = new Date(
    genesisAnchor.getTime() + (cohortNumber - 1) * windowMs + 1000
  );

  const schedule = calculateCohortSchedule(
    cohortRepresentativeEligDate,
    settings.entryWindowDays,
    settings.competitionDurationDays
  );

  cohort = await CompetitionCohortModel.create({
    cohortNumber: schedule.cohortNumber,
    name: schedule.name,
    entryWindowStart: schedule.entryWindowStart,
    entryWindowEnd: schedule.entryWindowEnd,
    competitionStartDate: schedule.competitionStartDate,
    competitionEndDate: schedule.competitionEndDate,
    status: schedule.status,
    participantCount: 0,
    rewardsConfig: {
      firstPlace: settings.rewards?.firstPlace ?? 10000,
      secondPlace: settings.rewards?.secondPlace ?? 5000,
      thirdPlace: settings.rewards?.thirdPlace ?? 2000,
    },
  });

  return cohort;
}

/**
 * Assigns a shop to its respective competition cohort based on registration date + 30 days
 */
export async function assignShopToCohort(
  shopId: string | Types.ObjectId,
  shopDataOverride?: {
    name?: string;
    ownerName?: string;
    phone?: string;
    date?: number | Date;
  }
): Promise<{
  cohort: ICompetitionCohort;
  participant: ICompetitionParticipant;
  isNewEnrollment: boolean;
}> {
  await dbConnect();

  let shop = shopDataOverride;
  if (!shop || !shop.date || !shop.ownerName || !shop.phone) {
    const dbShop = await ShopModel.findById(shopId).lean();
    if (!dbShop) {
      throw new Error(`Shop with ID ${shopId} not found.`);
    }
    shop = {
      name: (dbShop as any).name,
      ownerName: (dbShop as any).ownerName,
      phone: (dbShop as any).phone,
      date: (dbShop as any).date || (dbShop as any).createdAt || Date.now(),
    };
  }

  const settings = await getOrCreateCompetitionSettings();
  const shopRegisteredAt = normalizeDate(shop.date!);
  const eligibilityDate = calculateEligibilityDate(
    shopRegisteredAt,
    settings.waitingPeriodDays
  );

  const schedule = calculateCohortSchedule(
    eligibilityDate,
    settings.entryWindowDays,
    settings.competitionDurationDays
  );

  // Ensure cohort document exists in MongoDB
  const cohort = await getOrCreateCohortByNumber(
    schedule.cohortNumber,
    settings
  );

  const shopObjectId =
    typeof shopId === "string" ? new Types.ObjectId(shopId) : shopId;

  // Check if participant already enrolled
  const existingParticipant = await CompetitionParticipantModel.findOne({
    cohortId: cohort._id,
    shopId: shopObjectId,
  });

  if (existingParticipant) {
    return {
      cohort,
      participant: existingParticipant,
      isNewEnrollment: false,
    };
  }

  // Create participant enrollment
  const participant = await CompetitionParticipantModel.create({
    cohortId: cohort._id,
    cohortNumber: cohort.cohortNumber,
    shopId: shopObjectId,
    shopName: shop.name || "Salon Partner",
    ownerName: shop.ownerName || "Shop Owner",
    ownerPhone: shop.phone || "0000000000",
    shopRegisteredAt,
    eligibilityDate,
    liveBookingCount: 0,
  });

  // Increment participant count on cohort
  await CompetitionCohortModel.findByIdAndUpdate(cohort._id, {
    $inc: { participantCount: 1 },
  });

  return {
    cohort,
    participant,
    isNewEnrollment: true,
  };
}

/**
 * Retrieves the enrolled cohort and participant record for a shop
 */
export async function getShopCohortInfo(
  shopId: string | Types.ObjectId
): Promise<{
  cohort: ICompetitionCohort | null;
  participant: ICompetitionParticipant | null;
}> {
  await dbConnect();
  const shopObjectId =
    typeof shopId === "string" ? new Types.ObjectId(shopId) : shopId;

  const participant = await CompetitionParticipantModel.findOne({
    shopId: shopObjectId,
  })
    .sort({ cohortNumber: -1 })
    .lean();

  if (!participant) {
    return { cohort: null, participant: null };
  }

  const cohort = await CompetitionCohortModel.findById(
    participant.cohortId
  ).lean();

  return {
    cohort: cohort as any,
    participant: participant as any,
  };
}

/**
 * Backfills / synchronizes all existing shops in the database into their respective cohorts.
 * Safe to run multiple times (idempotent).
 */
export async function syncAllExistingShopsToCohorts(): Promise<{
  totalShops: number;
  newlyEnrolled: number;
  alreadyEnrolled: number;
  cohortsCount: number;
}> {
  await dbConnect();
  const allShops = await ShopModel.find(
    {},
    "_id name ownerName phone date createdAt"
  ).lean();

  let newlyEnrolled = 0;
  let alreadyEnrolled = 0;

  for (const shop of allShops) {
    try {
      const res = await assignShopToCohort(shop._id, {
        name: (shop as any).name,
        ownerName: (shop as any).ownerName,
        phone: (shop as any).phone,
        date: (shop as any).date || (shop as any).createdAt,
      });

      if (res.isNewEnrollment) {
        newlyEnrolled++;
      } else {
        alreadyEnrolled++;
      }
    } catch (err) {
      console.error(`Failed to assign shop ${shop._id} to cohort:`, err);
    }
  }

  const cohortsCount = await CompetitionCohortModel.countDocuments();

  return {
    totalShops: allShops.length,
    newlyEnrolled,
    alreadyEnrolled,
    cohortsCount,
  };
}

/**
 * Calculates live rankings for all participating shops in a cohort strictly
 * within the cohort's competition period with deterministic tie-breaking.
 */
export async function calculateCohortLiveRankings(
  cohortId: string | Types.ObjectId
): Promise<{
  cohort: ICompetitionCohort;
  rankings: ICompetitionRankedEntry[];
  topWinners: ICompetitionTopWinner[];
  totalParticipants: number;
}> {
  await dbConnect();
  const cohortObjectId =
    typeof cohortId === "string" ? new Types.ObjectId(cohortId) : cohortId;

  const cohort = await CompetitionCohortModel.findById(cohortObjectId).lean();
  if (!cohort) {
    throw new Error(`Cohort with ID ${cohortId} not found.`);
  }

  const participants = await CompetitionParticipantModel.find({
    cohortId: cohortObjectId,
  }).lean();

  if (participants.length === 0) {
    return {
      cohort: cohort as any,
      rankings: [],
      topWinners: [],
      totalParticipants: 0,
    };
  }

  const shopIds = participants.map((p) => String(p.shopId));

  // Query non-cancelled bookings for all participating shops
  const bookings = await BookingModel.find({
    shopId: { $in: shopIds },
    cancelled: { $ne: true },
    status: { $nin: ["cancelled", "held"] },
  })
    .select("shopId slotDate slotTime bookingTime status isCompleted createdAt")
    .lean();

  const compStartMs = new Date(cohort.competitionStartDate).getTime();
  const compEndMs = new Date(cohort.competitionEndDate).getTime();

  // Aggregate completed bookings within competition date window per shop
  const shopStatsMap = new Map<
    string,
    { count: number; lastMilestoneAt?: number }
  >();

  for (const b of bookings) {
    if (!b.shopId) continue;
    const isComp = isBookingCompleted(b as any);
    if (!isComp) continue;

    const parsedDate = parseSlotDateTime((b as any).slotDate, (b as any).slotTime);
    const appointmentDate = parsedDate || (b as any).bookingTime || (b as any).createdAt;
    if (!appointmentDate) continue;

    const appMs = new Date(appointmentDate).getTime();
    // Strict date boundary check
    if (appMs >= compStartMs && appMs <= compEndMs) {
      const sId = String(b.shopId);
      const existing = shopStatsMap.get(sId) || { count: 0, lastMilestoneAt: 0 };
      existing.count += 1;
      existing.lastMilestoneAt = Math.max(existing.lastMilestoneAt || 0, appMs);
      shopStatsMap.set(sId, existing);
    }
  }

  // Build participant ranking array with deterministic sorting data
  const participantList = participants.map((p) => {
    const sId = String(p.shopId);
    const stats = shopStatsMap.get(sId) || { count: 0, lastMilestoneAt: undefined };
    const liveCount = stats.count;
    const lastMilestoneAt = stats.lastMilestoneAt
      ? new Date(stats.lastMilestoneAt)
      : (p as any).lastBookingMilestoneAt
      ? new Date((p as any).lastBookingMilestoneAt)
      : undefined;

    return {
      shopId: p.shopId as Types.ObjectId,
      shopName: p.shopName || "Salon Partner",
      ownerName: p.ownerName || "Shop Owner",
      ownerPhone: p.ownerPhone || "0000000000",
      shopRegisteredAt: new Date(p.shopRegisteredAt || Date.now()),
      completedBookings: liveCount,
      lastMilestoneAt,
    };
  });

  // Deterministic multi-tier sort:
  // 1. Completed Bookings (Descending)
  // 2. Earliest Milestone Timestamp (Ascending - first to reach count wins)
  // 3. Earliest Shop Registration Date (Ascending)
  participantList.sort((a, b) => {
    if (b.completedBookings !== a.completedBookings) {
      return b.completedBookings - a.completedBookings;
    }
    if (a.completedBookings > 0 && a.lastMilestoneAt && b.lastMilestoneAt) {
      const timeDiff = a.lastMilestoneAt.getTime() - b.lastMilestoneAt.getTime();
      if (timeDiff !== 0) return timeDiff;
    }
    return a.shopRegisteredAt.getTime() - b.shopRegisteredAt.getTime();
  });

  const rewards = cohort.rewardsConfig || {
    firstPlace: 10000,
    secondPlace: 5000,
    thirdPlace: 2000,
  };

  const rankings: ICompetitionRankedEntry[] = participantList.map(
    (item, index) => {
      const rank = index + 1;
      let rewardAmount = 0;
      let isWinner = false;

      // Only award rewards if the shop actually completed at least 1 booking
      if (item.completedBookings > 0) {
        if (rank === 1) {
          rewardAmount = rewards.firstPlace || 10000;
          isWinner = true;
        } else if (rank === 2) {
          rewardAmount = rewards.secondPlace || 5000;
          isWinner = true;
        } else if (rank === 3) {
          rewardAmount = rewards.thirdPlace || 2000;
          isWinner = true;
        }
      }

      // Check if tie-breaking occurred
      let tieBrokenBy: "bookings" | "milestone_time" | "registration_time" | "none" =
        "none";
      const prev = participantList[index - 1];
      const next = participantList[index + 1];

      if (
        (prev && prev.completedBookings === item.completedBookings) ||
        (next && next.completedBookings === item.completedBookings)
      ) {
        tieBrokenBy = "milestone_time";
      }

      return {
        rank,
        shopId: item.shopId,
        shopName: item.shopName,
        ownerName: item.ownerName,
        ownerPhone: item.ownerPhone,
        completedBookings: item.completedBookings,
        rewardAmount,
        isWinner,
        tieBrokenBy,
      };
    }
  );

  const topWinners: ICompetitionTopWinner[] = rankings
    .filter((r) => r.isWinner && r.rank <= 3)
    .map((r) => ({
      rank: r.rank,
      shopId: r.shopId,
      shopName: r.shopName,
      ownerName: r.ownerName,
      ownerPhone: r.ownerPhone,
      completedBookings: r.completedBookings,
      rewardAmount: r.rewardAmount,
    }));

  // Update participant cache in background (non-blocking)
  Promise.resolve().then(async () => {
    try {
      const updates = participantList.map((p) =>
        CompetitionParticipantModel.updateOne(
          { cohortId: cohortObjectId, shopId: p.shopId },
          {
            $set: {
              liveBookingCount: p.completedBookings,
              ...(p.lastMilestoneAt ? { lastBookingMilestoneAt: p.lastMilestoneAt } : {}),
            },
          }
        )
      );
      await Promise.all(updates);
    } catch (cacheErr) {
      console.warn("Failed to cache participant live booking counts:", cacheErr);
    }
  });

  return {
    cohort: cohort as any,
    rankings,
    topWinners,
    totalParticipants: participants.length,
  };
}

/**
 * Retrieves the live competition rank, leaderboard, and rewards for a specific shop owner dashboard
 */
export async function getShopLiveRanking(
  shopId: string | Types.ObjectId
): Promise<{
  cohort: ICompetitionCohort | null;
  status?: string;
  isUpcoming?: boolean;
  daysUntilStart?: number;
  competitionStartDate?: Date;
  competitionEndDate?: Date;
  cohortName?: string;
  rank: number;
  completedBookings: number;
  topRankBookings: number;
  isWinner: boolean;
  rewardAmount: string;
  maxReward: string;
  quarter: string;
  leaderboard: Array<{
    rank: number;
    name: string;
    bookings: number;
    prize: string;
    isCurrent: boolean;
  }>;
}> {
  await dbConnect();
  const shopObjectId =
    typeof shopId === "string" ? new Types.ObjectId(shopId) : shopId;

  let cohortInfo = await getShopCohortInfo(shopObjectId);
  if (!cohortInfo.cohort || !cohortInfo.participant) {
    // Attempt auto-enrollment
    const assigned = await assignShopToCohort(shopObjectId);
    cohortInfo = {
      cohort: assigned.cohort,
      participant: assigned.participant,
    };
  }

  if (!cohortInfo.cohort) {
    return {
      cohort: null,
      status: "UPCOMING",
      isUpcoming: true,
      daysUntilStart: 30,
      cohortName: "Cohort #1",
      rank: 1,
      completedBookings: 0,
      topRankBookings: 0,
      isWinner: false,
      rewardAmount: "₹5,000 – ₹10,000",
      maxReward: "₹5,000 – ₹10,000",
      quarter: "Q4 • 2026",
      leaderboard: [],
    };
  }

  const liveData = await calculateCohortLiveRankings(cohortInfo.cohort._id);
  const currentShopIdStr = String(shopObjectId);

  const shopEntryIndex = liveData.rankings.findIndex(
    (r) => String(r.shopId) === currentShopIdStr
  );

  const currentRank =
    shopEntryIndex >= 0 ? liveData.rankings[shopEntryIndex].rank : 1;
  const currentBookings =
    shopEntryIndex >= 0 ? liveData.rankings[shopEntryIndex].completedBookings : 0;
  const topRankBookings =
    liveData.rankings.length > 0
      ? liveData.rankings[0].completedBookings
      : currentBookings;

  const isWinner =
    shopEntryIndex >= 0 &&
    liveData.rankings[shopEntryIndex].isWinner &&
    liveData.rankings[shopEntryIndex].rank === 1;

  const currentRewardAmount =
    shopEntryIndex >= 0 && liveData.rankings[shopEntryIndex].rewardAmount > 0
      ? `₹${liveData.rankings[shopEntryIndex].rewardAmount.toLocaleString("en-IN")}`
      : "₹5,000 – ₹10,000";

  const maxRewardAmount = liveData.cohort.rewardsConfig?.firstPlace
    ? `₹${liveData.cohort.rewardsConfig.firstPlace.toLocaleString("en-IN")}`
    : "₹10,000";

  // Build top 5 leaderboard
  const top5 = liveData.rankings.slice(0, 5).map((entry) => ({
    rank: entry.rank,
    name: entry.shopName,
    bookings: entry.completedBookings,
    prize:
      entry.rank === 1
        ? "₹5,000 – ₹10,000"
        : entry.rank === 2
        ? "₹2,000 – ₹5,000"
        : entry.rank === 3
        ? "₹1,000 – ₹2,000"
        : "-",
    isCurrent: String(entry.shopId) === currentShopIdStr,
  }));

  // If current shop is outside top 5, append it to the leaderboard list
  if (shopEntryIndex >= 5) {
    const entry = liveData.rankings[shopEntryIndex];
    top5.push({
      rank: entry.rank,
      name: entry.shopName,
      bookings: entry.completedBookings,
      prize: "-",
      isCurrent: true,
    });
  }

  const startDate = new Date(liveData.cohort.competitionStartDate);
  const quarterNum = Math.floor(startDate.getUTCMonth() / 3) + 1;
  const quarterString = `Q${quarterNum} • ${startDate.getUTCFullYear()}`;

  const now = new Date();
  const isUpcoming = now.getTime() < startDate.getTime();
  const diffDays = Math.ceil(
    (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysUntilStart = Math.max(0, diffDays);

  return {
    cohort: liveData.cohort,
    status: liveData.cohort.status,
    isUpcoming,
    daysUntilStart,
    competitionStartDate: liveData.cohort.competitionStartDate,
    competitionEndDate: liveData.cohort.competitionEndDate,
    cohortName: liveData.cohort.name,
    rank: currentRank,
    completedBookings: currentBookings,
    topRankBookings,
    isWinner,
    rewardAmount: currentRewardAmount,
    maxReward: maxRewardAmount,
    quarter: quarterString,
    leaderboard: top5,
  };
}

/**
 * Records a booking milestone timestamp when an appointment is completed
 */
export async function recordBookingCompletionMilestone(
  shopId: string | Types.ObjectId,
  _bookingId?: string | Types.ObjectId
): Promise<void> {
  await dbConnect();
  const shopObjectId =
    typeof shopId === "string" ? new Types.ObjectId(shopId) : shopId;

  const now = new Date();

  await CompetitionParticipantModel.updateMany(
    { shopId: shopObjectId },
    {
      $inc: { liveBookingCount: 1 },
      $set: { lastBookingMilestoneAt: now },
    }
  );
}

/**
 * Finalizes a cohort by computing final rankings, creating an immutable CompetitionResult snapshot,
 * and transitioning the cohort status to COMPLETED.
 * Strictly idempotent (will not overwrite an existing snapshot).
 */
export async function finalizeCohort(
  cohortId: string | Types.ObjectId
): Promise<ICompetitionResult> {
  await dbConnect();
  const cohortObjectId =
    typeof cohortId === "string" ? new Types.ObjectId(cohortId) : cohortId;

  // Idempotency: Return existing snapshot if already finalized
  const existingResult = await CompetitionResultModel.findOne({
    cohortId: cohortObjectId,
  });

  if (existingResult) {
    return existingResult;
  }

  const cohort = await CompetitionCohortModel.findById(cohortObjectId);
  if (!cohort) {
    throw new Error(`Cohort with ID ${cohortId} not found.`);
  }

  // Compute final deterministic rankings
  const liveData = await calculateCohortLiveRankings(cohortObjectId);

  // Generate permanent, immutable snapshot
  const result = await CompetitionResultModel.create({
    cohortId: cohort._id,
    cohortNumber: cohort.cohortNumber,
    cohortName: cohort.name,
    entryWindowStart: cohort.entryWindowStart,
    entryWindowEnd: cohort.entryWindowEnd,
    competitionStartDate: cohort.competitionStartDate,
    competitionEndDate: cohort.competitionEndDate,
    totalParticipants: liveData.totalParticipants,
    rankings: liveData.rankings,
    topWinners: liveData.topWinners,
    snapshottedAt: new Date(),
  });

  // Mark cohort as COMPLETED in database
  cohort.status = "COMPLETED";
  cohort.completedAt = new Date();
  await cohort.save();

  return result;
}

/**
 * Checks all active cohorts and automatically finalizes any cohorts whose competition end date has passed.
 * Returns the count and IDs of finalized cohorts.
 */
export async function checkAndFinalizeEndedCohorts(): Promise<{
  finalizedCount: number;
  finalizedCohortIds: string[];
}> {
  await dbConnect();
  const now = new Date();

  const endedCohorts = await CompetitionCohortModel.find({
    status: { $ne: "COMPLETED" },
    competitionEndDate: { $lte: now },
  });

  const finalizedCohortIds: string[] = [];

  for (const cohort of endedCohorts) {
    try {
      await finalizeCohort(cohort._id);
      finalizedCohortIds.push(String(cohort._id));
    } catch (err) {
      console.error(`Failed to auto-finalize cohort ${cohort.cohortNumber}:`, err);
    }
  }

  return {
    finalizedCount: finalizedCohortIds.length,
    finalizedCohortIds,
  };
}

/**
 * Retrieves the historical result snapshot for a completed cohort.
 * If the cohort has ended but has not yet been snapshotted, automatically triggers finalization.
 */
export async function getCohortResult(
  cohortId: string | Types.ObjectId
): Promise<ICompetitionResult | null> {
  await dbConnect();
  const cohortObjectId =
    typeof cohortId === "string" ? new Types.ObjectId(cohortId) : cohortId;

  let result = await CompetitionResultModel.findOne({
    cohortId: cohortObjectId,
  }).lean();

  if (result) {
    return result as any;
  }

  const cohort = await CompetitionCohortModel.findById(cohortObjectId);
  if (!cohort) return null;

  // Lazy evaluation: If competition end date has passed, finalize immediately
  if (new Date() >= new Date(cohort.competitionEndDate)) {
    const freshResult = await finalizeCohort(cohort._id);
    return freshResult;
  }

  return null;
}
