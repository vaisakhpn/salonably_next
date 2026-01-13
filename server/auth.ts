import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "./db/mongodb";
import User from "./models/User";

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
    };
  } catch (error) {
    return null;
  }
}
