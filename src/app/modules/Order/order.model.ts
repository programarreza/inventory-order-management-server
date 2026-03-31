import { Schema, model } from "mongoose";
import { IOrder, OrderStatus } from "./order.interface";

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },

    price: {
      type: Number,
      min: 0,
    },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (value: any[]) {
          return value.length > 0;
        },
        message: "Order must contain at least one product",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder>("Order", orderSchema);
