import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("shop_token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    const shopId = decoded.shopId;

    const { phone, fees, address, available, availableSlots } =
      await req.json();

    await dbConnect();

    const updatedShop = await ShopModel.findByIdAndUpdate(
      shopId,
      { phone, fees, address, available, availableSlots },
      { new: true }
    );

    if (!updatedShop) {
      return NextResponse.json({ message: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully", shop: updatedShop },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
