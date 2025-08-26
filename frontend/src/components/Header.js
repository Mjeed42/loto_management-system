import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Icon from "./Icon";
import NotificationBadge from "./NotificationBadge";

const Header = ({ currentUser }) => {
  const navigate = useNavigate();
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const notificationRef = useRef(null);
  const userRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
      <header className="navbar bg-glass shadow-sm animate-slide-down">
        <div className="container">
          <div
            className="navbar-brand cursor-pointer hover-scale transition"
            onClick={() => navigate("/")}
          >
            <Icon name="lock" className="me-2" />
            <span className="fw-bold">LOTO Manager</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="navbar bg-glass shadow-sm animate-slide-down">
      <div className="container">
        <div
          className="navbar-brand cursor-pointer hover-scale transition"
          onClick={() => navigate("/dashboard")}
        >
          <span className="fw-bold">LOTO Manager</span>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="dropdown position-relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="sm"
              className="position-relative hover-glow"
              onClick={() =>
                setNotificationDropdownOpen(!notificationDropdownOpen)
              }
              icon={<Icon name="notification" />}
            >
              <NotificationBadge />
            </Button>

            <div
              className={`dropdown-menu ${
                notificationDropdownOpen ? "show" : ""
              }`}
            >
              <div className="dropdown-item-text fw-semibold text-muted px-4 py-2">
                Notifications
              </div>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() => {
                  navigate("/notifications");
                  setNotificationDropdownOpen(false);
                }}
              >
                <Icon name="list" className="me-2" />
                View All Notifications
              </button>
            </div>
          </div>

          {/* User Dropdown */}
          <div className="dropdown position-relative" ref={userRef}>
            <Button
              variant="ghost"
              size="sm"
              className="hover-glow"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              icon={<Icon name="user" />}
            >
              <span className="d-none d-md-inline">
                {currentUser.firstName} {currentUser.lastName}
              </span>
            </Button>

            <div className={`dropdown-menu ${userDropdownOpen ? "show" : ""}`}>
              <div className="dropdown-item-text fw-semibold text-muted px-4 py-2">
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() => {
                  navigate("/dashboard");
                  setUserDropdownOpen(false);
                }}
              >
                <Icon name="dashboard" className="me-2" />
                Dashboard
              </button>

              <button
                className="dropdown-item d-flex align-items-center"
                onClick={() => {
                  navigate("/loto-list");
                  setUserDropdownOpen(false);
                }}
              >
                <Icon name="list" className="me-2" />
                My LOTOs
              </button>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item d-flex align-items-center text-danger"
                onClick={handleLogout}
              >
                <Icon name="logout" className="me-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
