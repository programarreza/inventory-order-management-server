import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../Auth/auth.constant";
import { restockController } from "./restock.controller";

const restockRoutes = Router();

restockRoutes.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  restockController.getAllRestocks,
);

restockRoutes.patch(
  "/update",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  restockController.restockProduct,
);

export default restockRoutes;
