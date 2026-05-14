// notification_app_be/src/domain/notification.ts
// Domain types for the Notification platform

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PriorityNotification extends Notification {
  priorityScore: number;
}

// Priority weights per spec: placement > result > event
export const TYPE_WEIGHTS: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};
