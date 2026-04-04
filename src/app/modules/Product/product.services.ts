import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { activityLogService } from "../ActivityLog/activityLog.service";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";

const createProductIntoDB = async (payload: IProduct) => {
  const isExist = await Product.findOne({
    name: payload.name,
    categoryId: payload.categoryId,
  });
  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This product already exist!");
  }

  const result = await Product.create(payload);
  
  await activityLogService.createLog(
    `Product "${payload.name}" created`
  );

  return result;
};

const getAllProductsFromDB = async () => {
  const result = await Product.find().populate("categoryId");

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "No product found!");
  }

  return result;
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id).populate("categoryId");

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "No product found!");
  }
  
  return result;
};

export const productService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
};
