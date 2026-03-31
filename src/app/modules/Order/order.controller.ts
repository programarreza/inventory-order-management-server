import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { orderService } from "./order.services";

const createOrder = catchAsync(async (req, res) => {
  const result = await orderService.createOrderIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order create successfully!",
    data: result,
  });
});

export const orderController = {
  createOrder,
};
