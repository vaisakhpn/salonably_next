import { NextResponse } from "next/server";
import dbConnect from "../../../../server/db/mongodb";
import ShopModel from "../../../../server/models/Shop";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please provide all fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const shop = await ShopModel.findOne({ email });

    if (!shop) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // In a real app, hash and compare passwords.
    // Assuming simple comparison for now based on previous code.
    if (shop.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { shopId: shop._id, email: shop.email, role: "shop" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        shop: {
          id: shop._id,
          name: shop.name,
          email: shop.email,
          image: shop.image,
        },
      },
      { status: 200 }
    );

    response.cookies.set("shop_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Shop login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
