// notification_app_be/src/route/notificationRoutes.ts

import { Router } from "express";
import { Log } from "../../../logging_middleware/src/index";
import { getAllNotifications, getPriorityNotifications } from "../controller/notificationController";

const router = Router();

// Log every incoming request
router.use((req, _res, next) => {
  Log("backend", "debug", "route", `Incoming request: ${req.method} ${req.path}`);
  next();
});

router.get("/", getAllNotifications);
router.get("/priority", getPriorityNotifications);

export default router;
