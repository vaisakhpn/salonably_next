import { NextResponse } from "next/server";
import { getUser } from "@/server/middleware/auth";
import User from "@/server/models/User";
import dbConnect from "@/server/db/mongodb";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // getUser already returns the user object, but let's fetch fresh data just in case
    // or we can just return what getUser gave us since it fetches from DB
    // However, getUser returns a plain object, let's stick with that for efficiency
    // But wait, getUser selects -password.

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, image } = body;

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, phone, image },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
