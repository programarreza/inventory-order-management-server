import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { orderController } from "./order.controller";
import { createOrderValidationSchema } from "./order.validation";

const orderRoutes = Router();

orderRoutes.post(
  "/create",
  validateRequest(createOrderValidationSchema),
  orderController.createOrder,
);

export default orderRoutes;
