import { Router } from "express";
import authRoutes from "../modules/Auth/auth.route";
import categoryRoutes from "../modules/Category/category.routes";
import orderRoutes from "../modules/Order/order.routes";
import productRoutes from "../modules/Product/product.routes";
import userRoutes from "../modules/User/user.routes";
import uploadRoutes from "../modules/upload/upload.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/categories",
    route: categoryRoutes,
  },
  {
    path: "/products",
    route: productRoutes,
  },
  {
    path: "/orders",
    route: orderRoutes,
  },
  {
    path: "/uploads",
    route: uploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
