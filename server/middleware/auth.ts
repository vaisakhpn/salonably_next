import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/server/db/mongodb";
import User from "@/server/models/User";
import ShopModel from "@/server/models/Shop";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };

    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return null;

    // Convert to plain object to pass to client components
    return {
      name: user.name,
      email: user.email,
      image: user.image,
      _id: user._id.toString(),
      phone: user.phone,
    };
  } catch (error) {
    return null;
  }
}

export async function getShop() {
  const cookieStore = await cookies();
  const token = cookieStore.get("shop_token");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as { shopId: string };

    await dbConnect();
    const shop = await ShopModel.findById(decoded.shopId).select("-password");

    if (!shop) return null;

    return {
      _id: shop._id.toString(),
      name: shop.name,
      email: shop.email,
      image: shop.image,
    };
  } catch (error) {
    return null;
  }
}
