import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import bcrypt from "bcryptjs";

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
};

if (
  !cloudinaryConfig.cloud_name ||
  !cloudinaryConfig.api_key ||
  !cloudinaryConfig.api_secret
) {
  console.error("Cloudinary config missing:", {
    cloud_name: !!cloudinaryConfig.cloud_name,
    api_key: !!cloudinaryConfig.api_key,
    api_secret: !!cloudinaryConfig.api_secret,
  });
  throw new Error(
    "Cloudinary configuration is missing. Please check your .env.local file."
  );
}

cloudinary.config(cloudinaryConfig);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const about = formData.get("about") as string;
    const fees = formData.get("fees") as string;
    const address = formData.get("address") as string; // JSON string
    const phone = formData.get("phone") as string;
    const imageFile = formData.get("image") as File;
    const availableSlots = formData.get("availableSlots") as string; // JSON string

    if (!name || !email || !password || !imageFile) {
      // Basic validation
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if shop already exists
    const existingShop = await ShopModel.findOne({ email });
    if (existingShop) {
      return NextResponse.json(
        { message: "Shop with this email already exists" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    const imageUrl = uploadResponse.secure_url;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Shop
    const newShop = await ShopModel.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      about,
      fees: Number(fees),
      address: JSON.parse(address), // Expecting JSON string for address
      phone,
      date: Date.now(),
      availableSlots: availableSlots ? JSON.parse(availableSlots) : [],
    });

    return NextResponse.json(
      {
        message: "Shop added successfully",
        shop: {
          id: newShop._id,
          name: newShop.name,
          email: newShop.email,
          image: newShop.image,
          about: newShop.about,
          fees: newShop.fees,
          address: newShop.address,
          phone: newShop.phone,
          availableSlots: newShop.availableSlots,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding shop:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
