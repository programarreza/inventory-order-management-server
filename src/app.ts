import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
const app: Application = express();

// middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://inventory-order-management-client-b.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

// In app.ts or wherever your Express app is defined
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// application route
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("inventory order management server is running ");
});

app.use(globalErrorHandler);
export default app;
