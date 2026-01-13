import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  shopId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  bookingTime: { type: Date, required: true }, // Created At essentially?
  userData: { type: Object, required: true },
  shopData: { type: Object, required: true },
  amount: { type: Number, required: true },
  date: { type: Number, required: true }, // Maybe timestamp of the slot?

  cancelled: { type: Boolean, default: false },
  cancelledAt: { type: Date },
  cancelledBy: { type: String, enum: ["user", "system"] },

  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["booked", "cancelled", "completed"],
    default: "booked",
  },
});

const BookingModel =
  mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default BookingModel;
