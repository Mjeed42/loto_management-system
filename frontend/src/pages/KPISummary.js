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
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30"); // days
  const navigate = useNavigate();

  useEffect(() => {
    fetchKPIData();
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
      console.error("Error fetching KPI data:", err);
      setLoading(false);
    }
  };

  const KPIWidget = ({ title, value, unit, icon, color, trend }) => (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h2 className="mb-0">
              {value}
              {unit && <small className="text-muted ms-1">{unit}</small>}
            </h2>
          </div>
          <div className={`rounded-circle bg-${color} bg-opacity-10 p-3`}>
            <Icon name={icon} className={`text-${color}`} />
          </div>
        </div>
        {trend && (
          <div className="mt-2">
            <span className={`badge ${trend > 0 ? "bg-success" : "bg-danger"}`}>
              {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
            </span>
            <small className="text-muted ms-2">vs last period</small>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading KPI data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <Icon name="chart" /> KPI Dashboard
        </h1>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: "120px" }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <Button variant="outline-secondary" onClick={fetchKPIData}>
            <Icon name="refresh" /> Refresh
          </Button>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <KPIWidget
            title="Total LOTOs"
            value={kpiData.totalLotos}
            icon="list"
            color="primary"
            trend={5}
          />
        </div>
        <div className="col-md-3">
          <KPIWidget
            title="Active LOTOs"
            value={kpiData.activeLotos}
            icon="active"
            color="warning"
            trend={-2}
          />
        </div>
        <div className="col-md-3">
          <KPIWidget
            title="Completed LOTOs"
            value={kpiData.completedLotos}
            icon="check"
            color="success"
            trend={8}
          />
        </div>
        <div className="col-md-3">
          <KPIWidget
            title="LOTO Compliance"
            value={kpiData.lotoComplianceRate}
            unit="%"
            icon="shield"
            color="info"
            trend={2}
          />
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <KPIWidget
            title="Avg Completion Time"
            value={kpiData.avgCompletionTime}
            unit="hrs"
            icon="clock"
            color="secondary"
            trend={-15}
          />
        </div>
        <div className="col-md-3">
          <KPIWidget
            title="On-Time Rate"
            value={kpiData.onTimeCompletionRate}
            unit="%"
            icon="calendar"
            color="success"
            trend={3}
          />
        </div>
        <div className="col-md-3">
          <KPIWidget
            title="Handovers"
            value={kpiData.handoverCount}
            icon="handover"
            color="info"
            trend={12}
          />
        </div>
        <div className="col-md-3">
          <KPIWidget
            title="Safety Incidents"
            value={kpiData.safetyIncidents}
            icon="warning"
            color="danger"
            trend={-50}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <Icon name="trending-up" /> LOTO Activity Trend
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <Icon
                  name="chart-bar"
                  className="text-muted"
                  style={{ fontSize: "3rem" }}
                />
                <p className="mt-2 text-muted">
                  Chart visualization would go here
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <Icon name="users" /> Technician Performance
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <Icon
                  name="user"
                  className="text-muted"
                  style={{ fontSize: "3rem" }}
                />
                <p className="mt-2 text-muted">
                  Performance metrics by technician
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">
            <Icon name="file" /> Detailed Reports
          </h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2">
            <Button variant="outline-primary">
              <Icon name="download" /> LOTO Completion Report
            </Button>
            <Button variant="outline-success">
              <Icon name="download" /> Compliance Report
            </Button>
            <Button variant="outline-warning">
              <Icon name="download" /> Incident Report
            </Button>
            <Button variant="outline-info">
              <Icon name="download" /> Handover Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPISummary;
