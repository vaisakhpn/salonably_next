import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";

export async function POST(req: Request) {
  try {
    const { docId } = await req.json();

    if (!docId) {
      return NextResponse.json(
        { message: "Shop ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const shop = await ShopModel.findById(docId);

    if (!shop) {
      return NextResponse.json({ message: "Shop not found" }, { status: 404 });
    }

    // Toggle availability
    // Note: The field in schema is 'available', default true.
    // If it's undefined, it defaults to true on creation, but we should handle inverses carefully.
    shop.available = !shop.available;

    await shop.save();

    return NextResponse.json(
      { message: "Availability updated", available: shop.available },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
