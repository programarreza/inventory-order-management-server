import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  getSingleUserFromDB,
} from "./user.services";

const createUser = catchAsync(async (req, res) => {
  const result = await createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User created successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await getAllUsersFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully!",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { email } = req.params;

  const result = await getSingleUserFromDB(email as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await getMyProfileFromDB(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My profile retrieved successfully!",
    data: result,
  });
});

export { createUser, getAllUsers, getMyProfile, getSingleUser };
