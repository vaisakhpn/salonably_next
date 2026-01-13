import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    about: { type: String, required: true },
    days: { type: Object, default: {} }, // Available days/hours? User schema said 'date'? waiting for clarification or adapting. User schema has 'date' as number?
    // User provided:
    // phone: { type: String, required: true, unique: true,default:"0000000000" },
    // fees: { type: Number, required: true },
    // available: { type: Boolean, default: true },
    // address: { type: Object, required: true },
    // date: { type: Number, required: true }, // Creation date?
    // slots_booked: { type: Object, default: {} },

    // adapting to user provided exactly:
    phone: {
      type: String,
      required: true,
      unique: true,
      default: "0000000000",
    },
    fees: { type: Number, required: true },
    available: { type: Boolean, default: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

const ShopModel = mongoose.models.shop || mongoose.model("shop", shopSchema);

export default ShopModel;
