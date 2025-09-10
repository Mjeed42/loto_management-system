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
      icon: "➕",
      variant: "primary",
      action: () => navigate("/create-loto"),
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#6366f1",
    },
    {
      title: "View Active LOTOs",
      description: "Manage your current lockout/tagout procedures",
      icon: "📋",
      variant: "success",
      action: () => navigate("/loto-list"),
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      color: "#10b981",
    },
    {
      title: "Notifications",
      description: "View pending handover requests",
      icon: "🔔",
      variant: "info",
      action: () => navigate("/notifications"),
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      color: "#06b6d4",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-logo">
            <span className="lock-icon">🔒</span>
            <h1>LOTO Management Dashboard</h1>
          </div>
          <div className="header-time">
            <div className="clock-icon">⏰</div>
            <div>
              <div className="current-time">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="current-date">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="welcome-message">
          Welcome back! Manage your lockout/tagout procedures with confidence.
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="dashboard-cards">
        {quickActions.map((action, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={action.action}
          >
            <div
              className="card-icon"
              style={{ background: action.gradient }}
            >
              <span>{action.icon}</span>
            </div>
            <div className="card-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <Button
                variant={action.variant}
                className="btn-get-started"
                style={{ minWidth: "120px" }}
              >
                Get Started →
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
