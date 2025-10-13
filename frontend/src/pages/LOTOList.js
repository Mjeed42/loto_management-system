import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
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
  const { t } = useTranslation();
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
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage] = useState(10); // Items per page for desktop
  const [isMobile, setIsMobile] = useState(false); // Track mobile state
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

  // Detect mobile screen size and update items per page
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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

  // Get the correct home path based on user role
  const getHomePath = () => {
    if (currentUser?.role === "technician") {
      return "/technician-home";
    }
    return "/Home";
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
          isSnapshot: loto.isSnapshot || false,
          originalLotoId: loto.originalLotoId || null,
          snapshotReason: loto.snapshotReason || null,
          snapshotCreatedAt: loto.snapshotCreatedAt || null,
          snapshotCreatedForName: loto.snapshotCreatedForName || null,
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
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterSupervisor, activeFilter]);

  // Reset to first page when switching between mobile/desktop
  useEffect(() => {
    setCurrentPage(1);
  }, [isMobile]);

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

  // Helper function to get short status text for badges
  const getShortStatusText = (status) => {
    const statusMap = {
      pending_verification_new: t('lotoList.pendingVerification').toUpperCase(),
      active: t('lotoList.active').toUpperCase(),
      pending_handover_verification: t('lotoList.pendingHandover').toUpperCase(),
      handed_over: t('lotoList.handedOver').toUpperCase(),
      completed: t('lotoList.completed').toUpperCase(),
      rejected: t('lotoList.rejected').toUpperCase()
    };
    return statusMap[status] || status?.replace(/_/g, ' ').toUpperCase() || t('lotoList.unknown').toUpperCase();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_verification_new: {
        text: t('lotoList.pendingVerification'),
        variant: "warning",
        icon: "⏳",
        color: "#f59e0b",
      },
      active: {
        text: t('lotoList.active'),
        variant: "success",
        icon: "⚡",
        color: "#22c55e",
      },
      pending_handover_verification: {
        text: t('lotoList.pendingHandover'),
        variant: "info",
        icon: "🔄",
        color: "#0ea5e9",
      },
      handed_over: {
        text: t('lotoList.handedOver'),
        variant: "primary",
        icon: "📋",
        color: "#3b82f6",
      },
      completed: {
        text: t('lotoList.completed'),
        variant: "secondary",
        icon: "✅",
        color: "#166534",
      },
      rejected: {
        text: t('lotoList.rejected'),
        variant: "danger",
        icon: "❌",
        color: "#ef4444",
      },
      rejected_handover_snapshot: {
        text: t('lotoList.rejectedHandoverSnapshot') || "Rejected Handover (Snapshot)",
        variant: "warning",
        icon: "📸",
        color: "#f59e0b",
      },
      handed_over_snapshot: {
        text: t('lotoList.handedOverSnapshot') || "Handed Over (Snapshot)",
        variant: "info",
        icon: "📤",
        color: "#3b82f6",
      },
    };
    const config = statusConfig[status] || {
      text: status || t('lotoList.unknown'),
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

  // Dynamic items per page based on screen size
  const dynamicItemsPerPage = isMobile ? 5 : itemsPerPage;
  
  // Pagination calculations
  const totalItems = filteredLotos.length;
  const totalPages = Math.ceil(totalItems / dynamicItemsPerPage);
  const startIndex = (currentPage - 1) * dynamicItemsPerPage;
  const endIndex = startIndex + dynamicItemsPerPage;
  const currentPageItems = filteredLotos.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

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
          <h4 className="text-muted">{t('loading.loadingLotos')}</h4>
          <p className="text-muted">{t('loading.pleaseWaitFetch')}</p>
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
    <div className="cf-Home">
      <BackButton to={currentUser ? getHomePath() : "/technician-home"} label={t('common.back')} />
      
      {/* Header Section */}
      <div className="loto-header">
        <div className="loto-header-container">
          <div className="loto-header-content">
            <div className="loto-header-text">
              <h1 className="loto-header-title">
                📋 {t('lotoList.title')}
              </h1>
              <p className="loto-header-subtitle">{t('lotoList.subtitle')}</p>
            </div>
            <div className="loto-header-buttons">
              <button
                className="loto-btn loto-btn-refresh"
                onClick={fetchLOTOs}
              >
                🔄 {t('common.refresh')}
              </button>
              <button
                className="loto-btn loto-btn-create"
                onClick={() => navigate("/create-loto")}
              >
                ➕ {t('navigation.createLoto')}
              </button>
              <button
                className="loto-btn loto-btn-home"
                onClick={() => navigate(currentUser?.role === "technician" ? "/technician-home" : "/Home")}
              >
                🏠 {t('common.home')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="cf-main">
        {/* Statistics Dashboard */}
        <div className="statistics-container">
          <div 
            className={`cf-stat-card ${activeFilter === "all" ? "cf-shadow-lg" : ""}`}
            onClick={() => handleStatCardClick("all")}
            style={{ cursor: "pointer" }}
          >
            <div className="cf-stat-content">
              <div className="cf-stat-info">
                <div className="cf-stat-title">{t('lotoList.totalLotos')}</div>
                <div className="cf-stat-value">{lotos.length}</div>
              </div>
              <div className="cf-stat-icon cf-bg-primary">
                📊
              </div>
            </div>
          </div>

          <div 
            className={`cf-stat-card ${activeFilter === "active" ? "cf-shadow-lg" : ""}`}
            onClick={() => handleStatCardClick("active")}
            style={{ cursor: "pointer" }}
          >
            <div className="cf-stat-content">
              <div className="cf-stat-info">
                <div className="cf-stat-title">{t('lotoList.active')}</div>
                <div className="cf-stat-value">
                  {lotos.filter((l) => l.status === "active").length}
                </div>
              </div>
              <div className="cf-stat-icon cf-bg-success">
                ⚡
              </div>
            </div>
          </div>

          <div 
            className={`cf-stat-card ${activeFilter === "pending_verification_new" ? "cf-shadow-lg" : ""}`}
            onClick={() => handleStatCardClick("pending_verification_new")}
            style={{ cursor: "pointer" }}
          >
            <div className="cf-stat-content">
              <div className="cf-stat-info">
                <div className="cf-stat-title">{t('lotoList.pendingVerification')}</div>
                <div className="cf-stat-value">
                  {lotos.filter((l) => l.status === "pending_verification_new").length}
                </div>
              </div>
              <div className="cf-stat-icon cf-bg-warning">
                ⏳
              </div>
            </div>
          </div>

          <div 
            className={`cf-stat-card ${activeFilter === "pending_handover_verification" ? "cf-shadow-lg" : ""}`}
            onClick={() => handleStatCardClick("pending_handover_verification")}
            style={{ cursor: "pointer" }}
          >
            <div className="cf-stat-content">
              <div className="cf-stat-info">
                <div className="cf-stat-title">{t('lotoList.pendingHandover')}</div>
                <div className="cf-stat-value">
                  {lotos.filter((l) => l.status === "pending_handover_verification").length}
                </div>
              </div>
              <div className="cf-stat-icon cf-bg-info">
                🔄
              </div>
            </div>
          </div>

          <div 
            className={`cf-stat-card ${activeFilter === "handed_over" ? "cf-shadow-lg" : ""}`}
            onClick={() => handleStatCardClick("handed_over")}
            style={{ cursor: "pointer" }}
          >
            <div className="cf-stat-content">
              <div className="cf-stat-info">
                <div className="cf-stat-title">{t('lotoList.handedOver')}</div>
                <div className="cf-stat-value">
                  {lotos.filter((l) => l.status === "handed_over").length}
                </div>
              </div>
              <div className="cf-stat-icon cf-bg-primary">
                📋
              </div>
            </div>
          </div>

          <div 
            className={`cf-stat-card ${activeFilter === "rejected" ? "cf-shadow-lg" : ""}`}
            onClick={() => handleStatCardClick("rejected")}
            style={{ cursor: "pointer" }}
          >
            <div className="cf-stat-content">
              <div className="cf-stat-info">
                <div className="cf-stat-title">{t('lotoList.rejected')}</div>
                <div className="cf-stat-value">
                  {lotos.filter((l) => l.status === "rejected").length}
                </div>
              </div>
              <div className="cf-stat-icon cf-bg-danger">
                ❌
              </div>
            </div>
          </div>

          <div 
            className={`cf-stat-card ${activeFilter === "completed" ? "cf-shadow-lg" : ""}`}
            onClick={() => handleStatCardClick("completed")}
            style={{ cursor: "pointer" }}
          >
            <div className="cf-stat-content">
              <div className="cf-stat-info">
                <div className="cf-stat-title">{t('lotoList.completed')}</div>
                <div className="cf-stat-value">
                  {lotos.filter((l) => l.status === "completed").length}
                </div>
              </div>
              <div className="cf-stat-icon cf-bg-success">
                ✅
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="cf-alert cf-alert-danger cf-d-flex cf-align-items-center">
            <span className="cf-me-3" style={{ fontSize: "1.5rem" }}>
              ⚠️
            </span>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="cf-card cf-mb-4">
          <div className="cf-card-body">
            <div className="search-filter-container">
              {/* Search Input */}
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder={t('lotoList.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Row */}
              <div className="filter-row">
                {/* Status Filter */}
                <div className="filter-wrapper">
                  <select
                    className="cf-form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">{t('lotoList.allStatus')}</option>
                    <option value="pending_verification_new">{t('lotoList.pendingVerification')}</option>
                    <option value="active">{t('lotoList.active')}</option>
                    <option value="pending_handover_verification">{t('lotoList.pendingHandover')}</option>
                    <option value="handed_over">{t('lotoList.handedOver')}</option>
                    <option value="rejected">{t('lotoList.rejected')}</option>
                    <option value="completed">{t('lotoList.completed')}</option>
                  </select>
                </div>

                {/* Supervisor Filter */}
                {currentUser && currentUser.role === "supervisor" && (
                  <div className="filter-wrapper">
                    <select
                      className="cf-form-select"
                      value={filterSupervisor}
                      onChange={(e) => setFilterSupervisor(e.target.value)}
                    >
                      <option value="all">{t('lotoList.allLotos')}</option>
                      <option value="my_created">{t('lotoList.createdByMe')}</option>
                      <option value="my_authorized">{t('lotoList.authorizedByMe')}</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Indicator and Clear Button */}
        {(activeFilter || searchTerm || filterSupervisor !== "all") && (
          <div className="cf-card cf-mb-3">
            <div className="cf-card-body">
              <div className="active-filters-container">
                <div className="filters-info">
                  <span className="filters-label">{t('lotoList.activeFilters')}:</span>
                  <div className="filters-badges">
                    {activeFilter && (
                      <span className="cf-badge cf-bg-primary">
                        {activeFilter === "all" ? t('lotoList.allLotos') : 
                         activeFilter === "active" ? t('lotoList.active') :
                         activeFilter === "pending_verification_new" ? t('lotoList.pendingVerification') :
                         activeFilter === "pending_handover_verification" ? t('lotoList.pendingHandover') :
                         activeFilter === "handed_over" ? t('lotoList.handedOver') :
                         activeFilter === "rejected" ? t('lotoList.rejected') :
                         activeFilter === "completed" ? t('lotoList.completed') : activeFilter}
                      </span>
                    )}
                    {searchTerm && (
                      <span className="cf-badge cf-bg-info">
                        {t('lotoList.search')}: "{searchTerm}"
                      </span>
                    )}
                    {filterSupervisor !== "all" && currentUser && currentUser.role === "supervisor" && (
                      <span className="cf-badge cf-bg-warning">
                        {filterSupervisor === "my_created" ? t('lotoList.createdByMe') :
                         filterSupervisor === "my_authorized" ? t('lotoList.authorizedByMe') : filterSupervisor}
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  className="clear-filters-btn"
                  onClick={clearFilters}
                >
                  ✕ {t('lotoList.clearFilters')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {filteredLotos.length > 0 && (
          <div className="cf-card cf-mb-3">
            <div className="cf-card-body">
              <div className="results-summary">
                <span className="results-text">
                  {t('lotoList.showingResults', { 
                    start: startIndex + 1, 
                    end: Math.min(endIndex, totalItems), 
                    total: totalItems 
                  })}
                </span>
                <div className="page-info-container">
                  <span className="page-info">
                    {t('lotoList.pageOf', { current: currentPage, total: totalPages })}
                  </span>
                  <span className="items-per-page-info">
                    {isMobile ? t('lotoList.mobileView') : t('lotoList.desktopView')} ({dynamicItemsPerPage} {t('lotoList.perPage')})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOTO Table - Desktop Only */}
        <div className="desktop-table-view">
          {filteredLotos.length === 0 && !loading ? (
          <div className="cf-card cf-text-center cf-py-4">
            <div className="cf-card-body">
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                {searchTerm || filterStatus !== "all" || filterSupervisor !== "all" ? "🔍" : "📋"}
              </div>
              <h3 className="cf-text-lg cf-font-semibold cf-text-primary cf-mb-2">
                {searchTerm || filterStatus !== "all" || filterSupervisor !== "all"
                  ? t('lotoList.noLotosFound')
                  : t('lotoList.noLotosCreatedYet')}
              </h3>
              <p className="cf-text-secondary cf-mb-4">
                {searchTerm || filterStatus !== "all" || filterSupervisor !== "all"
                  ? t('lotoList.tryAdjustingSearch')
                  : t('lotoList.getStartedCreating')}
              </p>
              {!(searchTerm || filterStatus !== "all" || filterSupervisor !== "all") && (
                <button
                  className="cf-btn cf-btn-sm"
                  onClick={() => navigate("/create-loto")}
                  style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "0.375rem" }}
                >
                  ➕ Create LOTO
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="cf-card">
            <div className="cf-card-body">
              <div className="cf-table-container">
                <table className="cf-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t('lotoList.serialNumber')}</th>
                      <th>{t('lotoList.authorizedSupervisor')}</th>
                      <th>{t('lotoList.currentResponsible')}</th>
                      <th>{t('lotoList.isolator')}</th>
                      <th>{t('lotoList.energyTypes')}</th>
                      <th>{t('loto.status')}</th>
                      <th className="cf-text-center">{t('lotoList.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageItems.map((loto, index) => (
                      <tr
                        key={loto._id}
                        onClick={() => navigate(`/loto/${loto._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{startIndex + index + 1}</td>
                        <td>
                          {loto.serialNumber || "N/A"}
                          {loto.isSnapshot && (
                            <span 
                              style={{
                                marginLeft: '8px',
                                padding: '2px 6px',
                                background: '#fef3c7',
                                color: '#f59e0b',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                border: '1px solid #fbbf24'
                              }}
                              title="This is a read-only snapshot of a rejected handover"
                            >
                              📸 SNAPSHOT
                            </span>
                          )}
                        </td>
                        <td>{loto.supervisorName || "N/A"}</td>
                        <td>
                          {loto.isSnapshot 
                            ? (loto.snapshotCreatedForName || "Snapshot")
                            : (loto.currentResponsibleName || 
                               (loto.isolator
                                 ? `${loto.isolator.firstName || ""} ${
                                     loto.isolator.lastName || ""
                                   }`
                                 : "N/A"))}
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
                        <td className="cf-text-center">
                          <div className="cf-d-flex cf-gap-2 cf-justify-content-between">
                            {/* Admin Full Control */}
                            {isAdmin && (
                              <>
                                {loto.status === "pending_verification_new" && (
                                  <>
                                    <button
                                      className="cf-btn cf-btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleVerify(loto._id);
                                      }}
                                      style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                                    >
                                      ✅ {t('lotoList.verify')}
                                    </button>
                                    <button
                                      className="cf-btn cf-btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(loto);
                                      }}
                                      style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                                    >
                                      ❌ {t('lotoList.reject')}
                                    </button>
                                  </>
                                )}
                                {loto.status === "rejected" && (
                                  <button
                                    className="cf-btn cf-btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleUpdate(loto._id);
                                    }}
                                    style={{ backgroundColor: "#f59e0b", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                                  >
                                    ✏️ {t('lotoList.edit')}
                                  </button>
                                )}
                                {loto.status === "active" && (
                                  <>
                                    <button
                                      className="cf-btn cf-btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleHandover(loto);
                                      }}
                                      style={{ backgroundColor: "#06b6d4", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                                    >
                                      🤝 {t('lotoList.handover')}
                                    </button>
                                    <button
                                      className="cf-btn cf-btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleComplete(loto._id);
                                      }}
                                      style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                                    >
                                      ✅ Complete
                                    </button>
                                  </>
                                )}
                                {loto.status === "pending_handover_verification" && (
                                  <>
                                    <button
                                      className="cf-btn cf-btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApproveHandover(loto._id);
                                      }}
                                      style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                                    >
                                      ✅ {t('lotoList.approve')}
                                    </button>
                                    <button
                                      className="cf-btn cf-btn-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRejectHandover(loto._id);
                                      }}
                                      style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                                    >
                                      ❌ {t('lotoList.reject')}
                                    </button>
                                  </>
                                )}
                                
                                {/* Status Change Button - Always Available for Admins */}
                                <button
                                  className="cf-btn cf-btn-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(loto);
                                  }}
                                  style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                                >
                                  ⭐ {t('lotoList.status')}
                                </button>
                              </>
                            )}
                            {/* Simplified action buttons for other roles */}
                            {!isAdmin && (
                              <button
                                className="cf-btn cf-btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/loto/${loto._id}`);
                                }}
                                style={{ backgroundColor: "#6b7280", color: "white", border: "none", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                              >
                                {t('lotoList.view')}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Mobile Card View */}
        <div className="mobile-cards-view">
          {filteredLotos.length === 0 && !loading ? (
            <div className="cf-card cf-text-center cf-py-4">
              <div className="cf-card-body">
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
                  {searchTerm || filterStatus !== "all" || filterSupervisor !== "all" ? "🔍" : "📋"}
                </div>
                <h3 className="cf-text-lg cf-font-semibold cf-text-primary cf-mb-2">
                  {searchTerm || filterStatus !== "all" || filterSupervisor !== "all"
                    ? t('lotoList.noLotosFound')
                    : t('lotoList.noLotosCreatedYet')}
                </h3>
                <p className="cf-text-secondary cf-mb-4">
                  {searchTerm || filterStatus !== "all" || filterSupervisor !== "all"
                    ? t('lotoList.tryAdjustingSearch')
                    : t('lotoList.getStartedCreating')}
                </p>
                {!(searchTerm || filterStatus !== "all" || filterSupervisor !== "all") && (
                  <button
                    className="cf-btn cf-btn-sm"
                    onClick={() => navigate("/create-loto")}
                    style={{ backgroundColor: "#3b82f6", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "0.375rem" }}
                  >
                    ➕ {t('navigation.createLoto')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            currentPageItems.map((loto, index) => (
            <div key={loto._id} className="loto-card" onClick={() => navigate(`/loto/${loto._id}`)}>
              {/* Card Header */}
              <div className="card-header">
                <div className="serial-info">
                  <div className="serial-number">{loto.serialNumber || "N/A"}</div>
                  <div className="row-number">#{startIndex + index + 1}</div>
                </div>
                <div className={`status-badge status-${loto.status}`}>
                  {getShortStatusText(loto.status)}
                </div>
              </div>

              {/* Card Content */}
              <div className="card-content">
                <div className="info-row">
                  <div className="info-label">{t('lotoList.authorizedSupervisor')}</div>
                  <div className="info-value">
                    {loto.supervisorName || "N/A"}
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">{t('lotoList.currentResponsible')}</div>
                  <div className="info-value">
                    {loto.currentResponsibleName || 
                     (loto.isolator
                       ? `${loto.isolator.firstName || ""} ${loto.isolator.lastName || ""}`
                       : "N/A")}
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">{t('lotoList.isolator')}</div>
                  <div className="info-value">
                    {loto.isolator
                      ? `${loto.isolator.firstName || ""} ${loto.isolator.lastName || ""}`
                      : "N/A"}
                  </div>
                </div>
                
                <div className="info-row">
                  <div className="info-label">{t('lotoList.energyTypes')}</div>
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
              </div>

              {/* Card Actions */}
              <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/loto/${loto._id}`)}
                >
                   {t('lotoList.view')}
                </button>
                {currentUser?.role === "admin" && (
                  <>
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate(`/loto/${loto._id}/update`)}
                    >
                      ✏️ {t('lotoList.edit')}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(loto._id, loto.serialNumber)}
                    >
                      🗑️ {t('lotoList.delete')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
          )}
        </div>

        {/* Pagination Component */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination-wrapper">
              {/* Previous Button */}
              <button
                className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <span className="pagination-icon">‹</span>
                <span className="pagination-text">{t('lotoList.previous')}</span>
              </button>

              {/* Page Numbers */}
              <div className="pagination-numbers">
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <button
                      className={`pagination-number ${currentPage === 1 ? 'active' : ''}`}
                      onClick={() => goToPage(1)}
                    >
                      1
                    </button>
                    {currentPage > 4 && <span className="pagination-ellipsis">...</span>}
                  </>
                )}

                {/* Pages around current page */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                  const pageNum = startPage + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="pagination-ellipsis">...</span>}
                    <button
                      className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                      onClick={() => goToPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <button
                className={`pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <span className="pagination-text">{t('lotoList.next')}</span>
                <span className="pagination-icon">›</span>
              </button>
            </div>
          </div>
        )}
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
