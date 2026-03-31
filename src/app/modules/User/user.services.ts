import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import User from "./user.model";

const createUserIntoDB = async (payload: any) => {
  const isExist = await User.findOne({
    email: payload.email,
    isDeleted: false,
  });
  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This user already exist!");
  }

  // hashed password
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const result = await User.create({ ...payload, password: hashedPassword });
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await User.find({
    isDeleted: false,
  });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "No user found!");
  }

  return result;
};

const getSingleUserFromDB = async (email: string) => {
  const result = await User.findOne({
    email: email,
  }).select("-password");

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found ");
  }

  return result;
};

const getMyProfileFromDB = async (user: JwtPayload) => {
  const result = await User.findOne({
    email: user.email,
  }).select("-password");

  return result;
};

export {
  createUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  getSingleUserFromDB,
};
