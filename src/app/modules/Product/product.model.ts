import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";

export enum ProductStatus {
  ACTIVE = "Active",
  OUT_OF_STOCK = "Out of Stock",
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    minStock: {
      type: Number,
      required: true,
      min: [0, "Minimum stock cannot be negative"],
      default: 5,
    },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<IProduct>("Product", productSchema);
