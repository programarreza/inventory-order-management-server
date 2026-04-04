import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { calculatePriority } from "../../utils/utils";
import { activityLogService } from "../ActivityLog/activityLog.service";
import { Product } from "../Product/product.model";
import { Restock } from "./restock.model";

interface IRestockProduct {
  productId: string;
  quantity: number;
}

const getAllRestocksFromDB = async () => {
  // Find all products that should be in the restock queue
  const lowStockProducts = await Product.find({
    $expr: { $lt: ["$stock", "$minStock"] },
  });

  // Upsert all low stock products into the Restock collection
  for (const product of lowStockProducts) {
    const priority = calculatePriority(product.stock, product.minStock);
    await Restock.findOneAndUpdate(
      { productId: product._id },
      {
        productId: product._id,
        currentStock: product.stock,
        minStock: product.minStock,
        priority,
        isResolved: false,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );
  }

  // Remove items that no longer need restock
  const productIdsBelowMin = lowStockProducts.map(p => p._id);
  await Restock.deleteMany({
    productId: { $nin: productIdsBelowMin }
  });

  const result = await Restock.find()
    .populate("productId")
    .sort({ priority: 1, createdAt: -1 });

  return result;
};

const handleLowStock = async (
  productId: string,
  options?: { session?: any; orderQuantity?: number },
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }

  if (product.stock >= product.minStock) {
    return null;
  }

  // Calculate projected stock after potential order
  const projectedStock = product.stock - (options?.orderQuantity || 0);
  const priority = calculatePriority(projectedStock, product.minStock);

  const restock = await Restock.findOneAndUpdate(
    { productId: product._id },
    {
      productId: product._id,
      currentStock: projectedStock,
      minStock: product.minStock,
      priority,
      isResolved: false,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      ...(options?.session && { session: options.session }),
    },
  );

  await activityLogService.createLog(
    `Product "${product.name}" added to Restock Queue`,
  );

  return restock;
};

const restockProductIntoDB = async (payload: IRestockProduct) => {
  const { productId, quantity } = payload;

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }

  if (quantity <= 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Restock quantity must be greater than 0",
    );
  }

  product.stock += quantity;
  await product.save();

  if (product.stock < product.minStock) {
    await handleLowStock(product._id.toString());
  } else {
    await Restock.findOneAndDelete({ productId: product._id });
  }

  await activityLogService.createLog(
    `Product "${product.name}" restocked (Quantity: ${quantity})`,
  );

  return product;
};

export const restockService = {
  getAllRestocksFromDB,
  handleLowStock,
  restockProductIntoDB,
};
