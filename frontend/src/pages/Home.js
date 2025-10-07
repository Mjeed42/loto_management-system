import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    totalLOTOs: 0,
    activeLOTOs: 0,
    pendingVerification: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchUserData();
    fetchStats();
    return () => clearInterval(timer);
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/auth/me",
        config
      );
      setCurrentUser(res.data.user);
    } catch (err) {
      console.log("Error fetching current user");
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
        config
      );

      let lotosData = [];
      if (res.data && res.data.data) {
        lotosData = Array.isArray(res.data.data) ? res.data.data : [];
      } else if (Array.isArray(res.data)) {
        lotosData = res.data;
      }

      const today = new Date().toDateString();
      const completedToday = lotosData.filter(loto => 
        loto.status === "completed" && 
        new Date(loto.updatedAt).toDateString() === today
      ).length;

      setStats({
        totalLOTOs: lotosData.length,
        activeLOTOs: lotosData.filter(l => l.status === "active").length,
        pendingVerification: lotosData.filter(l => l.status === "pending_verification_new").length,
        completedToday: completedToday
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setLoading(false);
    }
  };

  const getQuickActions = () => {
    if (!currentUser) return [];


    // Full actions for supervisors and admins
    const baseActions = [
      {
        title: "Create New LOTO",
        description: "Start a new lockout/tagout safety procedure",
        icon: "➕",
        variant: "primary",
        action: () => navigate("/create-loto"),
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#6366f1",
        badge: "Primary Action",
        roles: ["supervisor", "admin"]
      },
      {
        title: "View All LOTOs",
        description: "Manage and monitor all lockout/tagout procedures",
        icon: "📋",
        variant: "success",
        action: () => navigate("/loto-list"),
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        color: "#10b981",
        badge: "Dashboard",
        roles: ["supervisor", "admin"]
      },
      
    ];

    // Admin-only actions
    if (currentUser.role === "admin") {
      baseActions.push(
        {
          title: "Admin Panel",
          description: "System administration and user management",
          icon: "⚙️",
          variant: "warning",
          action: () => navigate("/admin"),
          gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
          color: "#f59e0b",
          badge: "Admin Only",
          roles: ["admin"]
        },
        {
          title: "Data Export",
          description: "Export LOTO data for reporting and analysis",
          icon: "📊",
          variant: "secondary",
          action: () => navigate("/data-export"),
          gradient: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
          color: "#6b7280",
          badge: "Reports",
          roles: ["admin"]
        },
        {
          title: "Monitoring Dashboard",
          description: "System monitoring and performance metrics",
          icon: "📈",
          variant: "info",
          action: () => navigate("/monitoring"),
          gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          color: "#3b82f6",
          badge: "Analytics",
          roles: ["admin"]
        }
      );
    }

    // Filter actions based on user role
    return baseActions.filter(action => action.roles.includes(currentUser.role));
  };

  const quickActions = getQuickActions();


  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getTimeOfDayIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "🌅";
    if (hour < 17) return "☀️";
    return "🌙";
  };

  // Full interface for supervisors and admins
  return (
    <div className="home-container animate-fade-in">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="greeting-section">
              <span className="greeting-icon">{getTimeOfDayIcon()}</span>
              <h1 className="greeting-title">
                {getGreeting()}, {currentUser?.firstName || "User"}!
              </h1>
            </div>
            
            <div className="hero-time">
              <div className="time-display">
                <span className="time-icon">⏰</span>
                <div className="time-content">
                  <div className="current-time">
                    {currentTime.toLocaleTimeString()}
                  </div>
                  <div className="current-date">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-icon">
              <span className="main-icon">🔒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="home-main-grid">
        

        {/* Quick Actions */}
        
          
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="action-card" onClick={action.action}>
                <div className="action-badge">{action.badge}</div>
                <div className="action-icon" style={{ background: action.gradient }}>
                  <span>{action.icon}</span>
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  <Button
                    variant={action.variant}
                    className="action-button"
                  >
                    Get Started →
                  </Button>
                </div>
              </div>
            ))}
          </div>
       

        
      </div>
    </div>
  );
};

export default Home;
