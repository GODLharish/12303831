// notification_app_fe/src/component/NotificationCard.tsx

import React from "react";
import { Log } from "../../../logging_middleware/src/index";
import { Notification } from "../api/notificationApi";

interface Props {
  notification: Notification;
  isRead: boolean;
  onRead: (id: string) => void;
  priorityScore?: number;
}

const TYPE_COLORS: Record<string, string> = {
  Placement: "#1976d2",
  Result: "#388e3c",
  Event: "#f57c00",
};

const TYPE_ICONS: Record<string, string> = {
  Placement: "💼",
  Result: "📊",
  Event: "🎓",
};

export function NotificationCard({ notification, isRead, onRead, priorityScore }: Props) {
  const handleClick = () => {
    if (!isRead) {
      Log("frontend", "info", "component", `Notification ${notification.ID} clicked and marked as read`);
      onRead(notification.ID);
    }
  };

  const timeAgo = (timestamp: string) => {
    const diff = (Date.now() - new Date(timestamp).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "16px",
        borderRadius: "12px",
        marginBottom: "10px",
        background: isRead ? "#f9f9f9" : "#ffffff",
        border: `1px solid ${isRead ? "#e0e0e0" : TYPE_COLORS[notification.Type] || "#ccc"}`,
        borderLeft: `4px solid ${TYPE_COLORS[notification.Type] || "#ccc"}`,
        cursor: isRead ? "default" : "pointer",
        opacity: isRead ? 0.75 : 1,
        transition: "all 0.2s ease",
        boxShadow: isRead ? "none" : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <span style={{ fontSize: "24px", flexShrink: 0 }}>
        {TYPE_ICONS[notification.Type] || "🔔"}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: TYPE_COLORS[notification.Type],
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              background: `${TYPE_COLORS[notification.Type]}18`,
              padding: "2px 8px",
              borderRadius: "20px",
            }}
          >
            {notification.Type}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {priorityScore !== undefined && (
              <span style={{ fontSize: "11px", color: "#888" }}>
                ⭐ {priorityScore.toFixed(2)}
              </span>
            )}
            <span style={{ fontSize: "12px", color: "#999" }}>
              {timeAgo(notification.Timestamp)}
            </span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: "14px", color: "#333", lineHeight: "1.4" }}>
          {notification.Message}
        </p>
        {!isRead && (
          <span
            style={{
              display: "inline-block",
              marginTop: "6px",
              fontSize: "11px",
              color: "#1976d2",
              fontWeight: 500,
            }}
          >
            • New
          </span>
        )}
      </div>
    </div>
  );
}
