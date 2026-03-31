import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.services";

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await AuthService.loginUserFromDB(
    req.body,
  );

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully!",
    data: {
      accessToken,
    },
  });
});

export const AuthController = {
  loginUser,
};
