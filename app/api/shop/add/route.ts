import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    if (!name || !email || !password || !imageFile) {
      // Basic validation
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

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

    // Create Shop
    const newShop = await ShopModel.create({
      name,
      email,
      password, // In production, hash this!
      image: imageUrl,
      about,
      fees: Number(fees),
      address: JSON.parse(address), // Expecting JSON string for address
      phone,
      date: Date.now(),
    });

    return NextResponse.json(
      { message: "Shop added successfully", shop: newShop },
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
