import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import User from "../modules/User/user.model";
import catchAsync from "../utils/catchAsync";
import { verifyToken } from "../utils/jwtHelper";

const auth = (...requiredRoles: any[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if the token is send from the client
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // check if the given token is valid
    const decoded = verifyToken(token, config.jwt_access_secret as string);
    const { role, email, iat } = decoded;

    // checking if the user already exist
    const user = await User.findOne({
      email,
      isDeleted: false,
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, `${role} is not found!`);
    }

    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted! ");
    }

    // checking if the user is disabled
    const userStatus = user?.status;
    if (userStatus === "disabled") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is disabled !");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
