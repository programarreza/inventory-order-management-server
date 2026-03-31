import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../Auth/auth.constant";
import { categoryController } from "./category.controller";
import { createCategoryValidationSchema } from "./category.validation";

const categoryRoutes = Router();

categoryRoutes.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  validateRequest(createCategoryValidationSchema),
  categoryController.createCategory,
);

categoryRoutes.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  categoryController.getAllCategories,
);

export default categoryRoutes;
