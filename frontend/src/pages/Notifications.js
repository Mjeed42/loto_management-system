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
        "http://localhost:5000/api/notifications/handover",
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

  const handleAccept = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/notifications/handover/${notificationId}/accept`,
        {},
        config
      );

      // Remove notification from list
      setNotifications(notifications.filter((n) => n._id !== notificationId));

      alert("Handover accepted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error accepting handover");
    }
  };

  const handleReject = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/notifications/handover/${notificationId}/reject`,
        {},
        config
      );

      // Remove notification from list
      setNotifications(notifications.filter((n) => n._id !== notificationId));

      alert("Handover rejected");
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting handover");
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
        <h1>Handover Notifications</h1>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
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
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #17a2b8",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>
                Handover Request from {notification.fromUser?.firstName}{" "}
                {notification.fromUser?.lastName}
              </h3>

              <div style={{ marginBottom: "15px" }}>
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

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleAccept(notification._id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(notification._id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
