import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      title: "Create New LOTO",
      description: "Start a new lockout/tagout procedure",
      icon: "add",
      variant: "primary",
      action: () => navigate("/create-loto"),
      gradient: "var(--gradient-primary)",
      color: "#0ea5e9",
    },
    {
      title: "View Active LOTOs",
      description: "Manage your current lockout/tagout procedures",
      icon: "list",
      variant: "success",
      action: () => navigate("/loto-list"),
      gradient:
        "linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%)",
      color: "#22c55e",
    },
    {
      title: "Notifications",
      description: "View pending handover requests",
      icon: "notification",
      variant: "info",
      action: () => navigate("/notifications"),
      gradient:
        "linear-gradient(135deg, var(--info-500) 0%, var(--info-600) 100%)",
      color: "#0ea5e9",
    },
  ];

  const systemStats = [
    {
      label: "System Status",
      value: "Operational",
      icon: "✅",
      variant: "success",
      description: "All systems running normally",
      count: "100%",
    },
    {
      label: "Active LOTOs",
      value: "8",
      icon: "⚡",
      variant: "warning",
      description: "Currently in progress",
      count: "8",
    },
    {
      label: "Completed Today",
      value: "12",
      icon: "✅",
      variant: "success",
      description: "Successfully completed",
      count: "12",
    },
    {
      label: "Pending Approval",
      value: "3",
      icon: "⏳",
      variant: "info",
      description: "Awaiting verification",
      count: "3",
    },
  ];

  const recentActivity = [
    {
      action: "LOTO Created",
      user: "John Doe",
      time: "10 minutes ago",
      icon: "➕",
      variant: "primary",
      details: "Equipment: Pump A-101",
    },
    {
      action: "LOTO Completed",
      user: "Jane Smith",
      time: "1 hour ago",
      icon: "✅",
      variant: "success",
      details: "Duration: 2.5 hours",
    },
    {
      action: "Handover Request",
      user: "Mike Johnson",
      time: "2 hours ago",
      icon: "🔄",
      variant: "warning",
      details: "Pending acceptance",
    },
    {
      action: "LOTO Verified",
      user: "Sarah Wilson",
      time: "3 hours ago",
      icon: "🔒",
      variant: "info",
      details: "Equipment: Motor B-205",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome Header */}
      <div className="row mb-5">
        <div className="col-12">
          <div
            className="card bg-glass border-0 shadow-lg hover-lift"
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="card-body py-5">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h1
                    className="fw-bold mb-3 d-flex align-items-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "2.5rem",
                    }}
                  >
                    <span className="me-3" style={{ fontSize: "3rem" }}>
                      🔒
                    </span>
                    LOTO Management Dashboard
                  </h1>
                  <p className="lead text-muted mb-0">
                    Welcome back! Manage your lockout/tagout procedures with
                    confidence.
                  </p>
                </div>
                <div className="text-end">
                  <div className="card bg-glass border-0 shadow-sm hover-lift">
                    <div className="card-body py-3 px-4">
                      <div className="d-flex align-items-center">
                        <span className="me-3" style={{ fontSize: "1.5rem" }}>
                          🕐
                        </span>
                        <div>
                          <div
                            className="fw-bold"
                            style={{ fontSize: "1.2rem", color: "#1e293b" }}
                          >
                            {currentTime.toLocaleTimeString()}
                          </div>
                          <small className="text-muted fw-medium">
                            {currentTime.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col-12"></div>
        {quickActions.map((action, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div
              className="card h-100 border-0 shadow-md hover-lift cursor-pointer transition"
              onClick={action.action}
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                transform: "translateY(0)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-8px)";
                e.target.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "var(--shadow-md)";
              }}
            >
              <div className="card-body text-center p-5">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 shadow-lg"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: action.gradient,
                    fontSize: "2rem",
                  }}
                >
                  {action.icon === "add" && "➕"}
                  {action.icon === "list" && "📋"}
                  {action.icon === "notification" && "🔔"}
                </div>
                <h5 className="card-title fw-bold mb-3 text-gray-800">
                  {action.title}
                </h5>
                <p className="card-text text-muted mb-4">
                  {action.description}
                </p>
                <Button
                  variant={action.variant}
                  className="hover-scale transition"
                  style={{ minWidth: "120px" }}
                >
                  Get Started →
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & System Status */}
      <div className="row">
        {/* Recent Activity */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-md">
            <div className="card-header bg-glass border-0 py-4">
              <h5 className="mb-0 fw-bold d-flex align-items-center text-gray-800">
                <span className="me-3">📈</span>
                Recent Activity
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="timeline">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="timeline-item">
                    <div className="d-flex align-items-start">
                      <div
                        className={`rounded-circle p-2 me-3 d-flex align-items-center justify-content-center`}
                        style={{
                          width: "40px",
                          height: "40px",
                          background: `linear-gradient(135deg, var(--${activity.variant}-400) 0%, var(--${activity.variant}-600) 100%)`,
                          color: "white",
                          fontSize: "1rem",
                          boxShadow: "var(--shadow-sm)",
                        }}
                      >
                        {activity.icon}
                      </div>
                      <div className="flex-grow-1">
                        <div className="timeline-time text-muted">
                          {activity.time}
                        </div>
                        <div className="timeline-content">
                          <div className="fw-semibold text-gray-800 mb-1">
                            {activity.action}
                          </div>
                          <div className="text-muted mb-1">
                            by{" "}
                            <span className="fw-medium">{activity.user}</span>
                          </div>
                          <small className="text-muted">
                            {activity.details}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 text-center border-top">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/notifications")}
                  className="hover-scale"
                >
                  📋 View All Activity
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
