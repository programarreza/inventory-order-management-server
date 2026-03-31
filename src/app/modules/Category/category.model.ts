import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model("Category", categorySchema);
