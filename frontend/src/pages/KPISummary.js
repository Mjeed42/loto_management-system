import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/cloudflare-dashboard.css"; // Import the CSS file
import Icon from "../components/Icon";

const KPISummary = () => {
  const [kpiData, setKpiData] = useState({
    totalLotos: 0,
    activeLotos: 0,
    completedLotos: 0,
    pendingLotos: 0,
    avgCompletionTime: 0,
    onTimeCompletionRate: 0,
    handoverCount: 0,
    avgHandoverTime: 0,
    safetyIncidents: 0,
    lotoComplianceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30"); // days
  const [technicianData, setTechnicianData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKPIData();
    fetchTechnicianData();
  }, [timeRange]);

  const fetchKPIData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // This would be a new API endpoint to implement
      // For now, we'll simulate the data
      const mockData = {
        totalLotos: 127,
        activeLotos: 8,
        completedLotos: 112,
        pendingLotos: 7,
        avgCompletionTime: 3.2, // hours
        onTimeCompletionRate: 89, // percentage
        handoverCount: 23,
        avgHandoverTime: 1.8, // hours
        safetyIncidents: 1,
        lotoComplianceRate: 97, // percentage
      };

      setKpiData(mockData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching KPI ", err);
      setLoading(false);
    }
  };

  const fetchTechnicianData = async () => {
    try {
      // Mock technician data
      const mockTechData = [
        {
          name: "John Smith",
          completed: 24,
          active: 2,
          compliance: 98,
          efficiency: 92,
        },
        {
          name: "Jane Doe",
          completed: 18,
          active: 1,
          compliance: 100,
          efficiency: 88,
        },
        {
          name: "Mike Johnson",
          completed: 31,
          active: 3,
          compliance: 95,
          efficiency: 95,
        },
        {
          name: "Sarah Wilson",
          completed: 15,
          active: 1,
          compliance: 97,
          efficiency: 85,
        },
        {
          name: "David Brown",
          completed: 23,
          active: 1,
          compliance: 99,
          efficiency: 90,
        },
      ];
      setTechnicianData(mockTechData);
    } catch (err) {
      console.error("Error fetching technician ", err);
    }
  };

  const StatCard = ({
    title,
    value,
    unit,
    change,
    changeType,
    icon,
    color,
  }) => (
    <div className="cf-stat-card">
      <div className="cf-stat-content">
        <div className="cf-stat-info">
          <h3 className="cf-stat-title">{title}</h3>
          <div className="cf-flex cf-items-baseline">
            <p className="cf-stat-value">
              {value}
              {unit && <span className="cf-stat-unit">{unit}</span>}
            </p>
            {change && (
              <span
                className={`cf-stat-change ${
                  changeType === "positive" ? "positive" : "negative"
                }`}
              >
                {changeType === "positive" ? "↗" : "↘"} {change}%
              </span>
            )}
          </div>
        </div>
        <div className={`cf-stat-icon ${color}`}>
          <Icon name={icon} />
        </div>
      </div>
    </div>
  );

  const CircularProgress = ({
    value,
    size = 120,
    strokeWidth = 8,
    color = "blue",
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div
        className="cf-circular-progress"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={
              color === "blue"
                ? "#3b82f6"
                : color === "green"
                ? "#10b981"
                : color === "yellow"
                ? "#f59e0b"
                : "#ef4444"
            }
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="cf-circular-progress-text">{value}%</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="cf-dashboard">
        <div className="cf-loading-container">
          <div className="cf-spinner"></div>
          <p className="cf-loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cf-dashboard">
      {/* Header */}
      <div className="cf-header">
        <div className="cf-header-content">
          <div className="cf-header-inner">
            <div>
              <h1 className="cf-header-title">KPI Dashboard</h1>
              <p className="cf-header-subtitle">
                Operational & Safety Performance Metrics
              </p>
            </div>
            <div className="cf-header-actions">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="cf-select"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button onClick={fetchKPIData} className="cf-button secondary">
                <Icon name="refresh" className="cf-button-icon" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="cf-main">
        {/* Key Metrics Grid */}
        <div className="cf-grid cf-grid-gap-large cf-grid cols-4">
          <StatCard
            title="Total LOTOs"
            value={kpiData.totalLotos}
            icon="list"
            color="blue"
            change={5}
            changeType="positive"
          />
          <StatCard
            title="Active LOTOs"
            value={kpiData.activeLotos}
            icon="active"
            color="yellow"
            change={-2}
            changeType="negative"
          />
          <StatCard
            title="Completed LOTOs"
            value={kpiData.completedLotos}
            icon="check"
            color="green"
            change={8}
            changeType="positive"
          />
          <StatCard
            title="LOTO Compliance"
            value={kpiData.lotoComplianceRate}
            unit="%"
            icon="shield"
            color="purple"
            change={2}
            changeType="positive"
          />
        </div>

        {/* Performance Overview */}
        <div className="cf-grid cf-grid-gap-large cf-grid cols-3 cf-mb-8">
          <div className="cf-card cf-col-span-2">
            <div className="cf-card-header">
              <h2 className="cf-card-title">Performance Overview</h2>
              <div className="cf-flex cf-space-x-2">
                <button className="cf-button secondary cf-text-sm">
                  Efficiency
                </button>
                <button className="cf-button secondary cf-text-sm">
                  Timeliness
                </button>
                <button className="cf-button secondary cf-text-sm">
                  Compliance
                </button>
              </div>
            </div>

            <div className="cf-grid cf-grid cols-2 cf-grid-gap-large">
              <div className="cf-text-center">
                <h3 className="cf-stat-title cf-mb-4">Avg. Completion Time</h3>
                <div className="cf-flex cf-items-center cf-justify-center">
                  <Icon
                    name="clock"
                    className="cf-h-8 cf-w-8 cf-text-gray-400 cf-mr-3"
                  />
                  <span className="cf-stat-value">
                    {kpiData.avgCompletionTime} hrs
                  </span>
                </div>
                <div className="cf-mt-3">
                  <span className="cf-table-badge success">
                    ↓ 15% improvement
                  </span>
                </div>
              </div>

              <div className="cf-text-center">
                <h3 className="cf-stat-title cf-mb-4">On-Time Completion</h3>
                <div className="cf-flex cf-justify-center">
                  <CircularProgress
                    value={kpiData.onTimeCompletionRate}
                    color="green"
                  />
                </div>
                <div className="cf-mt-3">
                  <span className="cf-text-sm cf-text-gray-500">
                    Target: 95%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="cf-card">
            <h2 className="cf-card-title cf-mb-6">Safety Metrics</h2>

            <div className="cf-flex cf-items-center cf-mb-6">
              <div className="cf-stat-icon red">
                <Icon name="warning" />
              </div>
              <div className="cf-ml-4">
                <h3 className="cf-stat-value">{kpiData.safetyIncidents}</h3>
                <p className="cf-stat-title">Safety Incidents</p>
              </div>
            </div>

            <div className="cf-mb-6">
              <div className="cf-flex cf-justify-between cf-text-sm cf-text-gray-500 cf-mb-1">
                <span>Compliance Rate</span>
                <span>{kpiData.lotoComplianceRate}%</span>
              </div>
              <div className="cf-progress-container">
                <div className="cf-progress-track">
                  <div
                    className="cf-progress-fill green"
                    style={{ width: `${kpiData.lotoComplianceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="cf-stat-title cf-mb-3">Recent Achievements</h3>
              <ul className="cf-space-y-2">
                <li className="cf-flex cf-items-center">
                  <Icon
                    name="check"
                    className="cf-h-5 cf-w-5 cf-text-green-500 cf-mr-2"
                  />
                  <span className="cf-text-sm cf-text-gray-600">
                    30-day incident-free streak
                  </span>
                </li>
                <li className="cf-flex cf-items-center">
                  <Icon
                    name="check"
                    className="cf-h-5 cf-w-5 cf-text-green-500 cf-mr-2"
                  />
                  <span className="cf-text-sm cf-text-gray-600">
                    100% verification compliance
                  </span>
                </li>
                <li className="cf-flex cf-items-center">
                  <Icon
                    name="check"
                    className="cf-h-5 cf-w-5 cf-text-green-500 cf-mr-2"
                  />
                  <span className="cf-text-sm cf-text-gray-600">
                    Zero handover disputes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technician Performance */}
        <div className="cf-card cf-mb-8">
          <div className="cf-card-header">
            <h2 className="cf-card-title">Technician Performance</h2>
            <button className="cf-button secondary cf-button small">
              <Icon name="download" className="cf-button-icon" />
              Export Report
            </button>
          </div>
          <div className="cf-table-container">
            <table className="cf-table">
              <thead>
                <tr>
                  <th>Technician</th>
                  <th>Completed LOTOs</th>
                  <th>Active LOTOs</th>
                  <th>Compliance Rate</th>
                  <th>Efficiency Score</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {technicianData.map((tech, index) => (
                  <tr key={index}>
                    <td>
                      <div className="cf-table-avatar">
                        <div className="cf-table-avatar-img">
                          <Icon name="user" />
                        </div>
                        <div className="cf-table-avatar-info">
                          <div className="cf-table-avatar-name">
                            {tech.name}
                          </div>
                          <div className="cf-table-avatar-role">Technician</div>
                        </div>
                      </div>
                    </td>
                    <td>{tech.completed}</td>
                    <td>{tech.active}</td>
                    <td>
                      <div className="cf-table-progress">
                        <span className="cf-table-progress-value">
                          {tech.compliance}%
                        </span>
                        <div className="cf-table-progress-bar">
                          <div className="cf-progress-container">
                            <div className="cf-progress-track">
                              <div
                                className="cf-progress-fill green"
                                style={{ width: `${tech.compliance}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cf-table-progress">
                        <span className="cf-table-progress-value">
                          {tech.efficiency}%
                        </span>
                        <div className="cf-table-progress-bar">
                          <div className="cf-progress-container">
                            <div className="cf-progress-track">
                              <div
                                className={`cf-progress-fill ${
                                  tech.efficiency > 90
                                    ? "green"
                                    : tech.efficiency > 75
                                    ? "yellow"
                                    : "red"
                                }`}
                                style={{ width: `${tech.efficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`cf-table-badge ${
                          tech.efficiency > 90
                            ? "success"
                            : tech.efficiency > 75
                            ? "warning"
                            : "danger"
                        }`}
                      >
                        {tech.efficiency > 90
                          ? "Excellent"
                          : tech.efficiency > 75
                          ? "Good"
                          : "Needs Improvement"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


          <div className="cf-card">
            <h2 className="cf-card-title cf-mb-6">Performance Targets</h2>
            <div className="cf-space-y-6">
              <div>
                <div className="cf-flex cf-justify-between cf-mb-1">
                  <span className="cf-text-sm cf-font-medium cf-text-gray-700">
                    LOTO Compliance
                  </span>
                  <span
                    className="cf-text-sm cf-font-bold"
                    style={{ color: "#3b82f6" }}
                  >
                    {kpiData.lotoComplianceRate}%
                  </span>
                </div>
                <div className="cf-progress-container">
                  <div className="cf-progress-track">
                    <div
                      className="cf-progress-fill blue"
                      style={{ width: `${kpiData.lotoComplianceRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="cf-flex cf-justify-between cf-mt-1">
                  <span className="cf-text-xs cf-text-gray-500">Current</span>
                  <span className="cf-text-xs cf-text-gray-500">
                    Target: 98%
                  </span>
                </div>
              </div>

              <div>
                <div className="cf-flex cf-justify-between cf-mb-1">
                  <span className="cf-text-sm cf-font-medium cf-text-gray-700">
                    On-Time Completion
                  </span>
                  <span
                    className="cf-text-sm cf-font-bold"
                    style={{ color: "#10b981" }}
                  >
                    {kpiData.onTimeCompletionRate}%
                  </span>
                </div>
                <div className="cf-progress-container">
                  <div className="cf-progress-track">
                    <div
                      className="cf-progress-fill green"
                      style={{ width: `${kpiData.onTimeCompletionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="cf-flex cf-justify-between cf-mt-1">
                  <span className="cf-text-xs cf-text-gray-500">Current</span>
                  <span className="cf-text-xs cf-text-gray-500">
                    Target: 95%
                  </span>
                </div>
              </div>

              <div>
                <div className="cf-flex cf-justify-between cf-mb-1">
                  <span className="cf-text-sm cf-font-medium cf-text-gray-700">
                    Avg. Completion Time
                  </span>
                  <span
                    className="cf-text-sm cf-font-bold"
                    style={{ color: "#8b5cf6" }}
                  >
                    {kpiData.avgCompletionTime} hrs
                  </span>
                </div>
                <div className="cf-progress-container">
                  <div className="cf-progress-track">
                    <div
                      className="cf-progress-fill purple"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
                <div className="cf-flex cf-justify-between cf-mt-1">
                  <span className="cf-text-xs cf-text-gray-500">Current</span>
                  <span className="cf-text-xs cf-text-gray-500">
                    Target: Under 2.5 hrs
                  </span>
                </div>
              </div>

              <div className="cf-callout info">
                <div className="cf-callout-content">
                  <div className="cf-callout-icon">
                    <Icon name="lightbulb" />
                  </div>
                  <div className="cf-callout-text">
                    <h3>Improvement Opportunity</h3>
                    <p>
                      Focus on reducing average completion time by streamlining
                      handover processes. Current handover time is{" "}
                      {kpiData.avgHandoverTime} hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  );
};

export default KPISummary;
