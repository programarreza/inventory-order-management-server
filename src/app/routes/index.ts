import { Router } from "express";
import authRoutes from "../modules/Auth/auth.route";
import categoryRoutes from "../modules/Category/category.routes";
import orderRoutes from "../modules/Order/order.routes";
import productRoutes from "../modules/Product/product.routes";
import restockRoutes from "../modules/Restock/restock.routes";
import userRoutes from "../modules/User/user.routes";
import uploadRoutes from "../modules/upload/upload.routes";
import dashboardRoutes from "../modules/Dashboard/dashboard.routes";

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
    path: "/restocks",
    route: restockRoutes,
  },
  {
    path: "/uploads",
    route: uploadRoutes,
  },
  {
    path: "/dashboard",
    route: dashboardRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
