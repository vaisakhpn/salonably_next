import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this user."],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email for this user."],
      unique: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      default:
        "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png",
    },
    password: {
      type: String,
      required: [true, "Please specify a password for this user."],
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
