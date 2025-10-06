import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "./Button";
import Icon from "./Icon";
import NotificationBadge from "./NotificationBadge";

const Header = ({ currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const userRef = useRef(null);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    const titleMap = {
      "/Home": "Home",
      "/loto-list": "My LOTOs",
      "/create-loto": "Create LOTO",
      "/admin": "Admin Panel",
      "/data-export": "Data Export",
      "/monitoring": "Monitoring",
      "/notifications": "Notifications"
    };

    // Handle LOTO detail pages
    if (path.startsWith("/loto/")) {
      if (path.includes("/update")) return "Update LOTO";
      if (path.includes("/handover")) return "Handover LOTO";
      if (path.includes("/complete")) return "Complete LOTO";
      return "LOTO Details";
    }

    return titleMap[path] || "LOTO Management";
  };

  const handleLogout = () => {
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
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!currentUser) {
    return (
      <header className="modern-header">
        <div className="header-container">
          <div
            className="header-brand cursor-pointer hover-scale transition"
            onClick={() => navigate("/")}
          >
            <div className="brand-logo">
              <img 
                src="https://logos-world.net/wp-content/uploads/2022/03/Pepsico-Symbol.png" 
                alt="PepsiCo Logo" 
                className="navbar-pepsico-logo"
              />
            </div>
            <div className="brand-text">
              <div className="brand-icon">
                <Icon name="lock" />
              </div>
              <div className="brand-title">
                <h1>LOTO Management</h1>
                
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Page Title - Now the main focus */}
        <div className="page-title">
          <h2>{getPageTitle()}</h2>
        </div>

        <div className="header-actions">
          {/* Notifications Dropdown */}
          <div className="header-dropdown" ref={notificationRef}>
            <button
              className="notification-btn"
              onClick={() =>
                setNotificationDropdownOpen(!notificationDropdownOpen)
              }
            >
              <Icon name="notification" />
              <NotificationBadge />
            </button>

            <div
              className={`modern-dropdown ${
                notificationDropdownOpen ? "show" : ""
              }`}
            >
              <div className="dropdown-header">
                <Icon name="notification" />
                <span>Notifications</span>
              </div>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/notifications");
                  setNotificationDropdownOpen(false);
                }}
              >
                <Icon name="list" />
                <span>View All Notifications</span>
              </button>
            </div>
          </div>

          {/* User Dropdown */}
          <div className="header-dropdown" ref={userRef}>
            <button
              className="user-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <div className="user-avatar">
                <Icon name="user" />
              </div>
              <div className="user-info">
                <span className="user-name">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <span className="user-role">{currentUser.role}</span>
              </div>
              <Icon name="chevron-down" className="chevron" />
            </button>

            <div className={`modern-dropdown ${userDropdownOpen ? "show" : ""}`}>
              <div className="dropdown-header">
                <div className="user-avatar">
                  <Icon name="user" />
                </div>
                <div className="user-details">
                  <span className="user-name">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                  <span className="user-role">{currentUser.role}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/Home");
                  setUserDropdownOpen(false);
                }}
              >
                <Icon name="Home" />
                <span>Home</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/loto-list");
                  setUserDropdownOpen(false);
                }}
              >
                <Icon name="list" />
                <span>My LOTOs</span>
              </button>

              {/* Admin Page Link */}
              {currentUser.role === "admin" && (
                <>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/admin");
                      setUserDropdownOpen(false);
                    }}
                  >
                    <Icon name="settings" />
                    <span>Admin Page</span>
                  </button>
                </>
              )}

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <Icon name="logout" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
