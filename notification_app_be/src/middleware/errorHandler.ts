// notification_app_be/src/middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { Log } from "../../../logging_middleware/src/index";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  Log("backend", "error", "middleware", `Unhandled error on ${req.method} ${req.path}: ${err.message}`);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  Log("backend", "warn", "middleware", `404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ success: false, error: "Route not found" });
}
