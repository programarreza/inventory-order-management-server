import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../Auth/auth.constant";
import { productController } from "./product.controller";
import { createProductValidationSchema } from "./product.validation";

const productRoutes = Router();

productRoutes.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  validateRequest(createProductValidationSchema),
  productController.createProduct,
);

productRoutes.get("/", productController.getAllProducts);

export default productRoutes;
