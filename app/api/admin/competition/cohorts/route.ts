import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { isAdmin } from "@/server/middleware/auth";
import CompetitionCohortModel from "@/server/models/CompetitionCohort";
import CompetitionParticipantModel from "@/server/models/CompetitionParticipant";
import CompetitionResultModel from "@/server/models/CompetitionResult";
import {
  checkAndFinalizeEndedCohorts,
  calculateCohortLiveRankings,
} from "@/server/services/competitionService";

export async function GET(req: Request) {
  try {
    const adminAuthorized = await isAdmin();
    if (!adminAuthorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Lazy evaluation: Automatically finalize any cohorts whose competition period has ended
    try {
      await checkAndFinalizeEndedCohorts();
    } catch (finalizeErr) {
      console.warn("Auto-finalization check encountered error:", finalizeErr);
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status"); // "all" | "active" | "completed" | "upcoming"

    const filterQuery: any = {};
    if (statusFilter && ["ACTIVE", "COMPLETED", "UPCOMING"].includes(statusFilter.toUpperCase())) {
      filterQuery.status = statusFilter.toUpperCase();
    }

    const [
      cohorts,
      totalCohorts,
      activeCohortsCount,
      completedCohortsCount,
      upcomingCohortsCount,
      totalParticipantsCount,
    ] = await Promise.all([
      CompetitionCohortModel.find(filterQuery).sort({ cohortNumber: -1 }).lean(),
      CompetitionCohortModel.countDocuments(),
      CompetitionCohortModel.countDocuments({ status: "ACTIVE" }),
      CompetitionCohortModel.countDocuments({ status: "COMPLETED" }),
      CompetitionCohortModel.countDocuments({ status: "UPCOMING" }),
      CompetitionParticipantModel.countDocuments(),
    ]);

    // Enrich cohorts with winner / leader previews
    const enrichedCohorts = await Promise.all(
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
          entryWindowStart: cohort.entryWindowStart,
          entryWindowEnd: cohort.entryWindowEnd,
          competitionStartDate: cohort.competitionStartDate,
          competitionEndDate: cohort.competitionEndDate,
          status: cohort.status,
          participantCount: cohort.participantCount || 0,
          rewardsConfig: cohort.rewardsConfig || {
            firstPlace: 10000,
            secondPlace: 5000,
            thirdPlace: 2000,
          },
          winnerPreview,
          leaderPreview,
          completedAt: cohort.completedAt,
        };
      })
    );

    return NextResponse.json(
      {
        metrics: {
          totalCohorts,
          activeCohortsCount,
          completedCohortsCount,
          upcomingCohortsCount,
          totalParticipantsCount,
        },
        cohorts: enrichedCohorts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin cohorts:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
