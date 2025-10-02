import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";

const Sidebar = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!currentUser) return [];

    const baseItems = [
      { 
        path: "/Home", 
        label: "Home", 
        icon: "home",
        description: "Overview and quick stats"
      },
      { 
        path: "/loto-list", 
        label: "My LOTOs", 
        icon: "list",
        description: "View and manage your LOTOs"
      },
      { 
        path: "/create-loto", 
        label: "Create LOTO", 
        icon: "plus",
        description: "Start new lockout procedure"
      },
      { 
        path: "/notifications", 
        label: "Notifications", 
        icon: "notification",
        description: "View system notifications"
      },
    ];

    if (currentUser.role === "admin") {
      baseItems.push(
        {
          type: "divider",
          label: "Administration"
        },
        { 
          path: "/admin", 
          label: "Admin Panel", 
          icon: "settings",
          description: "System administration"
        },
        { 
          path: "/data-export", 
          label: "Data Export", 
          icon: "download",
          description: "Export reports and data"
        },
        { 
          path: "/monitoring", 
          label: "Monitoring", 
          icon: "chart",
          description: "System monitoring dashboard"
        }
      );
    }

    return baseItems;
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  if (!currentUser) return null;

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-mobile-toggle"
        onClick={toggleMobileSidebar}
      >
        <Icon name="menu" />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
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
            {!isCollapsed && (
              <div className="brand-text">
                <h3>LOTO System</h3>
                <span>Lockout/Tagout</span>
              </div>
            )}
          </div>
          
          {/* Desktop Toggle */}
          <button 
            className="sidebar-toggle desktop-only"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={isCollapsed ? "chevron-right" : "chevron-left"} />
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <Icon name="user" />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span className="user-role">{currentUser.role}</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((item, index) => {
            if (item.type === "divider") {
              return (
                <div key={index} className="nav-divider">
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
              );
            }

            return (
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
                {!isCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button 
            className="nav-item logout-item"
            onClick={() => {
              // Clear tokens and storage
              localStorage.removeItem("token");
              sessionStorage.clear();
              
              // Clear all cookies
              document.cookie.split(";").forEach((cookie) => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
              });
              
              // Hard refresh to reset app state
              window.location.href = "/";
            }}
            title="Logout"
          >
            <div className="nav-icon">
              <Icon name="logout" />
            </div>
            {!isCollapsed && (
              <div className="nav-content">
                <span className="nav-label">Logout</span>
                <span className="nav-description">Sign out of system</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
