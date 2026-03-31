import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

const PORT = Number(process.env.PORT) || 5313;
const HOST = "0.0.0.0";

let server: Server;
let shuttingDown = false;

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("MongoDB connected successfully");

    // Start the server
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });

    console.log(`Listening on port ${PORT}`);
    process.stdout.write("Startup complete\n");

    setInterval(() => console.log("Server is alive"), 60_000);
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}

startServer();

async function gracefulShutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(() => console.log("HTTP server closed"));
  }

  try {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  gracefulShutdown("unhandledRejection");
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("uncaughtException");
});
