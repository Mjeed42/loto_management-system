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
    },
    {
      title: "View Active LOTOs",
      description: "Manage your current lockout/tagout procedures",
      icon: "list",
      variant: "success",
      action: () => navigate("/loto-list"),
      gradient: "linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%)",
    },
    {
      title: "Notifications",
      description: "View pending handover requests",
      icon: "notification",
      variant: "info",
      action: () => navigate("/notifications"),
      gradient: "linear-gradient(135deg, var(--info-500) 0%, var(--info-600) 100%)",
    },
  ];

  const systemStats = [
    {
      label: "System Status",
      value: "Operational",
      icon: "check",
      variant: "success",
      description: "All systems running normally",
    },
    {
      label: "Database",
      value: "Connected",
      icon: "check",
      variant: "success",
      description: "Database connection stable",
    },
    {
      label: "Authentication",
      value: "Active",
      icon: "check",
      variant: "success",
      description: "User authentication working",
    },
    {
      label: "Last Backup",
      value: "2 hours ago",
      icon: "save",
      variant: "info",
      description: "System backup completed",
    },
  ];

  const recentActivity = [
    {
      action: "LOTO Created",
      user: "John Doe",
      time: "10 minutes ago",
      icon: "add",
      variant: "primary",
    },
    {
      action: "LOTO Completed",
      user: "Jane Smith",
      time: "1 hour ago",
      icon: "completed",
      variant: "success",
    },
    {
      action: "Handover Request",
      user: "Mike Johnson",
      time: "2 hours ago",
      icon: "handover",
      variant: "warning",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="fw-bold text-primary mb-2 d-flex align-items-center">
                <Icon name="dashboard" size="lg" className="me-3" animate />
                Dashboard
              </h1>
              <p className="lead text-muted mb-0">
                Welcome to the LOTO Management System
              </p>
            </div>
            <div className="text-end">
              <div className="card bg-glass border-0 shadow-sm">
                <div className="card-body py-3 px-4">
                  <div className="d-flex align-items-center">
                    <Icon name="clock" size="sm" className="me-2 text-primary" />
                    <div>
                      <div className="fw-semibold">{currentTime.toLocaleTimeString()}</div>
                      <small className="text-muted">{currentTime.toLocaleDateString()}</small>
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
        <div className="col-12">
          <h3 className="fw-semibold mb-4 d-flex align-items-center">
            <Icon name="settings" className="me-2" />
            Quick Actions
          </h3>
        </div>
        {quickActions.map((action, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div
              className="card h-100 border-0 shadow-md hover-lift cursor-pointer transition"
              onClick={action.action}
              style={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="card-body text-center p-5">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 shadow-glow"
                  style={{ 
                    width: "80px", 
                    height: "80px",
                    background: action.gradient
                  }}
                >
                  <Icon name={action.icon} size="xl" color="white" />
                </div>
                <h5 className="card-title fw-bold mb-3">{action.title}</h5>
                <p className="card-text text-muted mb-4">{action.description}</p>
                <Button 
                  variant={action.variant} 
                  onClick={action.action}
                  className="hover-scale"
                  icon={<Icon name="add" size="sm" />}
                  iconPosition="right"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Overview & Recent Activity */}
      <div className="row">
        {/* System Overview */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-md">
            <div className="card-header bg-glass border-0 py-4">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <Icon name="info" className="me-2 text-primary" />
                System Overview
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                {systemStats.map((stat, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex align-items-start p-3 rounded-lg bg-light hover-lift transition">
                      <div className={`badge badge-${stat.variant} rounded-circle p-2 me-3`}
                           style={{ width: '40px', height: '40px' }}>
                        <Icon name={stat.icon} size="sm" />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-gray-800">{stat.value}</div>
                        <small className="text-muted fw-medium">{stat.label}</small>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {stat.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-md">
            <div className="card-header bg-glass border-0 py-4">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <Icon name="clock" className="me-2 text-primary" />
                Recent Activity
              </h5>
            </div>
            <div className="card-body p-0">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-4 border-bottom hover-lift transition">
                  <div className="d-flex align-items-start">
                    <div className={`badge badge-${activity.variant} rounded-circle p-2 me-3`}
                         style={{ width: '32px', height: '32px' }}>
                      <Icon name={activity.icon} size="xs" />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold text-gray-800 mb-1">
                        {activity.action}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                        by {activity.user}
                      </div>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/notifications")}
                  icon={<Icon name="list" size="xs" />}
                >
                  View All Activity
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" 
               style={{ 
                 background: 'var(--gradient-cool)',
                 color: 'var(--gray-800)'
               }}>
            <div className="card-body text-center py-5">
              <Icon name="check" size="xl" className="mb-3 text-success" />
              <h4 className="fw-bold mb-3">System Ready</h4>
              <p className="mb-0 text-muted">
                All systems are operational and ready for lockout/tagout procedures.
                <br />
                Follow safety protocols and maintain compliance at all times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

