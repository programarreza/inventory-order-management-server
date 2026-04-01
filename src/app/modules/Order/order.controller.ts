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

const updateOrderStatusByCustomer = catchAsync(async (req, res) => {
  const { orderId } = req.body;
  const result = await orderService.updateOrderStatusByCustomerIntoDB(
    orderId,
    req.user,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order cancel successfully!",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId, status } = req.body;

  const result = await orderService.updateOrderStatusIntoDB(orderId, status);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order status update successfully!",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrdersFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Orders retrieved successfully!",
    data: result,
  });
});

export const orderController = {
  createOrder,
  updateOrderStatusByCustomer,
  updateOrderStatus,
  getAllOrders,
};
