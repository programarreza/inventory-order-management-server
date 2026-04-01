import { Schema, model } from "mongoose";
import { IRestock, RestockPriority } from "./restock.interface";

const restockSchema = new Schema<IRestock>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },

    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },

    minStock: {
      type: Number,
      required: true,
      min: 0,
    },

    priority: {
      type: String,
      enum: Object.values(RestockPriority),
      required: true,
    },

    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Restock = model<IRestock>("Restock", restockSchema);
