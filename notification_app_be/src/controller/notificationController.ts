// notification_app_be/src/controller/notificationController.ts

import { Request, Response } from "express";
import { Log } from "../../../logging_middleware/src/index";
import { fetchNotifications } from "../service/notificationService";
import { getTopNPriorityNotifications } from "../service/priorityService";
import { NotificationType } from "../domain/notification";

/**
 * GET /api/notifications
 * Returns all notifications with optional filtering
 */
export async function getAllNotifications(req: Request, res: Response): Promise<void> {
  Log("backend", "info", "controller", `GET /api/notifications called with query: ${JSON.stringify(req.query)}`);

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const notification_type = req.query.notification_type as NotificationType | undefined;

    const notifications = await fetchNotifications({ page, limit, notification_type });

    Log("backend", "info", "controller", `Returning ${notifications.length} notifications`);
    res.json({
      success: true,
      data: {
        notifications,
        pagination: { page, limit, total: notifications.length },
      },
    });
  } catch (error: any) {
    Log("backend", "error", "controller", `Failed to get notifications: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * GET /api/notifications/priority
 * Returns top N priority notifications
 */
export async function getPriorityNotifications(req: Request, res: Response): Promise<void> {
  const n = parseInt(req.query.n as string) || 10;
  Log("backend", "info", "controller", `GET /api/notifications/priority called with n=${n}`);

  try {
    const allNotifications = await fetchNotifications({ limit: 100 });
    const priorityNotifications = getTopNPriorityNotifications(allNotifications, n);

    Log("backend", "info", "controller", `Returning ${priorityNotifications.length} priority notifications`);
    res.json({
      success: true,
      data: { notifications: priorityNotifications },
    });
  } catch (error: any) {
    Log("backend", "error", "controller", `Failed to get priority notifications: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
}
