import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: false, index: true },
  shopId: { type: String, required: true, index: true },
  slotDate: { type: String, required: true, index: true },
  slotTime: { type: String, required: true },
  bookingTime: { type: Date, required: true }, // Created At essentially?
  userData: { type: Object, required: true },
  shopData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true }, // Maybe timestamp of the slot?

  cancelled: { type: Boolean, default: false },
  cancelledAt: { type: Date },
  cancelledBy: { type: String, enum: ["user", "system", "shop", "admin"] },

  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["booked", "cancelled", "completed", "held"],
    default: "booked",
  },
  expiresAt: { type: Date },
  holdToken: { type: String },
}, { timestamps: true });

// Enforce that a slot can only have ONE active booking or hold at a time.
bookingSchema.index(
  { shopId: 1, slotDate: 1, slotTime: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: { $in: ["booked", "held"] } } 
  }
);

// TTL Index: Automatically purge expired holds from database
bookingSchema.index(
  { expiresAt: 1 },
  { 
    expireAfterSeconds: 0,
    partialFilterExpression: { status: "held" }
  }
);

// High-speed compound queries for user history and salon schedule
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ shopId: 1, status: 1, slotDate: 1 });

const BookingModel =
  mongoose.models.booking ||
  mongoose.models.bookings ||
  mongoose.model("booking", bookingSchema, "bookings");

export default BookingModel;
