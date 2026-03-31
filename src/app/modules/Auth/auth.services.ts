import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import AppError from "../../errors/AppError";
import { generateToken } from "../../utils/jwtHelper";

import User from "../User/user.model";
import { UserStatus } from "./auth.constant";

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await User.findOne({
    email: payload.email,
    status: UserStatus.ACTIVE,
    isDeleted: false,
  }).select("+password"); // This ensures the password field is included;

  if (!userData) {
    throw new AppError(StatusCodes.NOT_FOUND, "user not found!");
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Password incorrect!");
  }

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUserFromDB,
};
