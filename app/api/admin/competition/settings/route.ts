import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { isAdmin } from "@/server/middleware/auth";
import CompetitionSettingModel from "@/server/models/CompetitionSetting";
import { getOrCreateCompetitionSettings } from "@/server/services/competitionService";

export async function GET() {
  try {
    const adminAuthorized = await isAdmin();
    if (!adminAuthorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const settings = await getOrCreateCompetitionSettings();

    return NextResponse.json(
      {
        settings: {
          waitingPeriodDays: settings.waitingPeriodDays,
          entryWindowDays: settings.entryWindowDays,
          competitionDurationDays: settings.competitionDurationDays,
          rewards: settings.rewards || {
            firstPlace: 10000,
            secondPlace: 5000,
            thirdPlace: 2000,
          },
          isCompetitionActive: settings.isCompetitionActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching competition settings:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const adminAuthorized = await isAdmin();
    if (!adminAuthorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      waitingPeriodDays,
      entryWindowDays,
      competitionDurationDays,
      rewards,
      isCompetitionActive,
    } = body;

    await dbConnect();
    let settings = await CompetitionSettingModel.findOne({ key: "global" });

    if (!settings) {
      settings = new CompetitionSettingModel({ key: "global" });
    }

    if (typeof waitingPeriodDays === "number" && waitingPeriodDays >= 0) {
      settings.waitingPeriodDays = waitingPeriodDays;
    }
    if (typeof entryWindowDays === "number" && entryWindowDays >= 1) {
      settings.entryWindowDays = entryWindowDays;
    }
    if (typeof competitionDurationDays === "number" && competitionDurationDays >= 1) {
      settings.competitionDurationDays = competitionDurationDays;
    }
    if (typeof isCompetitionActive === "boolean") {
      settings.isCompetitionActive = isCompetitionActive;
    }

    if (rewards && typeof rewards === "object") {
      settings.rewards = {
        firstPlace: Number(rewards.firstPlace) || settings.rewards?.firstPlace || 10000,
        secondPlace: Number(rewards.secondPlace) || settings.rewards?.secondPlace || 5000,
        thirdPlace: Number(rewards.thirdPlace) || settings.rewards?.thirdPlace || 2000,
      };
    }

    await settings.save();

    return NextResponse.json(
      {
        message: "Competition settings updated successfully",
        settings: {
          waitingPeriodDays: settings.waitingPeriodDays,
          entryWindowDays: settings.entryWindowDays,
          competitionDurationDays: settings.competitionDurationDays,
          rewards: settings.rewards,
          isCompetitionActive: settings.isCompetitionActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating competition settings:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
