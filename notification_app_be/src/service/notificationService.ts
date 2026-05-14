// notification_app_be/src/service/notificationService.ts
// Fetches notifications from the Affordmed Test Server API

import { Log } from "../../../logging_middleware/src/index";
import { getToken } from "../config/auth";
import { Notification, NotificationType } from "../domain/notification";

const TEST_SERVER_URL = process.env.TEST_SERVER_URL || "http://4.224.186.213/evaluation-service";

export interface FetchOptions {
  page?: number;
  limit?: number;
  notification_type?: NotificationType;
}

/**
 * Fetch notifications from Affordmed test server.
 */
export async function fetchNotifications(options: FetchOptions = {}): Promise<Notification[]> {
  const token = getToken();
  if (!token) {
    Log("backend", "error", "service", "No auth token available. Cannot fetch notifications.");
    throw new Error("Not authenticated");
  }

  const params = new URLSearchParams();
  if (options.page) params.set("page", options.page.toString());
  if (options.limit) params.set("limit", options.limit.toString());
  if (options.notification_type) params.set("notification_type", options.notification_type);

  const url = `${TEST_SERVER_URL}/notifications?${params.toString()}`;
  Log("backend", "info", "service", `Fetching notifications from test server: ${url}`);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    Log("backend", "error", "service", `Failed to fetch notifications: status ${response.status}`);
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();
  const notifications: Notification[] = data.notifications ?? [];
  Log("backend", "info", "service", `Fetched ${notifications.length} notifications from test server`);
  return notifications;
}
