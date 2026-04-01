import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { productService } from "./product.services";

const createProduct = catchAsync(async (req, res) => {
  const result = await productService.createProductIntoDB({
    ...req.body,
    image: req.file?.path,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product create successfully!",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await productService.getAllProductsFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products retrieved successfully!",
    data: result,
  });
});

export const productController = {
  createProduct,
  getAllProducts,
};
