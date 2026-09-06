import React from "react";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import jwt from "jsonwebtoken";
import dbConnect from "@/server/db/mongodb";
import CompetitionCohortModel from "@/server/models/CompetitionCohort";
import {
  getCohortResult,
  calculateCohortLiveRankings,
} from "@/server/services/competitionService";
import CohortDetails, {
  CohortDetailsData,
  CohortParticipantRank,
} from "@/components/Admin/CohortDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cohort Details & Standings | LockMyTime Admin",
  description: "Detailed cohort standings, top 3 champions podium, and complete salon participant table.",
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CohortDetailPage = async ({ params }: PageProps) => {
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

  const { id } = await params;
  if (!id) {
    notFound();
  }

  await dbConnect();

  const cohort = await CompetitionCohortModel.findById(id).lean();
  if (!cohort) {
    notFound();
  }

  const historicalSnapshot = await getCohortResult(cohort._id);

  let isFinalized = false;
  let snapshottedAt: string | undefined = undefined;
  let rankings: CohortParticipantRank[] = [];
  let totalParticipants = (cohort as any).participantCount || 0;

  if (historicalSnapshot) {
    isFinalized = true;
    snapshottedAt = historicalSnapshot.snapshottedAt
      ? historicalSnapshot.snapshottedAt.toISOString()
      : undefined;
    totalParticipants = historicalSnapshot.totalParticipants;
    rankings = (historicalSnapshot.rankings || []).map((r: any) => ({
      rank: r.rank,
      shopId: r.shopId ? r.shopId.toString() : "",
      shopName: r.shopName || "Salon Partner",
      ownerName: r.ownerName || "Shop Owner",
      ownerPhone: r.ownerPhone || "0000000000",
      completedBookings: r.completedBookings || 0,
      rewardAmount: r.rewardAmount || 0,
      isWinner: !!r.isWinner,
      tieBrokenBy: r.tieBrokenBy,
    }));
  } else {
    // Cohort is active or upcoming: Calculate live standings
    const liveData = await calculateCohortLiveRankings(cohort._id);
    totalParticipants = liveData.totalParticipants;
    rankings = liveData.rankings.map((r: any) => ({
      rank: r.rank,
      shopId: r.shopId ? r.shopId.toString() : "",
      shopName: r.shopName || "Salon Partner",
      ownerName: r.ownerName || "Shop Owner",
      ownerPhone: r.ownerPhone || "0000000000",
      completedBookings: r.completedBookings || 0,
      rewardAmount: r.rewardAmount || 0,
      isWinner: !!r.isWinner,
      tieBrokenBy: r.tieBrokenBy,
    }));
  }

  const cohortData: CohortDetailsData = {
    id: (cohort as any)._id.toString(),
    cohortNumber: (cohort as any).cohortNumber,
    name: (cohort as any).name,
    entryWindowStart: (cohort as any).entryWindowStart
      ? (cohort as any).entryWindowStart.toISOString()
      : "",
    entryWindowEnd: (cohort as any).entryWindowEnd
      ? (cohort as any).entryWindowEnd.toISOString()
      : "",
    competitionStartDate: (cohort as any).competitionStartDate
      ? (cohort as any).competitionStartDate.toISOString()
      : "",
    competitionEndDate: (cohort as any).competitionEndDate
      ? (cohort as any).competitionEndDate.toISOString()
      : "",
    status: (cohort as any).status,
    participantCount: totalParticipants,
    rewardsConfig: (cohort as any).rewardsConfig || {
      firstPlace: 10000,
      secondPlace: 5000,
      thirdPlace: 2000,
    },
    completedAt: (cohort as any).completedAt
      ? (cohort as any).completedAt.toISOString()
      : undefined,
  };

  return (
    <CohortDetails
      cohort={cohortData}
      isFinalized={isFinalized}
      snapshottedAt={snapshottedAt}
      rankings={rankings}
      totalParticipants={totalParticipants}
    />
  );
};

export default CohortDetailPage;
