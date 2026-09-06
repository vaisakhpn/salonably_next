import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createReferralLink,
  validateReferrerPhone,
  normalizePhoneNumber,
} from "@/server/services/referralService";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Configure Cloudinary if credentials exist
const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_SECRET_KEY;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = (formData.get("name") as string)?.trim();
    const ownerName = (formData.get("ownerName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const phone = (formData.get("phone") as string)?.trim();
    const password = formData.get("password") as string;
    const fees = formData.get("fees") as string;
    const about = (formData.get("about") as string)?.trim();
    const addressLine1 = (formData.get("addressLine1") as string)?.trim();
    const addressLine2 = (formData.get("addressLine2") as string)?.trim();
    const referralPhone = (formData.get("referralPhone") as string)?.trim();
    const imageFile = formData.get("image") as File | null;

    // Basic validation
    if (!name || !ownerName || !email || !phone || !password) {
      return NextResponse.json(
        { message: "Please provide all required fields (Shop Name, Owner Name, Email, Phone, Password)." },
        { status: 400 }
      );
    }

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { message: "A photo of your salon/shop is required to complete registration." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check existing shop by email or phone
    const existingShop = await ShopModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingShop) {
      return NextResponse.json(
        { message: "A shop with this email or phone number already exists." },
        { status: 400 }
      );
    }

    // Validate referral phone if provided
    let referrerValidation: any = null;
    if (referralPhone) {
      const normalizedRefPhone = normalizePhoneNumber(referralPhone);
      const normalizedShopPhone = normalizePhoneNumber(phone);

      if (normalizedRefPhone === normalizedShopPhone) {
        return NextResponse.json(
          { message: "Self-referral is not allowed. A salon cannot enter its own phone number as the referrer." },
          { status: 400 }
        );
      }

      referrerValidation = await validateReferrerPhone(normalizedRefPhone);
      if (!referrerValidation.valid) {
        return NextResponse.json(
          {
            message:
              referrerValidation.message ||
              "Invalid Referral Phone Number: No active referral profile found with this number.",
          },
          { status: 400 }
        );
      }
    }

    // Default image fallback if no file or Cloudinary isn't available
    let imageUrl = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80";

    if (imageFile && imageFile.size > 0 && cloudName && apiKey && apiSecret) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        if (uploadResponse?.secure_url) {
          imageUrl = uploadResponse.secure_url;
        }
      } catch (uploadError) {
        console.warn("Cloudinary upload fallback due to error:", uploadError);
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Format address object
    const address = {
      line1: addressLine1 || "Main Street",
      line2: addressLine2 || "City Center",
    };

    // Create Shop Record
    const newShop = await ShopModel.create({
      name,
      ownerName,
      email,
      phone,
      password: hashedPassword,
      image: imageUrl,
      about: about || `Welcome to ${name}, providing luxury beauty and salon services.`,
      fees: fees ? Number(fees) : 500,
      address,
      available: true,
      date: Date.now(),
      slots_booked: {},
      availableSlots: ["11:00 AM", "03:00 PM", "06:30 PM"],
      closedDays: [],
    });

    // Link Referral if referralPhone was provided
    let referralLinked = false;
    if (referralPhone) {
      try {
        const referralRecord = await createReferralLink({
          shopId: newShop._id,
          referrerPhone: referralPhone,
          shopPhone: newShop.phone,
          shopOwnerEmail: newShop.email,
        });
        if (referralRecord) {
          referralLinked = true;
        }
      } catch (refError) {
        console.error("Error creating referral link during shop registration:", refError);
      }
    }

    // Generate JWT Auth Token
    const token = jwt.sign(
      { shopId: newShop._id, email: newShop.email, role: "shop" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const successMessage = referralLinked
      ? `Shop registered successfully! Referral linked to ${referrerValidation?.profile?.referrerName || "your referrer"}.`
      : "Shop registered successfully! Welcome aboard.";

    const response = NextResponse.json(
      {
        message: successMessage,
        shop: {
          id: newShop._id,
          name: newShop.name,
          ownerName: newShop.ownerName,
          email: newShop.email,
          image: newShop.image,
        },
      },
      { status: 201 }
    );

    // Set shop_token cookie
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
  } catch (error: any) {
    console.error("Shop registration error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return NextResponse.json(
        { message: `A shop with this ${field} already exists.` },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
