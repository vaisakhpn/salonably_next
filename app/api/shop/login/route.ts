import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`shop_login_${clientIp}`, 10, 60000);
    if (!limiter.success) {
      return NextResponse.json(
        { message: "Too many login attempts. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please provide both email/phone and password" },
        { status: 400 }
      );
    }

    const identifier = String(email).trim();
    const cleanPhone = identifier.replace(/\D/g, "");
    const isPhone = cleanPhone.length === 10;

    await dbConnect();

    // Support login via either email or 10-digit phone number
    const shop = await ShopModel.findOne(
      isPhone
        ? { phone: cleanPhone }
        : { email: identifier.toLowerCase() }
    );

    if (!shop) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Hash and compare passwords
    const isMatch = await bcrypt.compare(password, shop.password);

    if (!isMatch) {
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

    // Clear other role sessions
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
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
