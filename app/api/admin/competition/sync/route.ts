import { NextResponse } from "next/server";
import { isAdmin } from "@/server/middleware/auth";
import {
  syncAllExistingShopsToCohorts,
  checkAndFinalizeEndedCohorts,
} from "@/server/services/competitionService";

export async function POST() {
  try {
    const adminAuthorized = await isAdmin();
    if (!adminAuthorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [syncStats, finalizedStats] = await Promise.all([
      syncAllExistingShopsToCohorts(),
      checkAndFinalizeEndedCohorts(),
    ]);

    return NextResponse.json(
      {
        message: "Competition sync and finalization completed successfully.",
        syncStats,
        finalizedStats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error running competition sync:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
