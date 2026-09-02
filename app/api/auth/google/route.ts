import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import dbConnect from "@/server/db/mongodb";
import User from "@/server/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { message: "Google credential is required" },
        { status: 400 }
      );
    }

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

    if (!googleClientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing in environment variables");
      return NextResponse.json(
        { message: "Google Client ID is not configured on the server. Please restart your dev server after adding .env.local." },
        { status: 500 }
      );
    }

    let payload: {
      email?: string;
      name?: string;
      picture?: string;
      sub?: string;
    } | undefined;

    // 1. Verify via google-auth-library
    try {
      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.warn("verifyIdToken error, attempting direct Google tokeninfo fallback:", verifyErr);
      // Fallback: Verify via Google's tokeninfo API directly
      const tokenInfoRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
      );
      if (tokenInfoRes.ok) {
        payload = await tokenInfoRes.json();
      } else {
        const errText = await tokenInfoRes.text();
        console.error("Tokeninfo verification failed:", errText);
        return NextResponse.json(
          { message: "Invalid Google token signature or expired token" },
          { status: 401 }
        );
      }
    }

    if (!payload || !payload.email) {
      return NextResponse.json(
        { message: "Unable to retrieve email from Google token payload" },
        { status: 400 }
      );
    }

    const { email, name, picture, sub } = payload;

    await dbConnect();

    // Check if user already exists with this email
    let user = await User.findOne({ email });

    if (user) {
      let hasChanges = false;
      if (!user.googleId && sub) {
        user.googleId = sub;
        hasChanges = true;
      }
      if (
        picture &&
        (!user.image ||
          user.image.includes("iconfinder.com") ||
          user.image.includes("default"))
      ) {
        user.image = picture;
        hasChanges = true;
      }
      if (hasChanges) {
        await user.save();
      }
    } else {
      // Create new user with Google profile details
      user = await User.create({
        name: name || "User",
        email: email,
        image:
          picture ||
          "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png",
        googleId: sub,
        authProvider: "google",
      });
    }

    // Generate JWT token matching existing session format
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        message: "Google login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
      { status: 200 }
    );

    // Set auth cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // Clear other role sessions
    response.cookies.set("shop_token", "", {
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
    console.error("Google Auth Backend Error:", error);
    return NextResponse.json(
      {
        message: "Google authentication failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
