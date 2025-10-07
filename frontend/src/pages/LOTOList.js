import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import RejectLOTOModal from "../components/RejectLOTOModal";
import StatusChangeModal from "../components/StatusChangeModal";
import HandoverModal from "../components/HandoverModal";
import { useLoading } from "../contexts/LoadingContext";
import Icon from "../components/Icon";

// Helper: Format energy type for display (e.g., "electrical" → "Electrical")
const formatEnergyType = (type) => {
  if (!type) return "Unknown";
  return type
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const LOTOList = () => {
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const [lotos, setLotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSupervisor, setFilterSupervisor] = useState("all"); // New supervisor filter
  const [activeFilter, setActiveFilter] = useState(null); // Track which stat card is active
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLotoForRejection, setSelectedLotoForRejection] = useState(null);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [selectedLotoForStatusChange, setSelectedLotoForStatusChange] = useState(null);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [selectedLotoForHandover, setSelectedLotoForHandover] = useState(null);

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

      let lotosData = [];
      if (res.data && res.data.data) {
        lotosData = Array.isArray(res.data.data) ? res.data.data : [];
      } else if (Array.isArray(res.data)) {
        lotosData = res.data;
      } else {
        lotosData = [];
      }

      const validatedLotos = lotosData
        .filter((loto) => loto && typeof loto === "object" && loto._id)
        .map((loto) => ({
          _id: loto._id,
          serialNumber: loto.serialNumber || "N/A",
          date: loto.date || new Date(),
          shift: loto.shift || "N/A",
          line: loto.line || "N/A",
          isolator: loto.isolator || null,
          supervisor: loto.supervisor || null,
          supervisorName: loto.supervisorName || null,
          currentResponsible: loto.currentResponsible || null,
          currentResponsibleName: loto.currentResponsibleName || null,
          createdBy: loto.createdBy || null,
          createdByName: loto.createdByName || null,
          status: loto.status || "pending",
          expectedDuration: loto.expectedDuration || 0,
          energyTypes: Array.isArray(loto.energyTypes) ? loto.energyTypes : [],
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

  const handleDelete = async (lotoId, serialNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to delete LOTO ${serialNumber}? This action cannot be undone.`
      )
    )
      return;

    showLoading("Deleting LOTO...");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const API_BASE_URL =
        process.env.REACT_APP_API_URL ||
        "https://loto-backend-643788243736.europe-west1.run.app/api";

      const response = await axios.delete(
        `${API_BASE_URL}/loto/${lotoId}`,
        config
      );

      if (response.data.success) {
        alert("LOTO deleted successfully!");
        fetchLOTOs();
      } else {
        alert(response.data.message || "Error deleting LOTO");
      }
    } catch (err) {
      console.error("Delete LOTO error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error deleting LOTO";
      alert(`Delete failed: ${errorMessage}`);
    } finally {
      hideLoading();
    }
  };

  // Handle stat card clicks for filtering
  const handleStatCardClick = (filterType) => {
    if (activeFilter === filterType) {
      // If clicking the same card, clear the filter
      setActiveFilter(null);
      setFilterStatus("all");
    } else {
      // Set the new filter
      setActiveFilter(filterType);
      setFilterStatus(filterType);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilter(null);
    setFilterStatus("all");
    setFilterSupervisor("all");
    setSearchTerm("");
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

      // Refresh the LOTO list to ensure UI is updated
      fetchLOTOs();

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

  const handleReject = (loto) => {
    setSelectedLotoForRejection(loto);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (rejectionData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${selectedLotoForRejection._id}/reject`,
        rejectionData,
        config
      );

      if (window.LOTOUtils) {
        window.LOTOUtils.showNotification(
          "LOTO rejected successfully! ❌",
          "success"
        );
      }
      fetchLOTOs();
      setRejectModalOpen(false);
      setSelectedLotoForRejection(null);
    } catch (err) {
      if (window.LOTOUtils) {
        window.LOTOUtils.showNotification(
          err.response?.data?.message || "Error rejecting LOTO",
          "error"
        );
      }
    }
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
    setSelectedLotoForRejection(null);
  };

  const handleUpdate = (lotoId) => {
    navigate(`/loto/${lotoId}/update`);
  };

  const handleComplete = (lotoId) => {
    navigate(`/loto/${lotoId}/complete`);
  };

  const handleStatusChange = (loto) => {
    setSelectedLotoForStatusChange(loto);
    setStatusChangeModalOpen(true);
  };

  const handleStatusChangeConfirm = async (statusData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${selectedLotoForStatusChange._id}/status`,
        statusData,
        config
      );

      if (res.data.success) {
        alert(`LOTO status changed successfully: ${res.data.message}`);
        setStatusChangeModalOpen(false);
        setSelectedLotoForStatusChange(null);
        // Refresh the LOTOs list
        fetchLOTOs();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error changing LOTO status");
    }
  };

  const handleStatusChangeModalClose = () => {
    setStatusChangeModalOpen(false);
    setSelectedLotoForStatusChange(null);
  };

  const handleHandover = (loto) => {
    setSelectedLotoForHandover(loto);
    setHandoverModalOpen(true);
  };

  const handleHandoverConfirm = async (handoverData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${selectedLotoForHandover._id}/handover`,
        handoverData,
        config
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchLOTOs(); // Refresh the list
        setHandoverModalOpen(false);
        setSelectedLotoForHandover(null);
      }
    } catch (err) {
      console.error("Error creating handover:", err);
      alert(err.response?.data?.message || "Error creating handover");
    }
  };

  const handleHandoverModalClose = () => {
    setHandoverModalOpen(false);
    setSelectedLotoForHandover(null);
  };

  const handleApproveHandover = async (lotoId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Get the latest handover index (last one in the array)
      const loto = lotos.find(l => l._id === lotoId);
      if (!loto || !loto.handoverHistory || loto.handoverHistory.length === 0) {
        throw new Error("No handover found to approve");
      }
      
      const handoverIndex = loto.handoverHistory.length - 1;
      const verificationNotes = prompt("Enter verification notes (optional):");

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${lotoId}/handover/${handoverIndex}/verify`,
        {
          action: "approve",
          verificationNotes: verificationNotes || "",
        },
        config
      );

      if (res.data.success) {
        fetchLOTOs(); // Refresh the list
        if (window.LOTOUtils) {
          window.LOTOUtils.showNotification(
            "Handover approved successfully! ✅",
            "success"
          );
        }
      }
    } catch (err) {
      console.error("Error approving handover:", err);
      if (window.LOTOUtils) {
        window.LOTOUtils.showNotification(
          err.response?.data?.message || "Error approving handover",
          "error"
        );
      }
    }
  };

  const handleRejectHandover = async (lotoId) => {
    try {
      const rejectionReason = prompt("Enter rejection reason:");
      if (!rejectionReason) {
        return; // User cancelled
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Get the latest handover index (last one in the array)
      const loto = lotos.find(l => l._id === lotoId);
      if (!loto || !loto.handoverHistory || loto.handoverHistory.length === 0) {
        throw new Error("No handover found to reject");
      }
      
      const handoverIndex = loto.handoverHistory.length - 1;
      const verificationNotes = prompt("Enter verification notes (optional):");

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${lotoId}/handover/${handoverIndex}/verify`,
        {
          action: "reject",
          rejectionReason: rejectionReason,
          verificationNotes: verificationNotes || "",
        },
        config
      );

      if (res.data.success) {
        fetchLOTOs(); // Refresh the list
        if (window.LOTOUtils) {
          window.LOTOUtils.showNotification(
            "Handover rejected successfully! ❌",
            "success"
          );
        }
      }
    } catch (err) {
      console.error("Error rejecting handover:", err);
      if (window.LOTOUtils) {
        window.LOTOUtils.showNotification(
          err.response?.data?.message || "Error rejecting handover",
          "error"
        );
      }
    }
  };

  const handleRecipientDecision = async (lotoId, handoverIndex, action) => {
    try {
      const decisionNotes = prompt(`Enter notes for ${action}ing the handover:`);
      
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${lotoId}/handover/${handoverIndex}/recipient-decision`,
        {
          action,
          decisionNotes,
        },
        config
      );

      if (res.data.success) {
        fetchLOTOs(); // Refresh the list
        if (window.LOTOUtils) {
          window.LOTOUtils.showNotification(
            `Handover ${action}ed successfully! ${action === 'accept' ? '✅' : '❌'}`,
            "success"
          );
        }
      }
    } catch (err) {
      console.error("Error making recipient decision:", err);
      if (window.LOTOUtils) {
        window.LOTOUtils.showNotification(
          err.response?.data?.message || "Error making decision",
          "error"
        );
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_verification_new: {
        text: "Pending Verification (New)",
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
      pending_handover_verification: {
        text: "Pending Handover Verification",
        variant: "info",
        icon: "🔄",
        color: "#0ea5e9",
      },
      handed_over: {
        text: "Handed Over",
        variant: "primary",
        icon: "📋",
        color: "#3b82f6",
      },
      completed: {
        text: "Completed",
        variant: "secondary",
        icon: "✅",
        color: "#6b7280",
      },
      rejected: {
        text: "Rejected",
        variant: "danger",
        icon: "❌",
        color: "#ef4444",
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

  const filteredLotos = lotos.filter((loto) => {
    if (!loto) return false;

    const matchesSearch =
      (loto.serialNumber ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (loto.supervisorName ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (loto.currentResponsibleName ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (loto.isolator?.firstName
        ? `${loto.isolator.firstName} ${loto.isolator.lastName}`
        : ""
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || loto.status === filterStatus;

    // Supervisor filtering logic - Check if user's name appears in relevant fields
    const matchesSupervisor = (() => {
      if (filterSupervisor === "all") return true;
      if (!currentUser || currentUser.role !== "supervisor") return true;
      
      // Get current user's full name for comparison
      const currentUserName = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim().toLowerCase();
      
      if (filterSupervisor === "my_created") {
        // Show LOTOs where user is the Isolator (creator)
        return loto.isolator && 
          `${loto.isolator.firstName || ""} ${loto.isolator.lastName || ""}`.trim().toLowerCase().includes(currentUserName);
      }
      
      if (filterSupervisor === "my_authorized") {
        // Show LOTOs where user is the Authorized Supervisor
        return loto.supervisorName && 
          loto.supervisorName.toLowerCase().includes(currentUserName);
      }
      
      return true;
    })();

    return matchesSearch && matchesStatus && matchesSupervisor;
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

  // Function to check if current user can verify a specific LOTO
  const canVerifyLOTO = (loto) => {
    if (!currentUser) return false;
    
    // Admins can verify any LOTO
    if (currentUser.role === "admin") return true;
    
    // Supervisors can only verify LOTOs they are assigned to
    if (currentUser.role === "supervisor") {
      const currentUserName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
      
      // Check by supervisor ID if available
      if (loto.supervisor && loto.supervisor._id === currentUser.id) {
        return true;
      }
      
      // Check by supervisor name if ID check fails
      if (loto.supervisorName && loto.supervisorName.toLowerCase().includes(currentUserName.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  };

  const isAdmin = currentUser && currentUser.role === "admin";
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
                    onClick={() => navigate("/Home")}
                    className="hover-scale"
                  >
                    <span className="me-2">🏠</span> Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Statistics Dashboard */}
      <div className="modern-stats-grid mb-5">
        <div 
          className={`stat-card total-card ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => handleStatCardClick("all")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">
            <div className="icon-wrapper">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="none">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-number">{lotos.length}</div>
            <div className="stat-label">Total LOTOs</div>
            <div className="stat-description">All lockout procedures</div>
          </div>
          <div className="stat-trend">
            <span className="trend-indicator">📈</span>
          </div>
        </div>

        <div 
          className={`stat-card active-card ${activeFilter === "active" ? "active" : ""}`}
          onClick={() => handleStatCardClick("active")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">
            <div className="icon-wrapper">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {lotos.filter((l) => l.status === "active").length}
            </div>
            <div className="stat-label">Active</div>
            <div className="stat-description">Currently in progress</div>
          </div>
          <div className="stat-trend">
            <span className="trend-indicator">⚡</span>
          </div>
        </div>

        <div 
          className={`stat-card pending-verification-card ${activeFilter === "pending_verification_new" ? "active" : ""}`}
          onClick={() => handleStatCardClick("pending_verification_new")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">
            <div className="icon-wrapper">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {lotos.filter((l) => l.status === "pending_verification_new").length}
            </div>
            <div className="stat-label">Pending Verification</div>
            <div className="stat-description">New LOTOs awaiting approval</div>
          </div>
          <div className="stat-trend">
            <span className="trend-indicator">⏳</span>
          </div>
        </div>

        <div 
          className={`stat-card pending-handover-card ${activeFilter === "pending_handover_verification" ? "active" : ""}`}
          onClick={() => handleStatCardClick("pending_handover_verification")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">
            <div className="icon-wrapper">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="none">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {lotos.filter((l) => l.status === "pending_handover_verification").length}
            </div>
            <div className="stat-label">Pending Handover</div>
            <div className="stat-description">Awaiting handover verification</div>
          </div>
          <div className="stat-trend">
            <span className="trend-indicator">🔄</span>
          </div>
        </div>

        <div 
          className={`stat-card handed-over-card ${activeFilter === "handed_over" ? "active" : ""}`}
          onClick={() => handleStatCardClick("handed_over")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">
            <div className="icon-wrapper">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="none">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {lotos.filter((l) => l.status === "handed_over").length}
            </div>
            <div className="stat-label">Handed Over</div>
            <div className="stat-description">Successfully transferred</div>
          </div>
          <div className="stat-trend">
            <span className="trend-indicator">📋</span>
          </div>
        </div>

        <div 
          className={`stat-card rejected-card ${activeFilter === "rejected" ? "active" : ""}`}
          onClick={() => handleStatCardClick("rejected")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">
            <div className="icon-wrapper">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {lotos.filter((l) => l.status === "rejected").length}
            </div>
            <div className="stat-label">Rejected</div>
            <div className="stat-description">Requires modification</div>
          </div>
          <div className="stat-trend">
            <span className="trend-indicator">❌</span>
          </div>
        </div>

        <div 
          className={`stat-card completed-card ${activeFilter === "completed" ? "active" : ""}`}
          onClick={() => handleStatCardClick("completed")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-icon">
            <div className="icon-wrapper">
              <svg className="stat-svg" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {lotos.filter((l) => l.status === "completed").length}
            </div>
            <div className="stat-label">Completed</div>
            <div className="stat-description">Successfully finished</div>
          </div>
          <div className="stat-trend">
            <span className="trend-indicator">✅</span>
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

      {/* Search and Filter Section */}
      <div className="search-filter-section mb-4">
        <div className="row g-3">
          {/* Search Input */}
          <div className="col-lg-6 col-md-12">
            <div className="search-container">
              <div className="position-relative">
                <div className="search-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  className="form-control search-input-enhanced"
                  placeholder="Search LOTOs by serial number, supervisor, responsible, or isolator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="clear-search-btn"
                    onClick={() => setSearchTerm("")}
                    title="Clear search"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-lg-3 col-md-6">
            <div className="filter-container">
              <label className="filter-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
                </svg>
                Status Filter
              </label>
              <select
                className="form-select filter-select-enhanced"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending_verification_new">Pending Verification</option>
                <option value="active">Active</option>
                <option value="pending_handover_verification">Pending Handover</option>
                <option value="handed_over">Handed Over</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Supervisor Filter */}
          {currentUser && currentUser.role === "supervisor" && (
            <div className="col-lg-3 col-md-6">
              <div className="filter-container">
                <label className="filter-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  My LOTOs
                </label>
                <select
                  className="form-select filter-select-enhanced"
                  value={filterSupervisor}
                  onChange={(e) => setFilterSupervisor(e.target.value)}
                >
                  <option value="all">All LOTOs</option>
                  <option value="my_created">Created By Me</option>
                  <option value="my_authorized">Authorized By Me</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Indicator and Clear Button */}
      {(activeFilter || searchTerm || filterSupervisor !== "all") && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted">Active filters:</span>
                {activeFilter && (
                  <span className="badge bg-primary">
                    {activeFilter === "all" ? "All LOTOs" : 
                     activeFilter === "active" ? "Active" :
                     activeFilter === "pending_verification_new" ? "Pending Verification" :
                     activeFilter === "pending_handover_verification" ? "Pending Handover" :
                     activeFilter === "handed_over" ? "Handed Over" :
                     activeFilter === "rejected" ? "Rejected" :
                     activeFilter === "completed" ? "Completed" : activeFilter}
                  </span>
                )}
                {searchTerm && (
                  <span className="badge bg-info">
                    Search: "{searchTerm}"
                  </span>
                )}
                {filterSupervisor !== "all" && currentUser && currentUser.role === "supervisor" && (
                  <span className="badge bg-warning">
                    {filterSupervisor === "my_created" ? "Created By Me" :
                     filterSupervisor === "my_authorized" ? "Authorized By Me" : filterSupervisor}
                  </span>
                )}
              </div>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={clearFilters}
              >
                <i className="fas fa-times me-1"></i>
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOTO Table */}
      {filteredLotos.length === 0 && !loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {searchTerm || filterStatus !== "all" || filterSupervisor !== "all" ? "🔍" : "📋"}
          </div>
          <h3 className="empty-state-title">
            {searchTerm || filterStatus !== "all" || filterSupervisor !== "all"
              ? "No LOTOs Found"
              : "No LOTOs Created Yet"}
          </h3>
          <p className="empty-state-text">
            {searchTerm || filterStatus !== "all" || filterSupervisor !== "all"
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Get started by creating your first LOTO."}
          </p>
          {!(searchTerm || filterStatus !== "all" || filterSupervisor !== "all") && (
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
        <div className="table-responsive d-none d-md-block">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Serial Number</th>
                <th scope="col">Authorized Supervisor</th>
                <th scope="col">Current Responsible</th>
                <th scope="col">Isolator</th>
                <th scope="col">Energy Types</th>
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
                  <td>
                    {loto.supervisorName || "N/A"}
                  </td>
                  <td>
                    {loto.currentResponsibleName || 
                     (loto.isolator
                       ? `${loto.isolator.firstName || ""} ${
                           loto.isolator.lastName || ""
                         }`
                       : "N/A")}
                  </td>
                  <td>
                    {loto.isolator
                      ? `${loto.isolator.firstName || ""} ${
                          loto.isolator.lastName || ""
                        }`
                      : "N/A"}
                  </td>
                  <td>
                    {loto.energyTypes && loto.energyTypes.length > 0
                      ? loto.energyTypes
                          .map((et) => formatEnergyType(et.type))
                          .join(", ")
                      : "N/A"}
                  </td>
                  <td>{getStatusBadge(loto.status)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      {/* Admin Full Control */}
                      {isAdmin && (
                        <>
                          {loto.status === "pending_verification_new" && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVerify(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ✅ Verify
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(loto);
                                }}
                                className="hover-scale"
                              >
                                ❌ Reject
                              </Button>
                            </>
                          )}
                          {loto.status === "rejected" && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdate(loto._id);
                              }}
                              className="hover-scale"
                            >
                              ✏️ Edit
                            </Button>
                          )}
                          {loto.status === "active" && (
                            <>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHandover(loto);
                                }}
                                className="hover-scale"
                              >
                                🤝 Handover
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleComplete(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ✅ Complete
                              </Button>
                            </>
                          )}
                          {loto.status === "pending_handover_verification" && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveHandover(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ✅ Approve Handover
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectHandover(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ❌ Reject Handover
                              </Button>
                            </>
                          )}
                          
                          {/* Status Change Button - Always Available for Admins */}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(loto);
                            }}
                            className="hover-scale"
                          >
                            ⭐ Change Status
                          </Button>
                        </>
                      )}
                      {/* Supervisor Actions */}
                      {canVerifyLOTO(loto) && currentUser?.role !== "admin" && (
                        <>
                          {loto.status === "pending_verification_new" && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVerify(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ✅ Verify
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReject(loto);
                                }}
                                className="hover-scale"
                              >
                                ❌ Reject
                              </Button>
                            </>
                          )}
                          {loto.status === "rejected" && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdate(loto._id);
                              }}
                              className="hover-scale"
                            >
                              ✏️ Edit
                            </Button>
                          )}
                          {loto.status === "active" && (
                            <>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHandover(loto);
                                }}
                                className="hover-scale"
                              >
                                🤝 Handover
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleComplete(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ✅ Complete
                              </Button>
                            </>
                          )}
                          {loto.status === "pending_handover_verification" && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveHandover(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ✅ Approve Handover
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectHandover(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ❌ Reject Handover
                              </Button>
                            </>
                          )}
                        </>
                      )}
                      {/* Regular User Actions */}
                      {!isAdmin && !isSupervisor && (
                        <>
                          {isTechnician && loto.status === "rejected" && loto.isolator?._id === currentUser?.id && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdate(loto._id);
                              }}
                              className="hover-scale"
                            >
                              ✏️ Edit
                            </Button>
                          )}
                          {isTechnician && loto.status === "active" && loto.isolator?._id === currentUser?.id && (
                            <>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHandover(loto);
                                }}
                                className="hover-scale"
                              >
                                🤝 Handover
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleComplete(loto._id);
                                }}
                                className="hover-scale"
                              >
                                ✅ Complete
                              </Button>
                            </>
                          )}
                          
                          {/* Technician Complete for Handover Recipients */}
                          {isTechnician && loto.status === "active" && 
                           loto.handoverHistory && loto.handoverHistory.length > 0 && 
                           loto.handoverHistory[loto.handoverHistory.length - 1].toUser === currentUser?.id &&
                           loto.isolator?._id !== currentUser?.id && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComplete(loto._id);
                              }}
                              className="hover-scale"
                            >
                              ✅ Complete
                            </Button>
                          )}
                          
                          {/* Handover Recipient Decision Buttons */}
                          {loto.status === "pending_handover_verification" && 
                           loto.handoverHistory && loto.handoverHistory.length > 0 && 
                           loto.handoverHistory[loto.handoverHistory.length - 1].recipientStatus === 'pending' &&
                           currentUser?.id === loto.handoverHistory[loto.handoverHistory.length - 1].toUser && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRecipientDecision(loto._id, loto.handoverHistory.length - 1, 'accept');
                                }}
                                className="hover-scale"
                              >
                                ✅ Accept Handover
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRecipientDecision(loto._id, loto.handoverHistory.length - 1, 'reject');
                                }}
                                className="hover-scale"
                              >
                                ❌ Reject Handover
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card View */}
      <div className="mobile-cards-view d-block d-md-none">
        {filteredLotos.map((loto, index) => (
          <div key={loto._id} className="loto-card" onClick={() => navigate(`/loto/${loto._id}`)}>
            {/* Card Header */}
            <div className="card-header">
              <div className="serial-info">
                <div className="serial-number">{loto.serialNumber || "N/A"}</div>
                <div className="row-number">#{index + 1}</div>
              </div>
              <div className={`status-badge status-${loto.status}`}>
                {loto.status?.replace(/_/g, ' ').toUpperCase() || "UNKNOWN"}
              </div>
            </div>

            {/* Card Content */}
            <div className="card-content">
              <div className="info-row">
                <div className="info-label">Authorized Supervisor</div>
                <div className="info-value">
                  {loto.supervisorName || "N/A"}
                </div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Current Responsible</div>
                <div className="info-value">
                  {loto.currentResponsibleName || 
                   (loto.isolator
                     ? `${loto.isolator.firstName || ""} ${loto.isolator.lastName || ""}`
                     : "N/A")}
                </div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Isolator</div>
                <div className="info-value">
                  {loto.isolator
                    ? `${loto.isolator.firstName || ""} ${loto.isolator.lastName || ""}`
                    : "N/A"}
                </div>
              </div>
              
              <div className="info-row">
                <div className="info-label">Energy Types</div>
                <div className="info-value">
                  {loto.energyTypes && loto.energyTypes.length > 0 ? (
                    <div className="energy-types">
                      {loto.energyTypes.map((et, idx) => (
                        <span key={idx} className="energy-tag">
                          {formatEnergyType(et.type)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              
              {/* Additional useful fields */}
              {loto.location && (
                <div className="info-row">
                  <div className="info-label">Location</div>
                  <div className="info-value">{loto.location}</div>
                </div>
              )}
              
              {loto.line && (
                <div className="info-row">
                  <div className="info-label">Line</div>
                  <div className="info-value">{loto.line}</div>
                </div>
              )}
              
              {loto.machine && (
                <div className="info-row">
                  <div className="info-label">Machine</div>
                  <div className="info-value">{loto.machine}</div>
                </div>
              )}
              
              {loto.createdAt && (
                <div className="info-row">
                  <div className="info-label">Created</div>
                  <div className="info-value">
                    {new Date(loto.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Card Actions */}
            <div className="card-actions" onClick={(e) => e.stopPropagation()}>
              {/* View Button - Always Available */}
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/loto/${loto._id}`)}
              >
                👁️ View
              </button>

              {/* Admin Full Control */}
              {currentUser?.role === "admin" && (
                <>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate(`/loto/${loto._id}/update`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(loto._id, loto.serialNumber)}
                  >
                    🗑️ Delete
                  </button>
                </>
              )}

              {/* Supervisor Actions */}
              {canVerifyLOTO(loto) && currentUser?.role !== "admin" && (
                <>
                  {/* Verify LOTO */}
                  {loto.status === "pending_verification_new" && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleVerify(loto._id)}
                    >
                      ✅ Verify
                    </button>
                  )}
                  
                  {/* Reject LOTO */}
                  {loto.status === "pending_verification_new" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleReject(loto)}
                    >
                      ❌ Reject
                    </button>
                  )}
                  
                  {/* Update LOTO for rejected status */}
                  {loto.status === "rejected" && (
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate(`/loto/${loto._id}/update`)}
                    >
                      ✏️ Edit
                    </button>
                  )}
                  
                  {/* Handover LOTO */}
                  {loto.status === "active" && (
                    <button
                      className="btn btn-info"
                      onClick={() => handleHandover(loto._id)}
                    >
                      🤝 Handover
                    </button>
                  )}
                  
                  {/* Complete LOTO */}
                  {loto.status === "active" && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleStatusChange(loto._id, "completed")}
                    >
                      ✅ Complete
                    </button>
                  )}
                  
                  {/* Approve Handover */}
                  {loto.status === "pending_handover_verification" && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleApproveHandover(loto._id)}
                    >
                      ✅ Approve Handover
                    </button>
                  )}
                  
                  {/* Reject Handover */}
                  {loto.status === "pending_handover_verification" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRejectHandover(loto._id)}
                    >
                      ❌ Reject Handover
                    </button>
                  )}
                </>
              )}

              {/* Technician Actions */}
              {currentUser?.role === "technician" && (
                <>
                  {/* Update LOTO - Only if technician is isolator or handover recipient */}
                  {((loto.status === "pending_verification_new" || loto.status === "active") && 
                    (loto.isolator?._id === currentUser.id || 
                     (loto.handoverHistory && loto.handoverHistory.length > 0 && 
                      loto.handoverHistory[loto.handoverHistory.length - 1].toUser === currentUser.id))) && (
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate(`/loto/${loto._id}/update`)}
                    >
                      ✏️ Update
                    </button>
                  )}
                  
                  {/* Handover LOTO - Only if technician is isolator */}
                  {loto.status === "active" && loto.isolator?._id === currentUser.id && (
                    <button
                      className="btn btn-info"
                      onClick={() => handleHandover(loto._id)}
                    >
                      🤝 Handover
                    </button>
                  )}
                  
                  {/* Complete LOTO - Only if technician is isolator or handover recipient */}
                  {loto.status === "active" && 
                   (loto.isolator?._id === currentUser.id || 
                    (loto.handoverHistory && loto.handoverHistory.length > 0 && 
                     loto.handoverHistory[loto.handoverHistory.length - 1].toUser === currentUser.id)) && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleStatusChange(loto._id, "completed")}
                    >
                      ✅ Complete
                    </button>
                  )}
                </>
              )}

              {/* Handover Recipient Decision Buttons */}
              {loto.status === "pending_handover_verification" && 
               loto.handoverHistory && loto.handoverHistory.length > 0 && 
               loto.handoverHistory[loto.handoverHistory.length - 1].recipientStatus === 'pending' &&
               currentUser?.id === loto.handoverHistory[loto.handoverHistory.length - 1].toUser && (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => handleRecipientDecision(loto._id, loto.handoverHistory.length - 1, 'accept')}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRecipientDecision(loto._id, loto.handoverHistory.length - 1, 'reject')}
                  >
                    ❌ Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rejection Modal */}
      <RejectLOTOModal
        isOpen={rejectModalOpen}
        onClose={handleRejectModalClose}
        onConfirm={handleRejectConfirm}
        lotoData={selectedLotoForRejection}
      />

      {/* Status Change Modal */}
      <StatusChangeModal
        isOpen={statusChangeModalOpen}
        onClose={handleStatusChangeModalClose}
        onConfirm={handleStatusChangeConfirm}
        lotoData={selectedLotoForStatusChange}
        currentStatus={selectedLotoForStatusChange?.status}
      />

      {/* Handover Modal */}
      <HandoverModal
        isOpen={handoverModalOpen}
        onClose={handleHandoverModalClose}
        onConfirm={handleHandoverConfirm}
        lotoData={selectedLotoForHandover}
        currentUser={currentUser}
      />
    </div>
  );
};

export default LOTOList;
