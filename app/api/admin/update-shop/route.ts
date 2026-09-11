import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
};

if (
  cloudinaryConfig.cloud_name &&
  cloudinaryConfig.api_key &&
  cloudinaryConfig.api_secret
) {
  cloudinary.config(cloudinaryConfig);
}

export async function POST(req: Request) {
  try {
    // 1. Verify Admin Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized. Admin session required." }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(token.value, JWT_SECRET) as any;
      if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Forbidden. Admin privileges required." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: "Invalid or expired session." }, { status: 401 });
    }

    // 2. Parse Form Data
    const formData = await req.formData();
    const shopId = formData.get("shopId") as string;

    if (!shopId) {
      return NextResponse.json({ message: "Shop ID is required." }, { status: 400 });
    }

    const name = formData.get("name") as string;
    const ownerName = formData.get("ownerName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const fees = formData.get("fees") as string;
    const about = formData.get("about") as string;
    const address = formData.get("address") as string;
    const coordinates = formData.get("coordinates") as string;
    const googleMapsUrl = formData.get("googleMapsUrl") as string;
    const available = formData.get("available") as string;
    const availableSlots = formData.get("availableSlots") as string;
    const closedDays = formData.get("closedDays") as string;
    const imageFile = formData.get("image") as File | null;

    await dbConnect();

    // 3. Find existing shop
    const existingShop = await ShopModel.findById(shopId);
    if (!existingShop) {
      return NextResponse.json({ message: "Shop not found." }, { status: 404 });
    }

    // 4. Check if email is being changed and conflicts with another shop
    if (email && email !== existingShop.email) {
      const emailConflict = await ShopModel.findOne({ email, _id: { $ne: shopId } });
      if (emailConflict) {
        return NextResponse.json(
          { message: "Another shop is already registered with this email." },
          { status: 400 }
        );
      }
    }

    // 5. Construct update object
    const updateData: Record<string, any> = {};

    if (name) updateData.name = name.trim();
    if (ownerName) updateData.ownerName = ownerName.trim();
    if (email) updateData.email = email.trim();
    if (phone) updateData.phone = phone.trim();
    if (fees !== null && fees !== undefined) updateData.fees = Number(fees);
    if (about !== null && about !== undefined) updateData.about = about.trim();

    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch {
        // preserve existing if parsing fails
      }
    }

    if (coordinates) {
      try {
        updateData.coordinates = JSON.parse(coordinates);
      } catch {
        updateData.coordinates = undefined;
      }
    }

    if (googleMapsUrl !== null && googleMapsUrl !== undefined) {
      updateData.googleMapsUrl = googleMapsUrl.trim();
    }

    if (available !== null && available !== undefined) {
      updateData.available = available === "true";
    }

    if (availableSlots) {
      try {
        updateData.availableSlots = JSON.parse(availableSlots);
      } catch {
        // preserve existing
      }
    }

    if (closedDays) {
      try {
        updateData.closedDays = JSON.parse(closedDays);
      } catch {
        // preserve existing
      }
    }

    // 6. Handle optional password update
    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password.trim(), salt);
    }

    // 7. Handle optional image upload to Cloudinary
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "shops" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        if (uploadResponse?.secure_url) {
          updateData.image = uploadResponse.secure_url;
        }
      } catch (uploadError) {
        console.error("Cloudinary upload failed during edit:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload new shop image. Please try again." },
          { status: 500 }
        );
      }
    }

    // 8. Execute update in MongoDB
    const updatedShop = await ShopModel.findByIdAndUpdate(shopId, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json(
      { message: "Shop details updated successfully.", shop: updatedShop },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in admin update-shop route:", error);
    return NextResponse.json(
      { message: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
