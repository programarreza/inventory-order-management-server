import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../Auth/auth.constant";
import {
  createUser,
  getAllUsers,
  getMyProfile,
  getSingleUser,
} from "./user.controller";
import { createUserValidationSchema } from "./user.validation";

const userRoutes = Router();
userRoutes.post(
  "/create-user",
  validateRequest(createUserValidationSchema),
  createUser,
);

userRoutes.get("/", auth(UserRole.ADMIN), getAllUsers);
userRoutes.get("/profile", auth(UserRole.USER), getMyProfile);

userRoutes.get(
  "/:email",
  auth(UserRole.ADMIN, UserRole.USER, UserRole.MANAGER),
  getSingleUser,
);

export default userRoutes;
