import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import Icon from "./Icon";

const Sidebar = ({ currentUser, onCollapse, isMobileOpen, setIsMobileOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed like GitHub
  // Use the mobile state from parent component
  const mobileOpen = isMobileOpen !== undefined ? isMobileOpen : false;
  const setMobileOpen = setIsMobileOpen || (() => {});
  
  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GitHub-style navigation structure
  const getNavigationItems = () => {
    if (!currentUser) return [];

    const items = [
      { 
        path: currentUser.role === "technician" ? "/technician-home" : "/Home", 
        label: t('sidebar.home'), 
        icon: "home",
        description: t('sidebar.dashboard')
      },
      { 
        path: "/create-loto", 
        label: t('sidebar.createLoto'), 
        icon: "plus",
        description: t('sidebar.newLoto')
      },
      { 
        path: "/loto-list", 
        label: currentUser.role === "technician" ? t('sidebar.myLotos') : t('sidebar.allLotos'), 
        icon: "list",
        description: t('sidebar.lotoList')
      }
    ];

    // Add notifications for supervisors and admins
    if (currentUser.role !== "technician") {
      items.push({
        path: "/notifications", 
        label: t('sidebar.notifications'), 
        icon: "notification",
        description: t('sidebar.alerts')
      });
    }

    // Add admin items
    if (currentUser.role === "admin") {
      items.push(
        { 
          path: "/admin", 
          label: t('sidebar.admin'), 
          icon: "settings",
          description: t('sidebar.settings')
        },
        { 
          path: "/monitoring", 
          label: t('sidebar.monitoring'), 
          icon: "chart",
          description: t('sidebar.analytics')
        },
        { 
          path: "/database-export", 
          label: t('sidebar.reports'), 
          icon: "download",
          description: t('sidebar.export')
        },
        { 
          path: "/location-management", 
          label: t('sidebar.locationManagement'), 
          icon: "map-pin",
          description: t('sidebar.locationManagementDesc')
        },
        { 
          path: "/energy-types-management", 
          label: t('sidebar.energyTypes'), 
          icon: "zap",
          description: t('sidebar.energyTypesDesc')
        }
      );
    }

    return items;
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!currentUser) return null;

  const navigationItems = getNavigationItems();

  return (
    <>
              {/* Mobile Overlay */}
              {mobileOpen && (
                <div
                  className="sidebar-overlay"
                  onClick={toggleMobileSidebar}
                />
              )}

              {/* GitHub-style Sidebar */}
              <aside className={`sidebar github-style ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo">
              <img 
                src="https://logos-world.net/wp-content/uploads/2022/03/Pepsico-Symbol.png" 
                alt="PepsiCo Logo" 
                className="sidebar-logo"
              />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="brand-text">
                <h3>{t('sidebar.lotoManagement')}</h3>
              
              </div>
            )}
          </div>
          
          {/* Close Button - Show when sidebar is open */}
          <button 
            className="sidebar-close-btn"
            onClick={toggleMobileSidebar}
            title={t('sidebar.closeSidebar')}
          >
            <Icon name="x" />
          </button>
          
          {/* Desktop Toggle */}
          <button 
            className="sidebar-toggle desktop-only"
            onClick={toggleSidebar}
            title={isCollapsed ? t('sidebar.expandSidebar') : t('sidebar.collapseSidebar')}
          >
            <Icon name={isCollapsed ? "chevron-right" : "chevron-left"} />
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <Icon name="user" />
          </div>
          {(!isCollapsed || mobileOpen) && (
            <div className="user-info">
              <span className="user-name">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span className="user-role">{t(`user.${currentUser.role}`)}</span>
            </div>
          )}
        </div>

        {/* GitHub-style Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((item, index) => (
            <button
              key={item.path}
              className={`nav-item ${isActivePath(item.path) ? "active" : ""}`}
              onClick={() => {
                navigate(item.path);
                setIsMobileOpen(false);
              }}
              title={isCollapsed ? item.label : item.description}
            >
              <div className="nav-icon">
                <Icon name={item.icon} />
              </div>
              {(!isCollapsed || mobileOpen) && (
                <div className="nav-content">
                  <span className="nav-label">{item.label}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button 
            className="nav-item logout-item"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            title={isCollapsed ? t('sidebar.logout') : t('sidebar.signOut')}
          >
            <div className="nav-icon">
              <Icon name="logout" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="nav-content">
                <span className="nav-label">{t('sidebar.logout')}</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
