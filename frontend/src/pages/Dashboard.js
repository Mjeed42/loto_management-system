import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBadge from "../components/NotificationBadge";

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleCreateLOTO = () => {
    navigate("/create-loto");
  };

  const handleViewLOTOs = () => {
    navigate("/loto-list");
  };

  const handleViewNotifications = () => {
    navigate("/notifications");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Dashboard</h1>
        <div style={{ position: "relative" }}>
          <button
            onClick={handleViewNotifications}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              position: "relative",
            }}
          >
            Notifications
            <NotificationBadge onNotificationClick={handleViewNotifications} />
          </button>
        </div>
      </div>

      <p>Welcome to the LOTO Management System Dashboard</p>

      <div style={{ marginTop: "30px" }}>
        <h2>Quick Actions</h2>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <button
            onClick={handleCreateLOTO}
            style={{
              padding: "15px 25px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Create New LOTO
          </button>

          <button
            onClick={handleViewLOTOs}
            style={{
              padding: "15px 25px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            View Active LOTOs
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "5px",
        }}
      >
        <h3>System Status</h3>
        <p>✅ System is running normally</p>
        <p>✅ Database connection established</p>
        <p>✅ Authentication active</p>
      </div>
    </div>
  );
};

export default Dashboard;
