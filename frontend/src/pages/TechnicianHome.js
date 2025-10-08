import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TechnicianHome = ({ currentUser }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Simplified actions for technicians only
  const getTechnicianActions = () => {
    return [
      {
        title: t('technician.createNewLoto'),
        description: t('technician.createNewLotoDesc'),
        icon: "➕",
        variant: "primary",
        action: () => navigate("/create-loto"),
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#6366f1",
        badge: t('technician.mainAction'),
      },
      {
        title: t('technician.viewMyLotos'),
        description: t('technician.viewMyLotosDesc'),
        icon: "📋",
        variant: "success",
        action: () => navigate("/loto-list"),
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        color: "#10b981",
        badge: t('technician.viewList'),
      }
    ];
  };

  const technicianActions = getTechnicianActions();

  return (
    <div className="home-container animate-fade-in">
      <div className="home-simple-grid">
        {/* Simple Actions for Technicians */}
        <div className="home-actions-simple">
          
          <div className="actions-grid-simple">
            {technicianActions.map((action, index) => (
              <div key={index} className="action-card-simple" onClick={action.action}>
                <div className="action-icon-simple" style={{ background: action.gradient }}>
                  <span>{action.icon}</span>
                </div>
                <div className="action-content-simple">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianHome;


