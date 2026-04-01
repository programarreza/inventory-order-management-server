import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../Auth/auth.constant";
import { orderController } from "./order.controller";
import { createOrderValidationSchema } from "./order.validation";

const orderRoutes = Router();

orderRoutes.post(
  "/create",
  validateRequest(createOrderValidationSchema),
  orderController.createOrder,
);

orderRoutes.post(
  "/cancel",
  auth(UserRole.USER),
  orderController.updateOrderStatusByCustomer,
);

orderRoutes.post(
  "/status/update",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  orderController.updateOrderStatus,
);

export default orderRoutes;
