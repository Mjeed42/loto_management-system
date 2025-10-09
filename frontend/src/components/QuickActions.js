import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";

const QuickActions = ({ currentUser, className = "" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const getQuickActions = () => {
    const actions = [
      {
        label: t('quickActions.createNewLoto'),
        icon: "plus",
        path: "/create-loto",
        color: "primary",
        description: t('quickActions.createNewLotoDesc')
      },
      {
        label: t('quickActions.myLotos'),
        icon: "list",
        path: "/loto-list",
        color: "info",
        description: t('quickActions.myLotosDesc')
      }
    ];

    if (currentUser.role === "admin") {
      actions.push(
        {
          label: t('quickActions.adminDashboard'),
          icon: "settings",
          path: "/admin",
          color: "warning",
          description: t('quickActions.adminDashboardDesc')
        },
        {
          label: t('quickActions.exportData'),
          icon: "download",
          path: "/data-export",
          color: "success",
          description: t('quickActions.exportDataDesc')
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
        title={t('quickActions.title')}
      >
        <Icon name={isOpen ? "x" : "zap"} />
      </button>

      {/* Actions Menu */}
      <div className={`quick-actions-menu ${isOpen ? "open" : ""}`}>
        <div className="quick-actions-header">
          <Icon name="zap" />
          <span>{t('quickActions.title')}</span>
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
