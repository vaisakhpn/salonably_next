import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { isAdmin } from "@/server/middleware/auth";
import CompetitionCohortModel from "@/server/models/CompetitionCohort";
import {
  getCohortResult,
  calculateCohortLiveRankings,
} from "@/server/services/competitionService";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminAuthorized = await isAdmin();
    if (!adminAuthorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Cohort ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const cohort = await CompetitionCohortModel.findById(id).lean();
    if (!cohort) {
      return NextResponse.json(
        { message: "Cohort not found" },
        { status: 404 }
      );
    }

    // Check if cohort is completed and has historical snapshot
    const historicalSnapshot = await getCohortResult(cohort._id);

    if (historicalSnapshot) {
      return NextResponse.json(
        {
          cohort: {
            id: cohort._id.toString(),
            cohortNumber: cohort.cohortNumber,
            name: cohort.name,
            entryWindowStart: cohort.entryWindowStart,
            entryWindowEnd: cohort.entryWindowEnd,
            competitionStartDate: cohort.competitionStartDate,
            competitionEndDate: cohort.competitionEndDate,
            status: "COMPLETED",
            participantCount: historicalSnapshot.totalParticipants,
            rewardsConfig: cohort.rewardsConfig || {
              firstPlace: 10000,
              secondPlace: 5000,
              thirdPlace: 2000,
            },
            completedAt: cohort.completedAt || historicalSnapshot.snapshottedAt,
          },
          isFinalized: true,
          snapshottedAt: historicalSnapshot.snapshottedAt,
          topWinners: historicalSnapshot.topWinners || [],
          rankings: historicalSnapshot.rankings || [],
          totalParticipants: historicalSnapshot.totalParticipants || 0,
        },
        { status: 200 }
      );
    }

    // Cohort is active or upcoming: Calculate live rankings
    const liveData = await calculateCohortLiveRankings(cohort._id);

    return NextResponse.json(
      {
        cohort: {
          id: cohort._id.toString(),
          cohortNumber: cohort.cohortNumber,
          name: cohort.name,
          entryWindowStart: cohort.entryWindowStart,
          entryWindowEnd: cohort.entryWindowEnd,
          competitionStartDate: cohort.competitionStartDate,
          competitionEndDate: cohort.competitionEndDate,
          status: liveData.cohort.status,
          participantCount: liveData.totalParticipants,
          rewardsConfig: liveData.cohort.rewardsConfig || {
            firstPlace: 10000,
            secondPlace: 5000,
            thirdPlace: 2000,
          },
        },
        isFinalized: false,
        topWinners: liveData.topWinners,
        rankings: liveData.rankings,
        totalParticipants: liveData.totalParticipants,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cohort details:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
