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

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/notifications/handover",
        config
      );
      setNotificationCount(res.data.count);
    } catch (err) {
      console.log("Error fetching notifications");
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
        display: "inline-block",
      }}
    >
      <span
        style={{
          backgroundColor: "#dc3545",
          color: "white",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "12px",
          position: "absolute",
          top: "-8px",
          right: "-8px",
        }}
      >
        {notificationCount}
      </span>
      🔔
    </div>
  );
};

export default NotificationBadge;
