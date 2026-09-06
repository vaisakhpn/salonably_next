import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import dbConnect from "@/server/db/mongodb";
import CompetitionCohortModel from "@/server/models/CompetitionCohort";
import CompetitionParticipantModel from "@/server/models/CompetitionParticipant";
import CompetitionResultModel from "@/server/models/CompetitionResult";
import {
  checkAndFinalizeEndedCohorts,
  calculateCohortLiveRankings,
  getOrCreateCompetitionSettings,
} from "@/server/services/competitionService";
import CompetitionManagement, {
  CohortPreview,
  CompetitionSettingsData,
} from "@/components/Admin/CompetitionManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quarterly Competitions | LockMyTime Admin",
  description: "Monitor competition cohorts, live leaderboards, historical winner podiums, and cash awards.",
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const AdminCompetitionsPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin");
  }

  try {
    jwt.verify(token.value, JWT_SECRET);
  } catch (err) {
    redirect("/admin");
  }

  await dbConnect();

  // Lazy evaluation: Auto-finalize any ended cohorts
  try {
    await checkAndFinalizeEndedCohorts();
  } catch (err) {
    console.warn("Auto-finalization check error on admin page load:", err);
  }

  const [
    cohorts,
    totalCohorts,
    activeCohortsCount,
    completedCohortsCount,
    upcomingCohortsCount,
    totalParticipantsCount,
    rawSettings,
  ] = await Promise.all([
    CompetitionCohortModel.find({}).sort({ cohortNumber: -1 }).lean(),
    CompetitionCohortModel.countDocuments(),
    CompetitionCohortModel.countDocuments({ status: "ACTIVE" }),
    CompetitionCohortModel.countDocuments({ status: "COMPLETED" }),
    CompetitionCohortModel.countDocuments({ status: "UPCOMING" }),
    CompetitionParticipantModel.countDocuments(),
    getOrCreateCompetitionSettings(),
  ]);

  // Enrich cohorts with winner / leader previews
  const enrichedCohorts: CohortPreview[] = await Promise.all(
    cohorts.map(async (cohort: any) => {
      let winnerPreview: any = null;
      let leaderPreview: any = null;

      if (cohort.status === "COMPLETED") {
        const result = await CompetitionResultModel.findOne({
          cohortId: cohort._id,
        }).lean();

        if (result && (result as any).rankings?.length > 0) {
          const rank1 = (result as any).rankings[0];
          winnerPreview = {
            shopName: rank1.shopName,
            ownerName: rank1.ownerName,
            completedBookings: rank1.completedBookings,
            rewardAmount: rank1.rewardAmount,
          };
        }
      } else if (cohort.status === "ACTIVE") {
        try {
          const liveRankings = await calculateCohortLiveRankings(cohort._id);
          if (liveRankings.rankings.length > 0) {
            const rank1 = liveRankings.rankings[0];
            leaderPreview = {
              shopName: rank1.shopName,
              ownerName: rank1.ownerName,
              completedBookings: rank1.completedBookings,
            };
          }
        } catch (liveErr) {
          console.warn(`Failed to derive leader preview for cohort ${cohort.cohortNumber}:`, liveErr);
        }
      }

      return {
        id: cohort._id.toString(),
        cohortNumber: cohort.cohortNumber,
        name: cohort.name,
        entryWindowStart: cohort.entryWindowStart ? cohort.entryWindowStart.toISOString() : "",
        entryWindowEnd: cohort.entryWindowEnd ? cohort.entryWindowEnd.toISOString() : "",
        competitionStartDate: cohort.competitionStartDate ? cohort.competitionStartDate.toISOString() : "",
        competitionEndDate: cohort.competitionEndDate ? cohort.competitionEndDate.toISOString() : "",
        status: cohort.status,
        participantCount: cohort.participantCount || 0,
        rewardsConfig: cohort.rewardsConfig || {
          firstPlace: 10000,
          secondPlace: 5000,
          thirdPlace: 2000,
        },
        winnerPreview,
        leaderPreview,
        completedAt: cohort.completedAt ? cohort.completedAt.toISOString() : undefined,
      };
    })
  );

  const metricsData = {
    totalCohorts,
    activeCohortsCount,
    completedCohortsCount,
    upcomingCohortsCount,
    totalParticipantsCount,
  };

  const initialSettingsData: CompetitionSettingsData = {
    waitingPeriodDays: rawSettings.waitingPeriodDays,
    entryWindowDays: rawSettings.entryWindowDays,
    competitionDurationDays: rawSettings.competitionDurationDays,
    rewards: {
      firstPlace: rawSettings.rewards?.firstPlace ?? 10000,
      secondPlace: rawSettings.rewards?.secondPlace ?? 5000,
      thirdPlace: rawSettings.rewards?.thirdPlace ?? 2000,
    },
    isCompetitionActive: rawSettings.isCompetitionActive,
  };

  return (
    <CompetitionManagement
      initialMetrics={metricsData}
      initialCohorts={enrichedCohorts}
      initialSettings={initialSettingsData}
    />
  );
};

export default AdminCompetitionsPage;
