import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { restockService } from "./restock.services";

const getAllRestocks = catchAsync(async (req, res) => {
  const result = await restockService.getAllRestocksFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Restock products retrieved successfully!",
    data: result,
  });
});

const restockProduct = catchAsync(async (req, res) => {
  const result = await restockService.restockProductIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Restock product successfully!",
    data: result,
  });
});

export const restockController = {
  getAllRestocks,
  restockProduct,
};
