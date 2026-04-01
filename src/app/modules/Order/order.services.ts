import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { Product } from "../Product/product.model";
import { restockService } from "../Restock/restock.services";
import User from "../User/user.model";
import { IOrder, OrderStatus } from "./order.interface";
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

      // Check if restock needed BEFORE stock deduction
      if (product.stock - item.quantity < product.minStock) {
        await restockService.handleLowStock(product._id.toString(), {
          session,
          orderQuantity: item.quantity,
        });
      }

      // Deduct Stock
      product.stock -= item.quantity;
      await product.save({ session });

      // Status Change Logic: Update product status based on stock
      if (product.stock === 0) {
        product.isActive = false;
        await product.save({ session });
      }

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

// Customer Status Update Only Canceled
const updateOrderStatusByCustomerIntoDB = async (
  orderId: string,
  user: JwtPayload,
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");
  }

  // Customer can only cancel their own orders
  const customer = await User.findOne({ email: user.email });
  if (order.customerName !== customer?.name) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You can only update your own orders!",
    );
  }

  // Only allow canceling orders
  if (order.status === OrderStatus.CANCELLED) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Order is already canceled!");
  }

  if (order.status === OrderStatus.DELIVERED) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Delivered orders cannot be canceled!",
    );
  }

  order.status = OrderStatus.CANCELLED;
  await order.save();

  return order;
};

// Admin/Manager Status Update All Statuses
const updateOrderStatusIntoDB = async (
  orderId: string,
  status: OrderStatus,
) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(StatusCodes.NOT_FOUND, "Order not found!");
  }

  order.status = status;
  await order.save();

  return order;
};

export const orderService = {
  createOrderIntoDB,
  updateOrderStatusByCustomerIntoDB,
  updateOrderStatusIntoDB,
};
