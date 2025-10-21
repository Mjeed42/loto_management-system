import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
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
  const [technicianData, setTechnicianData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30"); // days
  const navigate = useNavigate();

  useEffect(() => {
    fetchKPIData();
    fetchTechnicianData();

    // Set up real-time refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchKPIData();
      fetchTechnicianData();
    }, 30000); // Refresh every 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [timeRange]);

  const fetchKPIData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Fetching KPI data for", timeRange, "days");
      const res = await axios.get(
        `/api/kpi/real-time?timeRange=${timeRange}`,
        config
      );

      console.log("KPI API response:", res.data);

      if (res.data.success) {
        setKpiData(res.data.kpiData || res.data.data);
      } else {
        throw new Error(res.data.message || "Failed to fetch KPI data");
      }

      setError("");
    } catch (err) {
      console.error("Error fetching KPI data:", err);
      setError(
        err.response?.data?.message || err.message || "Error fetching KPI data"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicianData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Fetching technician data for", timeRange, "days");
      const res = await axios.get(
        `/api/kpi/technician-performance?timeRange=${timeRange}`,
        config
      );

      console.log("Technician API response:", res.data);

      if (res.data.success) {
        setTechnicianData(res.data.performanceData || res.data.data || []);
      } else {
        throw new Error(res.data.message || "Failed to fetch technician data");
      }
    } catch (err) {
      console.error("Error fetching technician data:", err);
      // Don't set error here as it's secondary data
    }
  };

  const KPIWidget = ({
    title,
    value,
    unit,
    icon,
    color,
    trend,
    description,
  }) => (
    <div className="cf-card hover-lift">
      <div className="cf-card-body">
        <div className="cf-flex cf-justify-between cf-items-start cf-mb-3">
          <div
            className={`cf-rounded-circle cf-bg-${color} cf-bg-opacity-10 cf-p-3`}
          >
            <Icon
              name={icon}
              className={`cf-text-${color}`}
              style={{ fontSize: "1.5rem" }}
            />
          </div>
          {trend !== undefined && (
            <div
              className={`cf-badge ${
                trend >= 0 ? "cf-bg-success" : "cf-bg-danger"
              } cf-fs-6`}
            >
              {trend >= 0 ? "↗" : "↘"} {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h2 className="cf-mb-1">
          {value}
          {unit && <small className="cf-text-muted cf-ms-1">{unit}</small>}
        </h2>
        <h6 className="cf-text-muted cf-mb-2">{title}</h6>
        {description && (
          <p className="cf-text-muted cf-small cf-mb-0">{description}</p>
        )}
      </div>
    </div>
  );

  const CircularProgress = ({
    value,
    size = 120,
    strokeWidth = 8,
    color = "primary",
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div
        className="cf-position-relative"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="cf-position-absolute">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`var(--cf-${color})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="cf-position-absolute cf-top-50 cf-start-50 cf-translate-middle cf-text-center">
          <span className="cf-fw-bold" style={{ fontSize: "1.2rem" }}>
            {value}%
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="cf-d-flex cf-justify-content-center cf-align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="cf-text-center">
          <div
            className="cf-spinner-border cf-text-primary"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="cf-visually-hidden">Loading...</span>
          </div>
          <p className="cf-mt-3 cf-fw-semibold">Loading KPI Home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cf-container-fluid cf-py-4">
      {/* Header */}
      <div className="cf-d-flex cf-justify-content-between cf-align-items-center cf-mb-4">
        <div>
          <h1 className="cf-mb-1">
            <Icon name="chart" className="cf-me-2" /> KPI Home
          </h1>
          <p className="cf-text-muted cf-mb-0">
            Operational & Safety Performance Metrics
          </p>
        </div>
        <div className="cf-d-flex cf-gap-2">
          <select
            className="cf-form-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: "150px" }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <Button variant="outline-primary" onClick={fetchKPIData}>
            <Icon name="refresh" /> Refresh
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate("/Home")}>
            <Icon name="Home" /> Home
          </Button>
        </div>
      </div>

      {error && (
        <div className="cf-alert cf-alert-danger cf-mb-4">
          <Icon name="warning" className="cf-me-2" /> {error}
          <div className="cf-mt-2">
            <Button variant="outline-primary" onClick={fetchKPIData}>
              <Icon name="refresh" /> Retry
            </Button>
          </div>
        </div>
      )}

      {/* Key Metrics Row */}
      <div className="cf-grid cf-grid-gap-large cf-mb-4">
        <div className="cf-grid-cols-1 md:cf-grid-cols-2 lg:cf-grid-cols-4 cf-gap-4">
          <KPIWidget
            title="Total LOTOs"
            value={kpiData.totalLotos}
            icon="list"
            color="primary"
            trend={5}
            description="LOTO procedures created"
          />
          <KPIWidget
            title="Active LOTOs"
            value={kpiData.activeLotos}
            icon="activity"
            color="warning"
            trend={-2}
            description="Currently isolated equipment"
          />
          <KPIWidget
            title="Completed LOTOs"
            value={kpiData.completedLotos}
            icon="check"
            color="success"
            trend={8}
            description="Successfully finished procedures"
          />
          <KPIWidget
            title="Pending LOTOs"
            value={kpiData.pendingLotos}
            icon="info"
            color="info"
            trend={2}
            description="Awaiting verification"
          />
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="cf-grid cf-grid-gap-large cf-mb-4">
        <div className="cf-grid-cols-1 lg:cf-grid-cols-3 cf-gap-4">
          <div className="lg:cf-col-span-2 cf-card">
            <div className="cf-card-header">
              <div className="cf-d-flex cf-justify-content-between cf-align-items-center">
                <h5 className="cf-mb-0">
                  <Icon name="trending-up" className="cf-me-2" /> Performance
                  Overview
                </h5>
                <div className="cf-btn-group" role="group">
                  <button
                    type="button"
                    className="cf-btn cf-btn-sm cf-btn-outline-secondary"
                  >
                    Efficiency
                  </button>
                  <button
                    type="button"
                    className="cf-btn cf-btn-sm cf-btn-outline-secondary active"
                  >
                    Timeliness
                  </button>
                  <button
                    type="button"
                    className="cf-btn cf-btn-sm cf-btn-outline-secondary"
                  >
                    Compliance
                  </button>
                </div>
              </div>
            </div>
            <div className="cf-card-body">
              <div className="cf-grid cf-grid-gap-large">
                <div className="cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-4">
                  <div className="cf-text-center">
                    <h6 className="cf-text-muted cf-mb-3">
                      Avg. Completion Time
                    </h6>
                    <div className="cf-d-flex cf-align-items-center cf-justify-content-center">
                      <Icon
                        name="clock"
                        className="cf-text-secondary cf-me-2"
                        style={{ fontSize: "2rem" }}
                      />
                      <span
                        className="cf-fw-bold"
                        style={{ fontSize: "1.8rem" }}
                      >
                        {kpiData.avgCompletionTime} hrs
                      </span>
                    </div>
                    <div className="cf-mt-2">
                      <span className="cf-badge cf-bg-success">
                        ↓ 15% improvement
                      </span>
                    </div>
                  </div>
                  <div className="cf-text-center">
                    <h6 className="cf-text-muted cf-mb-3">
                      On-Time Completion
                    </h6>
                    <CircularProgress
                      value={kpiData.onTimeCompletionRate}
                      color="success"
                    />
                    <div className="cf-mt-2">
                      <span className="cf-text-muted cf-small">
                        Target: 95%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cf-card">
            <div className="cf-card-header">
              <h5 className="cf-mb-0">
                <Icon name="alert-triangle" className="cf-me-2" /> Safety
                Metrics
              </h5>
            </div>
            <div className="cf-card-body">
              <div className="cf-d-flex cf-align-items-center cf-mb-4">
                <div className="cf-rounded-circle cf-bg-danger cf-bg-opacity-10 cf-p-3 cf-me-3">
                  <Icon
                    name="alert-triangle"
                    className="cf-text-danger"
                    style={{ fontSize: "1.5rem" }}
                  />
                </div>
                <div>
                  <h2 className="cf-mb-0">{kpiData.safetyIncidents}</h2>
                  <p className="cf-text-muted cf-mb-0">Safety Incidents</p>
                </div>
              </div>

              <div className="cf-progress cf-mb-3" style={{ height: "10px" }}>
                <div
                  className="cf-progress-bar cf-bg-success"
                  role="progressbar"
                  style={{ width: `${kpiData.lotoComplianceRate}%` }}
                ></div>
              </div>
              <p className="cf-text-muted cf-small">
                {kpiData.lotoComplianceRate}% compliance rate maintained
              </p>

              <div className="cf-mt-4">
                <h6 className="cf-text-muted">Recent Achievements</h6>
                <ul className="cf-list-unstyled">
                  <li className="cf-mb-2">
                    <Icon name="check" className="cf-text-success cf-me-2" />
                    <span className="cf-small">
                      30-day incident-free streak
                    </span>
                  </li>
                  <li className="cf-mb-2">
                    <Icon name="check" className="cf-text-success cf-me-2" />
                    <span className="cf-small">
                      100% verification compliance
                    </span>
                  </li>
                  <li>
                    <Icon name="check" className="cf-text-success cf-me-2" />
                    <span className="cf-small">Zero handover disputes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technician Performance */}
      <div className="cf-grid cf-grid-gap-large cf-mb-4">
        <div className="cf-grid-cols-1 cf-gap-4">
          <div className="cf-card">
            <div className="cf-card-header cf-d-flex cf-justify-content-between cf-align-items-center">
              <h5 className="cf-mb-0">
                <Icon name="users" className="cf-me-2" /> Technician Performance
              </h5>
              <Button variant="outline-primary" size="sm">
                <Icon name="download" /> Export Report
              </Button>
            </div>
            <div className="cf-card-body cf-p-0">
              <div className="cf-table-container">
                <table className="cf-table cf-mb-0">
                  <thead>
                    <tr>
                      <th>Technician</th>
                      <th>Completed LOTOs</th>
                      <th>Active LOTOs</th>
                      <th>Handovers</th>
                      <th>Compliance Rate</th>
                      <th>Efficiency Score</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(technicianData) &&
                    technicianData.length > 0 ? (
                      technicianData.map((tech, index) => (
                        <tr key={index}>
                          <td>
                            <div className="cf-d-flex cf-align-items-center">
                              <div className="cf-rounded-circle cf-bg-primary cf-bg-opacity-10 cf-p-2 cf-me-3">
                                <Icon name="user" className="cf-text-primary" />
                              </div>
                              <div>
                                <div className="cf-fw-semibold">
                                  {tech.technician?.name || tech.name}
                                </div>
                                <div className="cf-text-muted cf-small">
                                  {tech.technician?.username || tech.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{tech.completedLotos || tech.completed}</td>
                          <td>{tech.activeLotos || tech.active}</td>
                          <td>{tech.handovers || 0}</td>
                          <td>
                            <div className="cf-d-flex cf-align-items-center">
                              <span className="cf-me-2">
                                {tech.compliance || 95}%
                              </span>
                              <div
                                className="cf-progress-container"
                                style={{ width: "100px" }}
                              >
                                <div
                                  className="cf-progress-fill cf-bg-success"
                                  style={{ width: `${tech.compliance || 95}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="cf-d-flex cf-align-items-center">
                              <span className="cf-me-2">
                                {tech.efficiency || 0}%
                              </span>
                              <div
                                className="cf-progress-container"
                                style={{ width: "100px" }}
                              >
                                <div
                                  className={`cf-progress-fill ${
                                    tech.efficiency > 90
                                      ? "cf-bg-success"
                                      : tech.efficiency > 75
                                      ? "cf-bg-warning"
                                      : "cf-bg-danger"
                                  }`}
                                  style={{ width: `${tech.efficiency || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`cf-badge ${
                                tech.efficiency > 90
                                  ? "cf-bg-success"
                                  : tech.efficiency > 75
                                  ? "cf-bg-warning"
                                  : "cf-bg-danger"
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
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="cf-text-center cf-text-muted cf-py-4"
                        >
                          No technician data available for the selected period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Handover Metrics */}
      <div className="cf-grid cf-grid-gap-large cf-mb-4">
        <div className="cf-grid-cols-1 lg:cf-grid-cols-2 cf-gap-4">
          <div className="cf-card">
            <div className="cf-card-header">
              <h5 className="cf-mb-0">
                <Icon name="handshake" className="cf-me-2" /> Handover Metrics
              </h5>
            </div>
            <div className="cf-card-body">
              <div className="cf-d-flex cf-justify-content-around cf-align-items-center cf-mb-4">
                <div className="cf-text-center">
                  <h2 className="cf-mb-0">{kpiData.handoverCount}</h2>
                  <p className="cf-text-muted cf-mb-0">Total Handovers</p>
                </div>
                <div className="cf-text-center">
                  <h2 className="cf-mb-0">{kpiData.avgHandoverTime} hrs</h2>
                  <p className="cf-text-muted cf-mb-0">Avg. Handover Time</p>
                </div>
              </div>
              <div className="cf-callout cf-callout-info">
                <div className="cf-callout-content">
                  <div className="cf-callout-icon">
                    <Icon name="info" />
                  </div>
                  <div className="cf-callout-text">
                    <h3>Handover Efficiency</h3>
                    <p>
                      Streamlining handover processes can significantly reduce
                      downtime and improve operational continuity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cf-card">
            <div className="cf-card-header">
              <h5 className="cf-mb-0">
                <Icon name="activity" className="cf-me-2" /> Real-time Activity
                Feed
              </h5>
            </div>
            <div className="cf-card-body">
              <ul className="cf-list-unstyled cf-activity-feed">
                {/* Example Activities - Replace with real data */}
                <li className="cf-activity-item">
                  <div className="cf-activity-icon cf-bg-success">
                    <Icon name="check" />
                  </div>
                  <div className="cf-activity-content">
                    <p className="cf-activity-text">
                      <strong>John Smith</strong> completed LOTO #1234 on Pump
                      A-101.
                    </p>
                    <span className="cf-activity-time">2 minutes ago</span>
                  </div>
                </li>
                <li className="cf-activity-item">
                  <div className="cf-activity-icon cf-bg-warning">
                    <Icon name="alert-triangle" />
                  </div>
                  <div className="cf-activity-content">
                    <p className="cf-activity-text">
                      <strong>Jane Doe</strong> initiated LOTO #5678 on Valve
                      B-205 with a critical warning.
                    </p>
                    <span className="cf-activity-time">15 minutes ago</span>
                  </div>
                </li>
                <li className="cf-activity-item">
                  <div className="cf-activity-icon cf-bg-primary">
                    <Icon name="refresh-cw" />
                  </div>
                  <div className="cf-activity-content">
                    <p className="cf-activity-text">
                      <strong>Mike Johnson</strong> requested handover for LOTO
                      #9101 on Motor C-303.
                    </p>
                    <span className="cf-activity-time">1 hour ago</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      </div>
      
    </div>
  );
};

export default KPISummary;
