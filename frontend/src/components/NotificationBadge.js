import React, { useState, useEffect } from "react";
import axios from "axios";

const NotificationBadge = ({ onNotificationClick }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchNotificationCount();

    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Add manual refresh for debugging
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'r' && e.ctrlKey) {
        console.log("🔄 Manual refresh triggered");
        fetchNotificationCount();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("🔔 Fetching notification count...");
      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/notifications/handover/count",
        config
      );
      console.log("📊 Notification count response:", res.data);
      setNotificationCount(res.data.count);
    } catch (err) {
      console.error("❌ Error fetching notification count:", err);
      // Fallback: try the main notifications endpoint
      try {
        const fallbackRes = await axios.get(
          "https://loto-backend-643788243736.europe-west1.run.app/api/notifications/handover",
          config
        );
        console.log("📊 Fallback notification response:", fallbackRes.data);
        setNotificationCount(fallbackRes.data.count || 0);
      } catch (fallbackErr) {
        console.error("❌ Fallback also failed:", fallbackErr);
        setNotificationCount(0);
      }
    }
  };

  if (notificationCount === 0) {
    return null;
  }

  return (
    <div
      onClick={onNotificationClick}
      style={{
        position: "relative",
        cursor: "pointer",
        display: "inline-flex",
      }}
    >
      <span
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "8px",
          position: "absolute",
          top: "-14px",
          right: "-3px",
        }}
      >
        {notificationCount}
      </span>
    </div>
  );
};

export default NotificationBadge;
