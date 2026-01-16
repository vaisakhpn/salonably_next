import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    await dbConnect();

    // Escape special characters for regex
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedQuery, "i");

    const suggestions = await ShopModel.find({
      $or: [
        { name: { $regex: regex } },
        { "address.line1": { $regex: regex } },
        { "address.line2": { $regex: regex } },
      ],
      available: true,
    })
      .select("_id name address image")
      .limit(5)
      .lean();

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Search suggestions error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", suggestions: [] },
      { status: 500 }
    );
  }
}
