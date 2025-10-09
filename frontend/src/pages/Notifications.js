import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Notifications = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/auth/me",
        config
      );
      setCurrentUser(res.data.user);
    } catch (err) {
      console.log("Error fetching current user:", err);
    }
  };

  // Get the correct home path based on user role
  const getHomePath = () => {
    if (currentUser?.role === "technician") {
      return "/technician-home";
    }
    return "/Home";
  };

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
      setError(err.response?.data?.message || t('notifications.errorFetching'));
      setNotifications([]); // Ensure notifications is always an array
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read when clicked
    markNotificationAsRead(notification._id);
    
    // Navigate to LOTO details page
    if (notification.lotoId && notification.lotoId._id) {
      navigate(`/loto/${notification.lotoId._id}`);
    } else {
      console.error("LOTO ID not found in notification:", notification);
      alert(t('notifications.unableToNavigate'));
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/notifications/handover/${notificationId}/read`,
        {},
        config
      );

      // Update local state to mark as read
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true, readAt: new Date() }
            : notification
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        "https://loto-backend-643788243736.europe-west1.run.app/api/notifications/handover/read-all",
        {},
        config
      );

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true, readAt: new Date() }))
      );

      alert(`✅ ${res.data.modifiedCount} ${t('notifications.notificationsMarkedRead')}`);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      alert(t('notifications.errorMarkingRead'));
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAllNotifications = async () => {
    if (!window.confirm(t('notifications.confirmDeleteAll'))) {
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.delete(
        "https://loto-backend-643788243736.europe-west1.run.app/api/notifications/handover/delete-all",
        config
      );

      // Clear local state
      setNotifications([]);

      alert(`✅ ${res.data.deletedCount} ${t('notifications.notificationsDeleted')}`);
    } catch (err) {
      console.error("Error deleting all notifications:", err);
      alert(t('notifications.errorDeleting'));
    } finally {
      setActionLoading(false);
    }
  };

  // Ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>{t('notifications.loading')}</h2>
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
          <h1 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>{t('notifications.title')}</h1>
          <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
            {t('notifications.subtitle')}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {safeNotifications.length > 0 && (
            <>
              <button
                onClick={markAllAsRead}
                disabled={actionLoading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                {actionLoading ? t('notifications.processing') : t('notifications.markAllRead')}
              </button>
              <button
                onClick={deleteAllNotifications}
                disabled={actionLoading}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  opacity: actionLoading ? 0.6 : 1,
                }}
              >
                {actionLoading ? t('notifications.processing') : t('notifications.deleteAll')}
              </button>
            </>
          )}
          <button
            onClick={() => navigate(getHomePath())}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {t('notifications.backToHome')}
          </button>
        </div>
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
          <h3>{t('notifications.noNotifications')}</h3>
          <p>{t('notifications.noNotificationsDesc')}</p>
        </div>
      ) : (
        <div>
          {safeNotifications.map((notification) => (
            <div
              key={notification._id}
              className="notification-card"
              style={{
                backgroundColor: notification.read ? "#f8f9fa" : "#fff",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderLeft: notification.read ? "4px solid #6c757d" : "4px solid #17a2b8",
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
                opacity: notification.read ? 0.8 : 1,
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
              {/* Read/Unread indicator */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: notification.read ? "#6c757d" : "#17a2b8",
                }}
              />
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
                <span>{t('notifications.clickToView')}</span>
              </div>

              <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>
                {t('notifications.handoverRequestFrom')} {notification.fromUser?.firstName}{" "}
                {notification.fromUser?.lastName}
                {notification.read && (
                  <span style={{ 
                    fontSize: "12px", 
                    color: "#6c757d", 
                    marginLeft: "10px",
                    fontWeight: "normal"
                  }}>
                    {t('notifications.read')}
                  </span>
                )}
              </h3>

              <div style={{ marginBottom: "15px" }}>
                <p>
                  <strong>{t('notifications.lotoSerial')}:</strong>{" "}
                  <span style={{ color: "#6366f1", fontWeight: "600" }}>
                    {notification.lotoId?.serialNumber}
                  </span>
                </p>
                <p>
                  <strong>{t('notifications.equipment')}:</strong>{" "}
                  {notification.lotoDetails?.isolatedPart}
                </p>
                <p>
                  <strong>{t('notifications.reason')}:</strong> {notification.lotoDetails?.reason}
                </p>
                <p>
                  <strong>{t('notifications.shift')}:</strong> {notification.lotoDetails?.shift}
                </p>
                <p>
                  <strong>{t('notifications.line')}:</strong> {notification.lotoDetails?.line}
                </p>
                {notification.handoverNotes && (
                  <p>
                    <strong>{t('notifications.notes')}:</strong> {notification.handoverNotes}
                  </p>
                )}
                <p>
                  <strong>{t('notifications.requested')}:</strong>{" "}
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
                  {t('notifications.clickToViewDetails')}
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
