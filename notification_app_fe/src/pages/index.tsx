// notification_app_fe/src/pages/index.tsx
// Main Notifications Page - Stage 7

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Log, setAuthToken } from "../../../logging_middleware/src/index";
import { useNotifications, FilterType } from "../state/useNotifications";
import { NotificationCard } from "../component/NotificationCard";

const FILTER_OPTIONS: FilterType[] = ["All", "Placement", "Result", "Event"];

// ---- Token Setup ----
// Replace these with your actual values from registration
const TOKEN_CONFIG = {
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  name: process.env.NEXT_PUBLIC_NAME || "",
  rollNo: process.env.NEXT_PUBLIC_ROLL_NO || "",
  accessCode: process.env.NEXT_PUBLIC_ACCESS_CODE || "",
  clientID: process.env.NEXT_PUBLIC_CLIENT_ID || "",
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
};

export default function NotificationsPage() {
  const [token, setToken] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "priority">("all");

  const {
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
  } = useNotifications(token);

  // Get auth token on mount
  useEffect(() => {
    async function auth() {
      try {
        Log("frontend", "info", "page", "Authenticating on page load");
        const res = await fetch("http://4.224.186.213/evaluation-service/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(TOKEN_CONFIG),
        });
        if (!res.ok) throw new Error("Auth failed");
        const data = await res.json();
        setAuthToken(data.access_token);
        setToken(data.access_token);
        Log("frontend", "info", "page", "Auth successful on page load");
      } catch (err: any) {
        Log("frontend", "fatal", "page", `Auth error on page load: ${err.message}`);
        setAuthError("Authentication failed. Check your credentials in .env.local");
      }
    }
    auth();
  }, []);

  const unreadCount = notifications.filter((n) => !isRead(n.ID)).length;

  return (
    <>
      <Head>
        <title>Campus Notifications</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </Head>

      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#f4f6f9" }}>
        {/* Header */}
        <header
          style={{
            background: "#1565C0",
            color: "#fff",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>🔔</span>
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
              Campus Notifications
            </h1>
            {unreadCount > 0 && (
              <span
                style={{
                  background: "#f44336",
                  color: "#fff",
                  borderRadius: "20px",
                  padding: "2px 10px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              Mark all read
            </button>
          )}
        </header>

        {authError && (
          <div style={{ background: "#ffebee", color: "#c62828", padding: "12px 24px", fontSize: "14px" }}>
            ⚠️ {authError}
          </div>
        )}

        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>
          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {(["all", "priority"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  Log("frontend", "info", "page", `Switched to tab: ${tab}`);
                  setActiveTab(tab);
                }}
                style={{
                  padding: "10px 24px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  background: activeTab === tab ? "#1565C0" : "#fff",
                  color: activeTab === tab ? "#fff" : "#555",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                }}
              >
                {tab === "all" ? "📋 All Notifications" : "⭐ Priority Inbox"}
              </button>
            ))}
          </div>

          {activeTab === "all" && (
            <>
              {/* Filter Bar */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                {FILTER_OPTIONS.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      Log("frontend", "info", "page", `Filter changed to: ${f}`);
                      setFilter(f);
                    }}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "20px",
                      border: `1px solid ${filter === f ? "#1565C0" : "#ddd"}`,
                      background: filter === f ? "#1565C0" : "#fff",
                      color: filter === f ? "#fff" : "#555",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                      transition: "all 0.2s",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {hasNew && (
                <div style={{
                  background: "#e3f2fd",
                  border: "1px solid #90caf9",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  marginBottom: "12px",
                  fontSize: "13px",
                  color: "#1565C0",
                  fontWeight: 500,
                }}>
                  🔔 New notifications arrived!
                </div>
              )}

              {loading && (
                <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                  Loading notifications...
                </div>
              )}

              {error && (
                <div style={{ background: "#ffebee", padding: "16px", borderRadius: "8px", color: "#c62828" }}>
                  Error: {error}
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px", color: "#bbb" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔕</div>
                  <p>No notifications found.</p>
                </div>
              )}

              {notifications.map((n) => (
                <NotificationCard
                  key={n.ID}
                  notification={n}
                  isRead={isRead(n.ID)}
                  onRead={markRead}
                />
              ))}
            </>
          )}

          {activeTab === "priority" && (
            <>
              {/* Priority N control */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                  background: "#fff",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
              >
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>
                  Show top
                </span>
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      Log("frontend", "info", "page", `Priority N changed to: ${n}`);
                      setPriorityN(n);
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: `1px solid ${priorityN === n ? "#1565C0" : "#ddd"}`,
                      background: priorityN === n ? "#1565C0" : "#fff",
                      color: priorityN === n ? "#fff" : "#555",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    {n}
                  </button>
                ))}
                <span style={{ fontSize: "14px", color: "#555" }}>notifications</span>
              </div>

              <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
                📌 Ranked by: Placement (3×) &gt; Result (2×) &gt; Event (1×) + recency
              </p>

              {priorityNotifications.length === 0 && !loading && (
                <div style={{ textAlign: "center", padding: "60px", color: "#bbb" }}>
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>⭐</div>
                  <p>No priority notifications yet.</p>
                </div>
              )}

              {priorityNotifications.map((n, i) => (
                <div key={n.ID} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: "28px",
                      height: "28px",
                      background: i < 3 ? "#FFD700" : "#e0e0e0",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: i < 3 ? "#333" : "#666",
                      marginTop: "16px",
                    }}
                  >
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <NotificationCard
                      notification={n}
                      isRead={isRead(n.ID)}
                      onRead={markRead}
                      priorityScore={n.priorityScore}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </>
  );
}
