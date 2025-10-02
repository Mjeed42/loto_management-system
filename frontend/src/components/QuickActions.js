import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

const QuickActions = ({ currentUser, className = "" }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const getQuickActions = () => {
    const actions = [
      {
        label: "Create New LOTO",
        icon: "plus",
        path: "/create-loto",
        color: "primary",
        description: "Start a new lockout/tagout procedure"
      },
      {
        label: "My LOTOs",
        icon: "list",
        path: "/loto-list",
        color: "info",
        description: "View all your LOTO requests"
      }
    ];

    if (currentUser.role === "admin") {
      actions.push(
        {
          label: "Admin Dashboard",
          icon: "settings",
          path: "/admin",
          color: "warning",
          description: "Access administrative functions"
        },
        {
          label: "Export Data",
          icon: "download",
          path: "/data-export",
          color: "success",
          description: "Export LOTO data and reports"
        }
      );
    }

    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <div className={`quick-actions ${className}`}>
      {/* Floating Action Button */}
      <button
        className={`quick-actions-fab ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Quick Actions"
      >
        <Icon name={isOpen ? "x" : "zap"} />
      </button>

      {/* Actions Menu */}
      <div className={`quick-actions-menu ${isOpen ? "open" : ""}`}>
        <div className="quick-actions-header">
          <Icon name="zap" />
          <span>Quick Actions</span>
        </div>
        
        {quickActions.map((action, index) => (
          <button
            key={action.path}
            className={`quick-action-item ${action.color}`}
            onClick={() => {
              navigate(action.path);
              setIsOpen(false);
            }}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="action-icon">
              <Icon name={action.icon} />
            </div>
            <div className="action-content">
              <span className="action-label">{action.label}</span>
              <span className="action-description">{action.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="quick-actions-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default QuickActions;
