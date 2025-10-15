import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import Icon from "./Icon";
import NotificationBadge from "./NotificationBadge";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = ({ currentUser, onToggleSidebar }) => {
  const { t } = useTranslation();
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
      "/Home": t('header.home'),
      "/technician-home": t('header.home'),
      "/loto-list": t('header.myLotos'),
      "/create-loto": t('header.createLoto'),
      "/admin": t('header.adminPanel'),
      "/data-export": t('header.dataExport'),
      "/monitoring": t('header.monitoring'),
      "/notifications": t('header.notifications')
    };

    // Handle LOTO detail pages
    if (path.startsWith("/loto/")) {
      if (path.includes("/update")) return t('header.updateLoto');
      if (path.includes("/handover")) return t('header.handoverLoto');
      if (path.includes("/complete")) return t('header.completeLoto');
      return t('header.lotoDetails');
    }

    return titleMap[path] || t('header.lotoManagementTitle');
  };

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigate to login page
    navigate("/");
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
                <h1>{t('header.lotoManagement')}</h1>
                
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
        {/* Mobile Sidebar Toggle */}
        <button 
          className="sidebar-mobile-toggle"
          onClick={onToggleSidebar}
          title={t('header.openSidebar')}
        >
          <Icon name="menu" />
        </button>

        {/* Page Title - Now the main focus */}
        <div className="page-title">
          <h2>{getPageTitle()}</h2>
        </div>

        <div className="header-actions">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
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
                <span>{t('header.notifications')}</span>
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
                <span>{t('header.viewAllNotifications')}</span>
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
                <span className="user-role">{t(`user.${currentUser.role}`)}</span>
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
                  <span className="user-role">{t(`user.${currentUser.role}`)}</span>
                </div>
              </div>
              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item"
                onClick={() => {
                  navigate(currentUser.role === "technician" ? "/technician-home" : "/Home");
                  setUserDropdownOpen(false);
                }}
              >
                <Icon name="Home" />
                <span>{t('header.home')}</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/loto-list");
                  setUserDropdownOpen(false);
                }}
              >
                <Icon name="list" />
                <span>{t('header.myLotos')}</span>
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
                    <span>{t('header.adminPage')}</span>
                  </button>
                </>
              )}

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <Icon name="logout" />
                <span>{t('header.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
