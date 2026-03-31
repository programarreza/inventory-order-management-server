import { Router } from "express";
import authRoutes from "../modules/Auth/auth.route";
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
    path: "/uploads",
    route: uploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
