import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { loginUserValidationSchema } from "./auth.validation";

const authRoutes = Router();

// admin ih and teacher login
authRoutes.post(
  "/login",
  validateRequest(loginUserValidationSchema),
  AuthController.loginUser,
);

export default authRoutes;
