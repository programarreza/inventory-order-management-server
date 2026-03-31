import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { Product } from "../Product/product.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";

const createOrderIntoDB = async (payload: IOrder) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Step-1: Product ids
    const productIds = payload.items.map((item) => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);

    const productMap = new Map();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    const itemsWithPrice = [];
    let totalPrice = 0;

    // Step-2: Validate And Deduct Stock
    for (const item of payload.items) {
      const product = productMap.get(item.productId.toString());

      if (!product) {
        throw new AppError(StatusCodes.NOT_FOUND, "Product not found!");
      }

      if (!product.isActive) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Product is currently unavailable",
        );
      }

      if (item.quantity > product.stock) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          `Only ${product.stock} items available`,
        );
      }

      // Deduct Stock
      product.stock -= item.quantity;
      await product.save({ session });

      itemsWithPrice.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;
    }

    // Step-3: Create Order
    const result = await Order.create(
      [
        {
          customerName: payload.customerName,
          items: itemsWithPrice,
          totalPrice,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const orderService = {
  createOrderIntoDB,
};
