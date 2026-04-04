import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../Auth/auth.constant";
import { dashboardController } from "./dashboard.controller";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/stats",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  dashboardController.getDashboardStats,
);

export default dashboardRoutes;
