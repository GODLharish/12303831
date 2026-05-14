// notification_app_fe/src/state/useNotifications.ts
// Global state for notifications using React hooks

import { useState, useEffect, useCallback, useRef } from "react";
import { Log } from "../../../logging_middleware/src/index";
import {
  fetchAllNotifications,
  fetchPriorityNotifications,
  Notification,
  PriorityNotification,
} from "../api/notificationApi";

export type FilterType = "All" | "Placement" | "Result" | "Event";

export function useNotifications(token: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [priorityNotifications, setPriorityNotifications] = useState<PriorityNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("All");
  const [priorityN, setPriorityN] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevCountRef = useRef<number>(0);
  const [hasNew, setHasNew] = useState(false);

  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      Log("frontend", "info", "state", `Loading notifications with filter: ${filter}`);
      const type = filter === "All" ? undefined : filter;
      const data = await fetchAllNotifications(token, { notification_type: type, limit: 50 });
      
      // Detect new notifications
      if (prevCountRef.current > 0 && data.length > prevCountRef.current) {
        setHasNew(true);
        Log("frontend", "info", "state", `New notifications detected: ${data.length - prevCountRef.current} new`);
      }
      prevCountRef.current = data.length;
      setNotifications(data);
    } catch (err: any) {
      Log("frontend", "error", "state", `Error loading notifications: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, filter]);

  const loadPriority = useCallback(async () => {
    if (!token) return;
    try {
      Log("frontend", "info", "state", `Loading top ${priorityN} priority notifications`);
      const data = await fetchPriorityNotifications(token, priorityN);
      setPriorityNotifications(data);
    } catch (err: any) {
      Log("frontend", "error", "state", `Error loading priority notifications: ${err.message}`);
    }
  }, [token, priorityN]);

  const markRead = useCallback((id: string) => {
    Log("frontend", "info", "state", `Marking notification ${id} as read`);
    setReadIds((prev) => new Set([...prev, id]));
    setHasNew(false);
  }, []);

  const markAllRead = useCallback(() => {
    Log("frontend", "info", "state", "Marking all notifications as read");
    setReadIds(new Set(notifications.map((n) => n.ID)));
    setHasNew(false);
  }, [notifications]);

  const isRead = useCallback((id: string) => readIds.has(id), [readIds]);

  // Poll every 30s for new notifications
  useEffect(() => {
    loadAll();
    loadPriority();
    const interval = setInterval(() => {
      loadAll();
      loadPriority();
    }, 30000);
    return () => clearInterval(interval);
  }, [loadAll, loadPriority]);

  return {
    notifications,
    priorityNotifications,
    loading,
    error,
    filter,
    setFilter,
    priorityN,
    setPriorityN,
    markRead,
    markAllRead,
    isRead,
    hasNew,
    reload: loadAll,
  };
}
