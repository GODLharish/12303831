// notification_app_fe/src/api/notificationApi.ts
// API layer for fetching notifications from our backend

import { Log, setAuthToken } from "../../../logging_middleware/src/index";

const BACKEND_URL = "http://localhost:8000/api";
const TEST_SERVER = "http://4.224.186.213/evaluation-service";

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
  isRead?: boolean;
}

export interface PriorityNotification extends Notification {
  priorityScore: number;
}

// Authenticate and set token in logging middleware
export async function authenticate(creds: {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}): Promise<string> {
  Log("frontend", "info", "api", "Authenticating with test server");

  const response = await fetch(`${TEST_SERVER}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });

  if (!response.ok) {
    Log("frontend", "error", "api", `Auth failed: ${response.status}`);
    throw new Error("Authentication failed");
  }

  const data = await response.json();
  setAuthToken(data.access_token);
  Log("frontend", "info", "api", "Auth successful. Token set in logger.");
  return data.access_token;
}

export async function fetchAllNotifications(
  token: string,
  options: { page?: number; limit?: number; notification_type?: string } = {}
): Promise<Notification[]> {
  Log("frontend", "info", "api", `Fetching all notifications, page=${options.page ?? 1}`);

  const params = new URLSearchParams();
  if (options.page) params.set("page", options.page.toString());
  if (options.limit) params.set("limit", options.limit.toString());
  if (options.notification_type) params.set("notification_type", options.notification_type);

  const response = await fetch(`${TEST_SERVER}/notifications?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    Log("frontend", "error", "api", `Failed to fetch notifications: ${response.status}`);
    throw new Error("Failed to fetch notifications");
  }

  const data = await response.json();
  const notifications = data.notifications ?? [];
  Log("frontend", "info", "api", `Fetched ${notifications.length} notifications from server`);
  return notifications;
}

export async function fetchPriorityNotifications(
  token: string,
  n: number = 10
): Promise<PriorityNotification[]> {
  Log("frontend", "info", "api", `Fetching top ${n} priority notifications from backend`);

  const response = await fetch(`${BACKEND_URL}/notifications/priority?n=${n}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    Log("frontend", "error", "api", `Failed to fetch priority notifications: ${response.status}`);
    throw new Error("Failed to fetch priority notifications");
  }

  const data = await response.json();
  Log("frontend", "info", "api", `Received ${data.data?.notifications?.length} priority notifications`);
  return data.data?.notifications ?? [];
}
