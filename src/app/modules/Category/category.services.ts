import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";

const createCategoryIntoDB = async (payload: ICategory) => {
  const isExist = await Category.findOne({
    name: payload.name,
  });
  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This category already exist!");
  }

  const result = await Category.create(payload);
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await Category.find();

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "No category found!");
  }

  return result;
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
