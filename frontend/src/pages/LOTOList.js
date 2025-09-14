import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const LOTOList = () => {
  const [lotos, setLotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTOs();
    fetchCurrentUser();
  }, []);

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
      console.log("Error fetching current user");
    }
  };

  const fetchLOTOs = async () => {
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

      // Handle different possible response structures
      let lotosData = [];
      if (res.data && res.data.data) {
        lotosData = Array.isArray(res.data.data) ? res.data.data : [];
      } else if (Array.isArray(res.data)) {
        lotosData = res.data;
      } else {
        lotosData = [];
      }

      // Validate each LOTO object
      const validatedLotos = lotosData
        .filter((loto) => loto && typeof loto === "object" && loto._id)
        .map((loto) => ({
          _id: loto._id,
          serialNumber: loto.serialNumber || "N/A",
          date: loto.date || new Date(),
          shift: loto.shift || "N/A",
          line: loto.line || "N/A",
          isolator: loto.isolator || null,
          isolatedPart: loto.isolatedPart || "N/A",
          reason: loto.reason || "N/A",
          status: loto.status || "pending",
          expectedDuration: loto.expectedDuration || 0,
        }));

      setLotos(validatedLotos);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching LOTOs:", err);
      setError(err.response?.data?.message || "Error fetching LOTOs");
      setLotos([]);
      setLoading(false);
    }
  };

  const handleVerify = async (lotoId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${lotoId}/verify`,
        {},
        config
      );

      // Update the specific LOTO in state
      setLotos(
        lotos.map((loto) =>
          loto._id === lotoId ? { ...loto, ...res.data.data } : loto
        )
      );

      if (window.LOTOUtils) {
        window.LOTOUtils.showNotification(
          "LOTO verified successfully! ✅",
          "success"
        );
      }
    } catch (err) {
      if (window.LOTOUtils) {
        window.LOTOUtils.showNotification(
          err.response?.data?.message || "Error verifying LOTO",
          "error"
        );
      }
    }
  };

  const handleUpdate = async (lotoId) => {
    navigate(`/loto/${lotoId}/update`);
  };

  const handleHandover = async (lotoId) => {
    navigate(`/loto/${lotoId}/handover`);
  };

  const handleComplete = async (lotoId) => {
    navigate(`/loto/${lotoId}/complete`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        text: "Pending",
        variant: "warning",
        icon: "⏳",
        color: "#f59e0b",
      },
      active: {
        text: "Active",
        variant: "success",
        icon: "⚡",
        color: "#22c55e",
      },
      completed: {
        text: "Completed",
        variant: "secondary",
        icon: "✅",
        color: "#6b7280",
      },
      pending_handover: {
        text: "Pending Handover",
        variant: "info",
        icon: "🔄",
        color: "#0ea5e9",
      },
      handover: {
        text: "Handover",
        variant: "info",
        icon: "🔄",
        color: "#0ea5e9",
      },
    };
    const config = statusConfig[status] || {
      text: status || "Unknown",
      variant: "secondary",
      icon: "❓",
      color: "#6b7280",
    };
    return (
      <span
        className={`status-pill ${status} d-inline-flex align-items-center`}
        style={{
          background: `${config.color}15`,
          color: config.color,
          padding: "0.5rem 1rem",
          borderRadius: "2rem",
          fontSize: "0.75rem",
          fontWeight: "600",
          border: `2px solid ${config.color}30`,
        }}
      >
        <span className="me-2">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  // Filter LOTOs based on search and status
  const filteredLotos = lotos.filter((loto) => {
    if (!loto) return false;

    const matchesSearch =
      (loto.serialNumber ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (loto.isolatedPart ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (loto.reason ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loto.isolator?.firstName
        ? `${loto.isolator.firstName} ${loto.isolator.lastName}`
        : ""
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || loto.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-3">
          <h4 className="text-muted">Loading LOTOs...</h4>
          <p className="text-muted">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  const canVerify =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "supervisor");
  const isTechnician = currentUser && currentUser.role === "technician";
  const isSupervisor = currentUser && currentUser.role === "supervisor";

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-glass border-0 shadow-lg">
            <div className="card-body py-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h1
                    className="fw-bold mb-2 d-flex align-items-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <span className="me-3" style={{ fontSize: "2rem" }}>
                      📋
                    </span>
                    LOTO Management
                  </h1>
                  <p className="lead text-muted mb-0">
                    Manage all your lockout/tagout procedures in one place
                  </p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    variant="outline-secondary"
                    onClick={fetchLOTOs}
                    className="hover-scale"
                  >
                    <span className="me-2">🔄</span> Refresh
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/create-loto")}
                    className="hover-scale"
                  >
                    <span className="me-2">➕</span> Create LOTO
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate("/dashboard")}
                    className="hover-scale"
                  >
                    <span className="me-2">🏠</span> Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="search-container">
            <div className="position-relative">
              <input
                type="text"
                className="search-input form-control"
                placeholder="Search LOTOs by serial number, equipment, reason, or isolator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: "3rem",
                  borderRadius: "2rem",
                  border: "2px solid #e2e8f0",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="search-input form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              borderRadius: "1rem",
              border: "2px solid #e2e8f0",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending_handover">Pending Handover</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card">
            <div className="d-flex align-items-center">
              <div
                className="stats-icon-wrapper me-3"
                style={{ background: "var(--gradient-primary)" }}
              >
                📊
              </div>
              <div>
                <div className="stats-number">{lotos.length}</div>
                <div className="stats-label">Total LOTOs</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card">
            <div className="d-flex align-items-center">
              <div
                className="stats-icon-wrapper me-3"
                style={{ background: "var(--gradient-success)" }}
              >
                ⚡
              </div>
              <div>
                <div className="stats-number">
                  {lotos.filter((l) => l.status === "active").length}
                </div>
                <div className="stats-label">Active</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card">
            <div className="d-flex align-items-center">
              <div
                className="stats-icon-wrapper me-3"
                style={{ background: "var(--gradient-warning)" }}
              >
                ⏳
              </div>
              <div>
                <div className="stats-number">
                  {lotos.filter((l) => l.status === "pending").length}
                </div>
                <div className="stats-label">Pending</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="stats-card">
            <div className="d-flex align-items-center">
              <div
                className="stats-icon-wrapper me-3"
                style={{ background: "var(--gradient-info)" }}
              >
                ✅
              </div>
              <div>
                <div className="stats-number">
                  {lotos.filter((l) => l.status === "completed").length}
                </div>
                <div className="stats-label">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <span className="me-3" style={{ fontSize: "1.5rem" }}>
            ⚠️
          </span>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* LOTO Table */}
      {filteredLotos.length === 0 && !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {searchTerm || filterStatus !== "all" ? "🔍" : "📋"}
          </div>
          <h3 className="empty-state-title">
            {searchTerm || filterStatus !== "all"
              ? "No LOTOs Found"
              : "No LOTOs Created Yet"}
          </h3>
          <p className="empty-state-text">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Get started by creating your first LOTO."}
          </p>
          {!(searchTerm || filterStatus !== "all") && (
            <Button
              variant="primary"
              onClick={() => navigate("/create-loto")}
              className="hover-scale"
            >
              <span className="me-2">➕</span> Create LOTO
            </Button>
          )}
        </div>
      ) : (
        <div>
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Serial Number</th>
                <th scope="col">Isolated Part</th>
                <th scope="col">Reason</th>
                <th scope="col">Isolator</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLotos.map((loto, index) => (
                <tr
                  key={loto._id}
                  className="loto-row"
                  onClick={() => navigate(`/loto/${loto._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <th scope="row">{index + 1}</th>
                  <td>{loto.serialNumber || "N/A"}</td>
                  <td>{loto.isolatedPart || "N/A"}</td>
                  <td>{loto.reason || "N/A"}</td>
                  <td>
                    {loto.isolator
                      ? `${loto.isolator.firstName || ""} ${
                          loto.isolator.lastName || ""
                        }`
                      : "N/A"}
                  </td>
                  <td>{getStatusBadge(loto.status)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {canVerify && loto.status === "pending" && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVerify(loto._id);
                          }}
                          className="hover-scale"
                        >
                          <span className="me-1">✔️</span> Verify
                        </Button>
                      )}
                      {isTechnician && loto.status === "active" && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHandover(loto._id);
                          }}
                          className="hover-scale"
                        >
                          <span className="me-1">🔄</span> Handover
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LOTOList;
