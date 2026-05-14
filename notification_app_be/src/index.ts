// notification_app_be/src/index.ts
// Main entry point for the Campus Notification Backend

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { setAuthToken } from "../../logging_middleware/src/index";
import { Log } from "../../logging_middleware/src/index";
import { getAuthToken } from "./config/auth";
import notificationRoutes from "./route/notificationRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  Log("backend", "debug", "route", "Health check endpoint called");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/notifications", notificationRoutes);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  try {
    // Authenticate with test server on startup
    const token = await getAuthToken({
      email: process.env.EMAIL!,
      name: process.env.NAME!,
      rollNo: process.env.ROLL_NO!,
      accessCode: process.env.ACCESS_CODE!,
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    });

    setAuthToken(token);
    Log("backend", "info", "config", "Application bootstrap complete. Auth token set.");

    app.listen(PORT, () => {
      Log("backend", "info", "config", `Server running on http://localhost:${PORT}`);
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error("❌ Bootstrap failed:", error.message);
    process.exit(1);
  }
}

bootstrap();
