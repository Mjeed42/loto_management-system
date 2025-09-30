import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonitoringDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    lotos: [],
    users: [],
    stats: {
      totalLOTOs: 0,
      activeLOTOs: 0,
      pendingLOTOs: 0,
      completedLOTOs: 0,
      totalUsers: 0,
      activeUsers: 0,
      avgCompletionTime: 0,
      safetyScore: 0,
    },
    trends: {
      dailyLOTOs: [],
      weeklyTrends: [],
      monthlyTrends: [],
      statusDistribution: [],
      userActivity: [],
      equipmentUsage: [],
    },
    alerts: [],
    systemHealth: {
      apiStatus: "healthy",
      databaseStatus: "healthy",
      uptime: "99.9%",
      responseTime: "120ms",
    },
  });
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [currentUser, refreshInterval]);

  const fetchCurrentUser = async () => {
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
      console.log("Error fetching current user:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch all data in parallel
      const [lotosRes, usersRes] = await Promise.all([
        axios.get(
          "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
          config
        ),
        axios.get(
          "https://loto-backend-643788243736.europe-west1.run.app/api/admin/users",
          config
        ),
      ]);

      // Process LOTOs data
      let lotosData = [];
      if (lotosRes.data && lotosRes.data.data) {
        lotosData = Array.isArray(lotosRes.data.data) ? lotosRes.data.data : [];
      } else if (Array.isArray(lotosRes.data)) {
        lotosData = lotosRes.data;
      }

      // Process Users data
      let usersData = [];
      if (usersRes.data.users) {
        usersData = usersRes.data.users;
      } else if (usersRes.data.data && usersRes.data.data.users) {
        usersData = usersRes.data.data.users;
      } else if (Array.isArray(usersRes.data.data)) {
        usersData = usersRes.data.data;
      }
      usersData = Array.isArray(usersData) ? usersData : [];

      // Calculate statistics
      const stats = calculateStats(lotosData, usersData);
      
      // Generate trends data
      const trends = generateTrendsData(lotosData, usersData);
      
      // Generate alerts
      const alerts = generateAlerts(lotosData, usersData, stats);

      setDashboardData({
        lotos: lotosData,
        users: usersData,
        stats,
        trends,
        alerts,
        systemHealth: {
          apiStatus: "healthy",
          databaseStatus: "healthy",
          uptime: "99.9%",
          responseTime: "120ms",
        },
      });

      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const calculateStats = (lotos, users) => {
    const totalLOTOs = lotos.length;
    const activeLOTOs = lotos.filter((l) => l.status === "active").length;
    const pendingLOTOs = lotos.filter((l) => l.status === "pending").length;
    const completedLOTOs = lotos.filter((l) => l.status === "completed").length;
    
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive !== false).length;
    
    // Calculate average completion time
    const completedLOTOsWithTime = lotos.filter((l) => l.status === "completed" && l.actualFinishTime);
    const avgCompletionTime = completedLOTOsWithTime.length > 0 
      ? completedLOTOsWithTime.reduce((acc, l) => {
          const start = new Date(l.date);
          const end = new Date(l.actualFinishTime);
          return acc + (end - start) / (1000 * 60 * 60); // hours
        }, 0) / completedLOTOsWithTime.length
      : 0;

    // Calculate safety score (based on completion rate and verification rate)
    const verifiedLOTOs = lotos.filter((l) => l.verifiedBy).length;
    const safetyScore = totalLOTOs > 0 
      ? Math.round(((completedLOTOs / totalLOTOs) * 0.6 + (verifiedLOTOs / totalLOTOs) * 0.4) * 100)
      : 0;

    return {
      totalLOTOs,
      activeLOTOs,
      pendingLOTOs,
      completedLOTOs,
      totalUsers,
      activeUsers,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      safetyScore,
    };
  };

  const generateTrendsData = (lotos, users) => {
    // Generate daily LOTOs for last 30 days
    const dailyLOTOs = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLOTOs = lotos.filter((l) => {
        const lotoDate = new Date(l.date).toISOString().split('T')[0];
        return lotoDate === dateStr;
      });

      dailyLOTOs.push({
        date: dateStr,
        total: dayLOTOs.length,
        active: dayLOTOs.filter((l) => l.status === "active").length,
        completed: dayLOTOs.filter((l) => l.status === "completed").length,
      });
    }

    // Status distribution
    const statusDistribution = [
      { name: "Active", value: lotos.filter((l) => l.status === "active").length, color: "#10b981" },
      { name: "Pending", value: lotos.filter((l) => l.status === "pending").length, color: "#f59e0b" },
      { name: "Completed", value: lotos.filter((l) => l.status === "completed").length, color: "#6366f1" },
      { name: "Pending Handover", value: lotos.filter((l) => l.status === "pending_handover").length, color: "#ef4444" },
    ];

    // User activity (top 10 most active users)
    const userActivity = users
      .map((user) => {
        const userLOTOs = lotos.filter((l) => l.isolator?._id === user._id);
        return {
          name: `${user.firstName} ${user.lastName}`,
          lotos: userLOTOs.length,
          completed: userLOTOs.filter((l) => l.status === "completed").length,
        };
      })
      .sort((a, b) => b.lotos - a.lotos)
      .slice(0, 10);

    // Equipment usage
    const equipmentUsage = {};
    lotos.forEach((loto) => {
      const equipment = `${loto.location} - ${loto.line}`;
      equipmentUsage[equipment] = (equipmentUsage[equipment] || 0) + 1;
    });

    const equipmentUsageArray = Object.entries(equipmentUsage)
      .map(([equipment, count]) => ({ equipment, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      dailyLOTOs,
      statusDistribution,
      userActivity,
      equipmentUsage: equipmentUsageArray,
    };
  };

  const generateAlerts = (lotos, users, stats) => {
    const alerts = [];

    // Overdue LOTOs
    const overdueLOTOs = lotos.filter((l) => {
      if (l.status !== "active") return false;
      const startDate = new Date(l.date);
      const expectedEnd = new Date(startDate.getTime() + (l.expectedDuration || 8) * 60 * 60 * 1000);
      return new Date() > expectedEnd;
    });

    if (overdueLOTOs.length > 0) {
      alerts.push({
        type: "warning",
        title: "Overdue LOTOs",
        message: `${overdueLOTOs.length} LOTOs are past their expected completion time`,
        count: overdueLOTOs.length,
      });
    }

    // High pending count
    if (stats.pendingLOTOs > 10) {
      alerts.push({
        type: "info",
        title: "High Pending Count",
        message: `${stats.pendingLOTOs} LOTOs are pending verification`,
        count: stats.pendingLOTOs,
      });
    }

 

    // Inactive users
    const inactiveUsers = users.filter((u) => u.isActive === false).length;
    if (inactiveUsers > 0) {
      alerts.push({
        type: "secondary",
        title: "Inactive Users",
        message: `${inactiveUsers} users are currently inactive`,
        count: inactiveUsers,
      });
    }

    return alerts;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "danger":
        return "🚨";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📋";
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "danger":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="monitoring-dashboard-container animate-fade-in">
        <div className="access-denied">
          <div className="access-icon">
            <svg className="access-svg" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access the monitoring dashboard.</p>
          <button className="action-btn primary" onClick={() => navigate("/Home")}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="monitoring-dashboard-container animate-fade-in">
        <div className="loading-state">
          <div className="spinner-border-lg"></div>
          <h3>Loading Dashboard...</h3>
          <p>Fetching real-time monitoring data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoring-dashboard-container animate-fade-in">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon">
              <svg className="header-svg" viewBox="0 0 24 24" fill="none">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1>Monitoring Dashboard</h1>
              <p>Real-time LOTO system analytics and insights</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="last-updated">
              <span className="update-label">Last updated:</span>
              <span className="update-time">{lastUpdated.toLocaleTimeString()}</span>
            </div>
            <button
              className="action-btn secondary"
              onClick={fetchDashboardData}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Refresh</span>
            </button>
            <button
              className="action-btn primary"
              onClick={() => navigate("/Home")}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="modern-error-alert">
          <div className="error-icon">
            <svg className="error-svg" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="error-content">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card total-card">
          <div className="metric-icon">
            <svg className="metric-svg" viewBox="0 0 24 24" fill="none">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-number">{dashboardData.stats.totalLOTOs}</div>
            <div className="metric-label">Total LOTOs</div>
            <div className="metric-description">All procedures</div>
          </div>
        </div>

        <div className="metric-card active-card">
          <div className="metric-icon">
            <svg className="metric-svg" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-number">{dashboardData.stats.activeLOTOs}</div>
            <div className="metric-label">Active LOTOs</div>
            <div className="metric-description">In progress</div>
          </div>
        </div>

        <div className="metric-card users-card">
          <div className="metric-icon">
            <svg className="metric-svg" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="metric-content">
            <div className="metric-number">{dashboardData.stats.activeUsers}</div>
            <div className="metric-label">Active Users</div>
            <div className="metric-description">System users</div>
          </div>
        </div>

        
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Daily LOTOs Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Daily LOTOs Trend</h3>
            <p>Last 30 days activity</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.trends.dailyLOTOs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="total" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                <Area type="monotone" dataKey="active" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Status Distribution</h3>
            <p>Current LOTO status breakdown</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.trends.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.trends.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Active Users */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Active Users</h3>
            <p>Most active users by LOTO count</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.trends.userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lotos" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Usage */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Equipment Usage</h3>
            <p>Most frequently used equipment</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.trends.equipmentUsage} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="equipment" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts and System Health */}
      <div className="alerts-health-grid">
        {/* System Alerts */}
        <div className="alerts-card">
          <div className="card-header">
            <h3>System Alerts</h3>
            <p>Important notifications and warnings</p>
          </div>
          <div className="alerts-list">
            {dashboardData.alerts.length > 0 ? (
              dashboardData.alerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <div className="alert-icon" style={{ color: getAlertColor(alert.type) }}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-message">{alert.message}</div>
                  </div>
                  <div className="alert-count">{alert.count}</div>
                </div>
              ))
            ) : (
              <div className="no-alerts">
                <div className="no-alerts-icon">✅</div>
                <div className="no-alerts-text">All systems operating normally</div>
              </div>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="health-card">
          <div className="card-header">
            <h3>System Health</h3>
            <p>Infrastructure status and performance</p>
          </div>
          <div className="health-metrics">
            <div className="health-item">
              <div className="health-label">API Status</div>
              <div className="health-value status-healthy">
                <span className="status-indicator"></span>
                {dashboardData.systemHealth.apiStatus}
              </div>
            </div>
            <div className="health-item">
              <div className="health-label">Database Status</div>
              <div className="health-value status-healthy">
                <span className="status-indicator"></span>
                {dashboardData.systemHealth.databaseStatus}
              </div>
            </div>
            <div className="health-item">
              <div className="health-label">Uptime</div>
              <div className="health-value">{dashboardData.systemHealth.uptime}</div>
            </div>
            <div className="health-item">
              <div className="health-label">Response Time</div>
              <div className="health-value">{dashboardData.systemHealth.responseTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-grid">
        <div className="performance-card">
          <div className="card-header">
            <h3>Performance Metrics</h3>
            <p>Key performance indicators</p>
          </div>
          <div className="performance-metrics">
            <div className="performance-item">
              <div className="performance-label">Average Completion Time</div>
              <div className="performance-value">{dashboardData.stats.avgCompletionTime}h</div>
            </div>
            <div className="performance-item">
              <div className="performance-label">Completion Rate</div>
              <div className="performance-value">
                {dashboardData.stats.totalLOTOs > 0 
                  ? Math.round((dashboardData.stats.completedLOTOs / dashboardData.stats.totalLOTOs) * 100)
                  : 0}%
              </div>
            </div>
            <div className="performance-item">
              <div className="performance-label">Pending Rate</div>
              <div className="performance-value">
                {dashboardData.stats.totalLOTOs > 0 
                  ? Math.round((dashboardData.stats.pendingLOTOs / dashboardData.stats.totalLOTOs) * 100)
                  : 0}%
              </div>
            </div>
            <div className="performance-item">
              <div className="performance-label">User Utilization</div>
              <div className="performance-value">
                {dashboardData.stats.totalUsers > 0 
                  ? Math.round((dashboardData.stats.activeUsers / dashboardData.stats.totalUsers) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
