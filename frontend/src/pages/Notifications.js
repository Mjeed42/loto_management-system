import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Fetching notifications...");
      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/notifications/handover",
        config
      );
      console.log("Notifications response:", res.data);

      // Handle different possible response formats
      let notificationsData = [];
      if (res.data.notifications) {
        notificationsData = res.data.notifications;
      } else if (res.data.data && res.data.data.notifications) {
        notificationsData = res.data.data.notifications;
      }

      // Ensure it's always an array
      notificationsData = Array.isArray(notificationsData)
        ? notificationsData
        : [];

      setNotifications(notificationsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.response?.data?.message || "Error fetching notifications");
      setNotifications([]); // Ensure notifications is always an array
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    // Navigate to LOTO details page
    if (notification.lotoId && notification.lotoId._id) {
      navigate(`/loto/${notification.lotoId._id}`);
    } else {
      console.error("LOTO ID not found in notification:", notification);
      alert("Unable to navigate to LOTO details - LOTO ID not found");
    }
  };

  // Ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading notifications...</h2>
      </div>
    );
  }

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
        <div>
          <h1 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>Handover Notifications</h1>
          <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
            Click on any notification to view the LOTO details
          </p>
        </div>
        <button
          onClick={() => navigate("/Home")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {safeNotifications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            backgroundColor: "#f8f9fa",
            borderRadius: "5px",
          }}
        >
          <h3>No pending notifications</h3>
          <p>You have no pending handover requests.</p>
        </div>
      ) : (
        <div>
          {safeNotifications.map((notification) => (
            <div
              key={notification._id}
              className="notification-card"
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #17a2b8",
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              onClick={() => handleNotificationClick(notification)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              {/* Click indicator */}
              <div
                className="click-indicator"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "#6c757d",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Click to view LOTO</span>
              </div>

              <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>
                Handover Request from {notification.fromUser?.firstName}{" "}
                {notification.fromUser?.lastName}
              </h3>

              <div style={{ marginBottom: "15px" }}>
                <p>
                  <strong>LOTO Serial:</strong>{" "}
                  <span style={{ color: "#6366f1", fontWeight: "600" }}>
                    {notification.lotoId?.serialNumber}
                  </span>
                </p>
                <p>
                  <strong>Equipment:</strong>{" "}
                  {notification.lotoDetails?.isolatedPart}
                </p>
                <p>
                  <strong>Reason:</strong> {notification.lotoDetails?.reason}
                </p>
                <p>
                  <strong>Shift:</strong> {notification.lotoDetails?.shift}
                </p>
                <p>
                  <strong>Line:</strong> {notification.lotoDetails?.line}
                </p>
                {notification.handoverNotes && (
                  <p>
                    <strong>Notes:</strong> {notification.handoverNotes}
                  </p>
                )}
                <p>
                  <strong>Requested:</strong>{" "}
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Action message */}
              <div style={{
                backgroundColor: "#f8f9fa",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #e9ecef",
                textAlign: "center",
                marginTop: "10px"
              }}>
                <p style={{ 
                  margin: "0", 
                  color: "#495057", 
                  fontSize: "14px",
                  fontWeight: "500"
                }}>
                  Click to view LOTO details and respond to handover
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
