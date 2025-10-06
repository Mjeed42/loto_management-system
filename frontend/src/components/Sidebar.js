import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "./Icon";

const Sidebar = ({ currentUser, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed like GitHub
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
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
        label: "Home", 
        icon: "home",
        description: "Dashboard"
      },
      { 
        path: "/create-loto", 
        label: "Create LOTO", 
        icon: "plus",
        description: "New LOTO"
      },
      { 
        path: "/loto-list", 
        label: currentUser.role === "technician" ? "My LOTOs" : "All LOTOs", 
        icon: "list",
        description: "LOTO List"
      }
    ];

    // Add notifications for supervisors and admins
    if (currentUser.role !== "technician") {
      items.push({
        path: "/notifications", 
        label: "Notifications", 
        icon: "notification",
        description: "Alerts"
      });
    }

    // Add admin items
    if (currentUser.role === "admin") {
      items.push(
        { 
          path: "/admin", 
          label: "Admin", 
          icon: "settings",
          description: "Settings"
        },
        { 
          path: "/data-export", 
          label: "Reports", 
          icon: "download",
          description: "Export"
        },
        { 
          path: "/monitoring", 
          label: "Monitoring", 
          icon: "chart",
          description: "Analytics"
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

      {/* Hamburger Button - Only show when sidebar is closed */}
      {!isMobileOpen && (
        <button 
          className="sidebar-hamburger-btn"
          onClick={toggleMobileSidebar}
          title="Open sidebar"
        >
          <Icon name="menu" />
        </button>
      )}

      {/* GitHub-style Sidebar */}
      <aside className={`sidebar github-style ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
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
            {(!isCollapsed || isMobileOpen) && (
              <div className="brand-text">
                <h3>LOTO Management</h3>
                <span>Lockout/Tagout System</span>
              </div>
            )}
          </div>
          
          {/* Close Button - Show when sidebar is open */}
          <button 
            className="sidebar-close-btn"
            onClick={toggleMobileSidebar}
            title="Close sidebar"
          >
            <Icon name="x" />
          </button>
          
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
          {(!isCollapsed || isMobileOpen) && (
            <div className="user-info">
              <span className="user-name">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span className="user-role">{currentUser.role}</span>
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
              {(!isCollapsed || isMobileOpen) && (
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
            title={isCollapsed ? "Logout" : "Sign out of system"}
          >
            <div className="nav-icon">
              <Icon name="logout" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="nav-content">
                <span className="nav-label">Logout</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
