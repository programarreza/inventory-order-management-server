import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    contactNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    image: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const User = model<IUser>("User", userSchema);
export default User;
