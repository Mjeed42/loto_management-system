import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
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

      const res = await axios.get(
        "http://localhost:5000/api/notifications/handover",
        config
      );
      setNotifications(res.data.data || res.data.notifications || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching notifications");
      setNotifications([]);
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

      setNotifications(notifications.filter((n) => n._id !== notificationId));
      alert("Handover rejected");
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting handover");
    }
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <Icon name="notification" /> Handover Notifications
        </h1>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={fetchNotifications}>
            <Icon name="refresh" /> Refresh
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/dashboard")}
          >
            <Icon name="dashboard" /> Dashboard
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <Icon name="warning" /> {error}
        </div>
      )}

      {safeNotifications.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h3 className="mb-3">No pending notifications</h3>
          <p className="mb-4">You have no pending handover requests.</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="primary" onClick={() => navigate("/dashboard")}>
              <Icon name="dashboard" /> Go to Dashboard
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/loto-list")}
            >
              <Icon name="list" /> View LOTOs
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {safeNotifications.map((notification) => (
            <div key={notification._id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  <Icon name="handover" /> Handover Request from{" "}
                  {notification.fromUser?.firstName}{" "}
                  {notification.fromUser?.lastName}
                </h5>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Equipment:</strong>{" "}
                      {notification.lotoDetails?.isolatedPart}
                    </p>
                    <p className="mb-1">
                      <strong>Reason:</strong>{" "}
                      {notification.lotoDetails?.reason}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Shift:</strong> {notification.lotoDetails?.shift}
                    </p>
                    <p className="mb-1">
                      <strong>Requested:</strong>{" "}
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {notification.handoverNotes && (
                  <div className="mb-3">
                    <h6>
                      <Icon name="info" /> Notes:
                    </h6>
                    <p className="mb-0">{notification.handoverNotes}</p>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    onClick={() => handleAccept(notification._id)}
                  >
                    <Icon name="check" /> Accept
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => handleReject(notification._id)}
                  >
                    <Icon name="cancel" /> Reject
                  </Button>

                  <Button
                    variant="outline-primary"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Icon name="dashboard" /> Dashboard
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
