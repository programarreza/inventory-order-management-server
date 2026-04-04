import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { dashboardService } from "./dashboard.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getDashboardStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard statistics fetched successfully",
    data: result,
  });
});

export const dashboardController = {
  getDashboardStats,
};
