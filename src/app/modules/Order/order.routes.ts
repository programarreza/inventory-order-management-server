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

orderRoutes.patch(
  "/cancel",
  auth(UserRole.USER),
  orderController.updateOrderStatusByCustomer,
);

orderRoutes.patch(
  "/status/update",
  auth(UserRole.ADMIN, UserRole.MANAGER, UserRole.USER),
  orderController.updateOrderStatus,
);

orderRoutes.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MANAGER),
  orderController.getAllOrders,
);

orderRoutes.get(
  "/user-orders",
  auth(UserRole.USER),
  orderController.getUserOrders,
);

export default orderRoutes;
