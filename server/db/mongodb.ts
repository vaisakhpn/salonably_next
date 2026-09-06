import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
} catch (err) {
  console.warn("Failed to set DNS configuration:", err);
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
    } catch (e) {
      // Ignore if cannot reset
    }

    const maxPoolSize = process.env.MONGODB_MAX_POOL_SIZE
      ? parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10)
      : 50;
    const minPoolSize = process.env.MONGODB_MIN_POOL_SIZE
      ? parseInt(process.env.MONGODB_MIN_POOL_SIZE, 10)
      : 5;

    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      dbName: "salon",
      maxPoolSize,
      minPoolSize,
      serverSelectionTimeoutMS: process.env.NODE_ENV === "production" ? 10000 : 30000,
      socketTimeoutMS: 45000,
      autoIndex: process.env.NODE_ENV !== "production",
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      })
      .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
        console.error(
          "💡 If you're on localhost, please check MongoDB Atlas -> Network Access -> Add IP Address -> 'Add Current IP Address' or '0.0.0.0/0'."
        );
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
