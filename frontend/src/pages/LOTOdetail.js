import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import BackButton from "../components/BackButton";
import RejectLOTOModal from "../components/RejectLOTOModal";
import StatusChangeModal from "../components/StatusChangeModal";
import HandoverModal from "../components/HandoverModal";

const LOTOdetail = () => {
  const [loto, setLoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLotoForRejection, setSelectedLotoForRejection] = useState(null);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [selectedLotoForStatusChange, setSelectedLotoForStatusChange] = useState(null);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [selectedLotoForHandover, setSelectedLotoForHandover] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [handoverHistory, setHandoverHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTO();
    fetchCurrentUser();
    fetchHandoverHistory();
  }, [id]);

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

  const fetchLOTO = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}`,
        config
      );

      setLoto(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching LOTO");
      setLoading(false);
    }
  };

  const fetchHandoverHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}/handover-history`,
        config
      );

      setHandoverHistory(res.data.data.handoverHistory || []);
    } catch (err) {
      console.error("Error fetching handover history:", err);
      setHandoverHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete LOTO ${loto.serialNumber}? This action cannot be undone.`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}`,
        config
      );

      alert("LOTO deleted successfully!");
      navigate("/loto-list");
    } catch (err) {
      console.error("Delete LOTO error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error deleting LOTO";
      alert(`Delete failed: ${errorMessage}`);
    }
  };


  const handleVerify = async () => {
    if (!window.confirm("Are you sure you want to verify this LOTO?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}/verify`,
        {},
        config
      );

      setLoto(res.data.data);
      alert("LOTO verified successfully!");
      fetchLOTO();
    } catch (err) {
      alert(err.response?.data?.message || "Error verifying LOTO");
    }
  };

  const handleUpdate = () => navigate(`/loto/${id}/update`);
  const handleComplete = () => navigate(`/loto/${id}/complete`);

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

      if (res.data.success) {
        alert("LOTO rejected successfully");
        setRejectModalOpen(false);
        setSelectedLotoForRejection(null);
        // Refresh the LOTO data
        fetchLOTO();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting LOTO");
    }
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
    setSelectedLotoForRejection(null);
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
        // Refresh the LOTO data
        fetchLOTO();
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
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}/handover`,
        handoverData,
        config
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchLOTO();
        fetchHandoverHistory();
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

  const handleRecipientDecision = async (handoverIndex, action) => {
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
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${loto._id}/handover/${handoverIndex}/recipient-decision`,
        {
          action,
          decisionNotes,
        },
        config
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchLOTO(); // Refresh the LOTO data
      }
    } catch (err) {
      console.error("Error making recipient decision:", err);
      alert(err.response?.data?.message || "Error making decision");
    }
  };

  const handleVerifyHandover = async (handoverIndex, action) => {
    try {
      const verificationNotes = prompt(`Enter verification notes for ${action}:`);
      const rejectionReason = action === 'reject' ? prompt('Enter rejection reason:') : '';
      
      if (action === 'reject' && !rejectionReason) {
        alert('Rejection reason is required');
        return;
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${loto._id}/handover/${handoverIndex}/verify`,
        {
          action,
          verificationNotes,
          rejectionReason,
        },
        config
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchLOTO(); // Refresh the LOTO data
      }
    } catch (err) {
      console.error("Error verifying handover:", err);
      alert(err.response?.data?.message || "Error verifying handover");
    }
  };

  const handleApproveHandover = async () => {
    try {
      // Get the latest handover index (last one in the array)
      if (!handoverHistory || handoverHistory.length === 0) {
        alert("No handover found to approve");
        return;
      }
      
      const handoverIndex = handoverHistory.length - 1;
      await handleVerifyHandover(handoverIndex, 'approve');
    } catch (err) {
      console.error("Error approving handover:", err);
      alert("Error approving handover");
    }
  };

  const handleRejectHandover = async () => {
    try {
      // Get the latest handover index (last one in the array)
      if (!handoverHistory || handoverHistory.length === 0) {
        alert("No handover found to reject");
        return;
      }
      
      const handoverIndex = handoverHistory.length - 1;
      await handleVerifyHandover(handoverIndex, 'reject');
    } catch (err) {
      console.error("Error rejecting handover:", err);
      alert("Error rejecting handover");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading LOTO details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center mb-4">
        <span className="me-3" style={{ fontSize: "1.5rem" }}>
          ⚠️
        </span>
        <div>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!loto) {
    return (
      <div className="text-center py-5">
        <h2>LOTO not found</h2>
      </div>
    );
  }

  // 👇 Build full location path — handle missing fields gracefully
  // 👇 Build full location path — with fallback message if incomplete
  const locationPathParts = [];

  if (loto.location) locationPathParts.push(loto.location);
  if (loto.line) locationPathParts.push(loto.line);
  if (loto.machine) locationPathParts.push(loto.machine);

  let locationPath = locationPathParts.join(" > ");

  // 👇 If only location is present, hint that more could be added
  if (locationPath && !loto.line && !loto.machine) {
    locationPath += " (add line/machine for full path)";
  }

  locationPath = locationPath || "N/A";

  // 👇 Status Badge with Emoji — styled like CreateLOTO
  const getStatusBadge = (status) => {
    const config = {
      pending_verification_new: { text: "⏳ Pending Verification (New)", variant: "warning" },
      active: { text: "✅ Active", variant: "success" },
      pending_handover_verification: { text: "🤝 Pending Handover Verification", variant: "info" },
      handed_over: { text: "📋 Handed Over", variant: "primary" },
      completed: { text: "🏁 Completed", variant: "secondary" },
      rejected: { text: "❌ Rejected", variant: "danger" },
    }[status] || { text: status, variant: "secondary" };

    return (
      <span
        className={`badge bg-${config.variant} fs-6 px-3 py-2 rounded-pill`}
      >
        {config.text}
      </span>
    );
  };

  const isHandoverRecipient =
    currentUser && loto.handoverTo && loto.handoverTo._id === currentUser.id;
  const isIsolator =
    currentUser && loto.isolator && loto.isolator._id === currentUser.id;
  const canVerify =
    currentUser &&
    (currentUser.role === "admin" || 
     (currentUser.role === "supervisor" && 
      ((loto.supervisor && loto.supervisor._id === currentUser.id) ||
       (loto.supervisorName && loto.supervisorName.toLowerCase().includes(`${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim().toLowerCase())))));
  const isAdmin = currentUser && currentUser.role === "admin";
  const isTechnician = currentUser && currentUser.role === "technician";
  const isSupervisor = currentUser && currentUser.role === "supervisor";

  // Get the correct home path based on user role
  const getHomePath = () => {
    if (isTechnician) return "/technician-home";
    return "/Home";
  };

  return (
    <div className="loto-details-container animate-fade-in">
      <BackButton to="/loto-list" label="Back to My LOTOs" />
      
      {/* Modern Header Section */}
      <div className="loto-details-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon">
              <svg className="header-svg" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1>LOTO Details</h1>
              <p>Serial Number: {loto.serialNumber}</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="action-btn secondary"
              onClick={fetchLOTO}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Refresh</span>
            </button>
            <button
              className="action-btn secondary"
              onClick={() => navigate("/loto-list")}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back to List</span>
            </button>
            <button
              className="action-btn primary"
              onClick={() => navigate(getHomePath())}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Error Display */}
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

      {/* Modern Content Layout */}
      <div className="loto-details-content">
        {/* Main Information Section */}
        <div className="main-info-section">
          <div className="info-header">
            <div className="info-icon">
              <svg className="info-svg" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="info-title">
              <h3>LOTO Information</h3>
              <p>Complete details and status</p>
            </div>
            <div className="status-badge-container">
              {getStatusBadge(loto.status)}
            </div>
          </div>

          <div className="info-grid">
            {/* Basic Information */}
            <div className="info-group">
              <h4 className="group-title">Basic Information</h4>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-label">Serial Number</span>
                  <span className="info-value">{loto.serialNumber}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date Created</span>
                  <span className="info-value">{new Date(loto.date).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Shift</span>
                  <span className="info-value">{loto.shift}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Isolator</span>
                  <span className="info-value">{loto.isolatorName}</span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="info-group">
              <h4 className="group-title">Location Details</h4>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-label">Location Path</span>
                  <span className="info-value location-path">{locationPath}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Isolated Part</span>
                  <span className="info-value">{loto.isolatedPart}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Reason</span>
                  <span className="info-value">{loto.reason}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">PTW Number</span>
                  <span className="info-value">{loto.ptwNumber}</span>
                </div>
              </div>
            </div>

            {/* Duration & Supervisor */}
            <div className="info-group">
              <h4 className="group-title">Assignment & Duration</h4>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-label">Expected Duration</span>
                  <span className="info-value">{loto.expectedDuration} hours</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Authorized Supervisor</span>
                  <span className={`info-value ${loto.supervisorName ? 'supervisor-assigned' : 'no-supervisor'}`}>
                    {loto.supervisorName || 'None assigned'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Types Section */}
          <div className="energy-types-section">
            <h4 className="section-title">Energy Types to Isolate</h4>
            {loto.energyTypes && loto.energyTypes.length > 0 ? (
              <div className="energy-types-grid">
                {loto.energyTypes.map((energy, index) => (
                  <div key={index} className="energy-type-card">
                    <div className="energy-type-header">
                      <span className="energy-type-name">{energy.type}</span>
                    </div>
                    <div className="energy-type-content">
                      <span className="isolation-point">{energy.isolationPoint}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-energy-types">
                <span>No energy types specified</span>
              </div>
            )}
          </div>

          {/* Additional Information Sections */}
          <div className="additional-info-sections">
            {/* Verified By */}
            {loto.verifiedBy && (
              <div className="info-section verified-section">
                <div className="section-icon">
                  <svg className="section-svg" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="section-content">
                  <h5>Verified By</h5>
                  <div className="verification-details">
                    <span className="verifier-name">{loto.verifiedBy.firstName} {loto.verifiedBy.lastName}</span>
                    <span className="verification-time">{new Date(loto.verifiedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Handover Notes */}
            {loto.handoverNotes && (
              <div className="info-section handover-section">
                <div className="section-icon">
                  <svg className="section-svg" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="section-content">
                  <h5>Handover Notes</h5>
                  <p className="notes-text">{loto.handoverNotes}</p>
                </div>
              </div>
            )}

            {/* Completion Notes */}
            {loto.completionNotes && (
              <div className="info-section completion-section">
                <div className="section-icon">
                  <svg className="section-svg" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="section-content">
                  <h5>Completion Notes</h5>
                  <p className="notes-text">{loto.completionNotes}</p>
                </div>
              </div>
            )}

            {/* Handover History Section */}
            <div className="info-section handover-history-section">
              
              <div className="section-content">
                <div className="section-header">
                  <h5>Handover History</h5>
                  <p>Complete chain of responsibility transfers</p>
                </div>
                
                {historyLoading ? (
                  <div className="loading-text">Loading handover history...</div>
                ) : handoverHistory && handoverHistory.length > 0 ? (
                  <div className="handover-history-content">
                    {/* Handover Chain */}
                    <div className="handover-chain">
                      <h6>Responsibility Chain:</h6>
                      <div className="chain-display">
                        {(() => {
                          const chain = [`${loto.isolator.firstName} ${loto.isolator.lastName}`];
                          handoverHistory.forEach(handover => {
                            chain.push(`${handover.toUserName}`);
                          });
                          return chain.join(" → ");
                        })()}
                      </div>
                    </div>

                    {/* Current Responsible */}
                    <div className="current-responsible">
                      <h6>Current Responsible:</h6>
                      <span className="responsible-name">
                        {loto.currentResponsibleName || `${loto.isolator.firstName} ${loto.isolator.lastName}`}
                      </span>
                    </div>

                    {/* Detailed History */}
                    <div className="detailed-history">
                      <h6>Detailed History:</h6>
                      <div className="history-list">
                        {handoverHistory.map((handover, index) => (
                          <div key={index} className="history-item">
                            <div className="history-main">
                              <span className="from-user">{handover.fromUserName}</span>
                              <span className="arrow">→</span>
                              <span className="to-user">{handover.toUserName}</span>
                            </div>
                            <div className="history-details">
                              <span className="handover-date">
                                {new Date(handover.handoverDate).toLocaleString()}
                              </span>
                              <span className="handover-type">
                                {handover.handoverType?.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className="created-by">
                                Created by: {handover.createdByName}
                              </span>
                            </div>
                            {handover.handoverNotes && (
                              <div className="handover-notes">
                                <strong>Notes:</strong> {handover.handoverNotes}
                              </div>
                            )}
                            
                            {/* Recipient Decision Status */}
                            <div className="recipient-decision-section">
                              <div className="recipient-status">
                                <strong>Recipient Decision:</strong>
                                <span className={`recipient-badge ${handover.recipientStatus || 'pending'}`}>
                                  {handover.recipientStatus === 'accepted' ? '✅ Accepted' : 
                                   handover.recipientStatus === 'rejected' ? '❌ Rejected' : 
                                   '⏳ Pending Decision'}
                                </span>
                              </div>
                              
                              {handover.recipientStatus === 'accepted' && handover.recipientDecisionDate && (
                                <div className="recipient-details">
                                  <span className="recipient-decision-info">
                                    Accepted on {new Date(handover.recipientDecisionDate).toLocaleString()}
                                  </span>
                                  {handover.recipientDecisionNotes && (
                                    <div className="recipient-decision-notes">
                                      <strong>Decision Notes:</strong> {handover.recipientDecisionNotes}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {handover.recipientStatus === 'rejected' && handover.recipientDecisionDate && (
                                <div className="recipient-details">
                                  <span className="recipient-decision-info">
                                    Rejected on {new Date(handover.recipientDecisionDate).toLocaleString()}
                                  </span>
                                  {handover.recipientDecisionNotes && (
                                    <div className="recipient-decision-notes">
                                      <strong>Rejection Notes:</strong> {handover.recipientDecisionNotes}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Recipient Decision Buttons */}
                              {handover.recipientStatus === 'pending' && 
                               currentUser?.id === handover.toUser && (
                                <div className="recipient-actions">
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleRecipientDecision(index, 'accept')}
                                  >
                                    ✅ Accept Handover
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRecipientDecision(index, 'reject')}
                                  >
                                    ❌ Reject Handover
                                  </button>
                                </div>
                              )}
                            </div>
                            
                            {/* Verification Status */}
                            <div className="verification-section">
                              <div className="verification-status">
                                <strong>Supervisor Verification:</strong>
                                <span className={`verification-badge ${handover.verificationStatus || 'pending'}`}>
                                  {handover.verificationStatus === 'approved' ? '✅ Approved' : 
                                   handover.verificationStatus === 'rejected' ? '❌ Rejected' : 
                                   handover.recipientStatus === 'accepted' ? '⏳ Pending Verification' : 
                                   '⏸️ Waiting for Recipient Decision'}
                                </span>
                              </div>
                              
                              {handover.verificationStatus === 'approved' && handover.verifiedByName && (
                                <div className="verification-details">
                                  <span className="verified-by">
                                    Approved by {handover.verifiedByName} at {new Date(handover.verificationDate).toLocaleString()}
                                  </span>
                                  {handover.verificationNotes && (
                                    <div className="verification-notes">
                                      <strong>Verification Notes:</strong> {handover.verificationNotes}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {handover.verificationStatus === 'rejected' && handover.verifiedByName && (
                                <div className="verification-details">
                                  <span className="verified-by">
                                    Rejected by {handover.verifiedByName} at {new Date(handover.verificationDate).toLocaleString()}
                                  </span>
                                  {handover.rejectionReason && (
                                    <div className="rejection-reason">
                                      <strong>Rejection Reason:</strong> {handover.rejectionReason}
                                    </div>
                                  )}
                                  {handover.verificationNotes && (
                                    <div className="verification-notes">
                                      <strong>Verification Notes:</strong> {handover.verificationNotes}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {/* Verification Action Buttons */}
                              {handover.recipientStatus === 'accepted' && 
                               (!handover.verificationStatus || handover.verificationStatus === 'pending') && 
                               (currentUser?.role === 'supervisor' || currentUser?.role === 'admin') && (
                                <div className="verification-actions">
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleVerifyHandover(index, 'approve')}
                                  >
                                    ✅ Approve
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleVerifyHandover(index, 'reject')}
                                  >
                                    ❌ Reject
                                  </button>
                                </div>
                              )}
                              
                              {/* Assigned Verifier for Pending Handovers */}
                              {(!handover.verificationStatus || handover.verificationStatus === 'pending') && handover.assignedVerifierName && (
                                <div className="assigned-verifier">
                                  <strong>Assigned Verifier:</strong> {handover.assignedVerifierName}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-history">
                    <p>No handover history available. The isolator is currently responsible.</p>
                    <div className="current-responsible">
                      <h6>Current Responsible:</h6>
                      <span className="responsible-name">
                        {`${loto.isolator.firstName} ${loto.isolator.lastName}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actual Finish Time */}
            {loto.actualFinishTime && (
              <div className="info-section finish-section">
                <div className="section-icon">
                  <svg className="section-svg" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="section-content">
                  <h5>Actual Finish Time</h5>
                  <div className="finish-details">
                    <span className="finish-time">{new Date(loto.actualFinishTime).toLocaleTimeString()}</span>
                    <span className="finish-date">{new Date(loto.actualFinishDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Actions Section */}
        <div className="actions-section">
          <div className="actions-header">
            <div className="actions-icon">
              <svg className="actions-svg" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="actions-title">
              <h3>Actions</h3>
              <p>Available operations</p>
            </div>
          </div>

          <div className="actions-content">

            {/* Handover Recipient Decision - Prominent Section */}
            {loto.status === "pending_handover_verification" && 
             loto.handoverHistory && loto.handoverHistory.length > 0 && 
             loto.handoverHistory[loto.handoverHistory.length - 1].recipientStatus === 'pending' &&
             currentUser?.id === loto.handoverHistory[loto.handoverHistory.length - 1].toUser && (
              <div className="action-group handover-recipient-group">
                <div className="action-header">
                  <h5>🤝 Handover Decision Required</h5>
                  <p>You have been assigned a handover. Please accept or reject this handover request.</p>
                  <div className="handover-details">
                    <strong>From:</strong> {loto.handoverHistory[loto.handoverHistory.length - 1].fromUserName}<br/>
                    <strong>Date:</strong> {new Date(loto.handoverHistory[loto.handoverHistory.length - 1].handoverDate).toLocaleString()}<br/>
                    {loto.handoverHistory[loto.handoverHistory.length - 1].handoverNotes && (
                      <><strong>Notes:</strong> {loto.handoverHistory[loto.handoverHistory.length - 1].handoverNotes}</>
                    )}
                  </div>
                </div>
                <div className="action-button-container">
                  <button 
                    className="action-button success" 
                    onClick={() => handleRecipientDecision(loto.handoverHistory.length - 1, 'accept')}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Accept Handover</span>
                  </button>
                  <button 
                    className="action-button danger" 
                    onClick={() => handleRecipientDecision(loto.handoverHistory.length - 1, 'reject')}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Reject Handover</span>
                  </button>
                </div>
              </div>
            )}

            {/* Supervisor Actions */}
            {canVerify && (
              <>
                {/* Verification Actions */}
                {loto.status === "pending_verification_new" && (
                  <div className="action-group verification-group">
                    <div className="action-header">
                      <h5>Verification Required</h5>
                      <p>This LOTO is pending supervisor verification.</p>
                    </div>
                    <div className="action-button-container">
                      <button className="action-button success" onClick={handleVerify}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Verify LOTO</span>
                      </button>
                      <button className="action-button danger" onClick={() => handleReject(loto)}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Reject LOTO</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Rejected LOTO Actions */}
                {loto.status === "rejected" && (
                  <div className="action-group update-group">
                    <div className="action-header">
                      <h5>Update Required</h5>
                      <p>This LOTO was rejected and requires modification.</p>
                    </div>
                    <div className="action-button-container">
                      <button className="action-button primary" onClick={handleUpdate}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Edit LOTO</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Active LOTO Actions */}
                {loto.status === "active" && (
                  <div className="action-group supervisor-group">
                    <div className="action-header">
                      <h5>Supervisor Actions</h5>
                      <p>Available operations for active LOTOs.</p>
                    </div>
                    <div className="action-buttons">
                      <button className="action-button info" onClick={() => handleHandover(loto)}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Handover</span>
                      </button>
                      <button className="action-button success" onClick={handleComplete}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Complete</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Handover Verification Actions */}
                {loto.status === "pending_handover_verification" && (
                  <div className="action-group handover-group">
                    <div className="action-header">
                      <h5>Handover Verification</h5>
                      <p>Approve or reject the handover request.</p>
                    </div>
                    <div className="action-buttons">
                      <button className="action-button success" onClick={handleApproveHandover}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Approve Handover</span>
                      </button>
                      <button className="action-button danger" onClick={handleRejectHandover}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Reject Handover</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Current User Actions for Handover Verification */}
            {loto.status === "pending_handover_verification" && currentUser && (
              <div className="action-group current-user-group">
                <div className="action-header">
                  <h5>📝 Available Actions</h5>
                  <p>While handover verification is pending, you can update limited LOTO details.</p>
                </div>
                <div className="action-button-container">
                  <button 
                    className="action-button primary" 
                    onClick={() => navigate(`/loto/${id}/update`)}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Update LOTO Details</span>
                  </button>
                </div>
              </div>
            )}

            {/* Handover Verification */}
            {loto.status === "pending_handover_verification" && canVerify && (
              <div className="action-group handover-verification-group">
                <div className="action-header">
                  <h5>Handover Verification Required</h5>
                  <p>This handover is pending supervisor verification.</p>
                </div>
                <div className="action-button-container">
                  <button className="action-button success" onClick={handleApproveHandover}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Approve Handover</span>
                  </button>
                  <button className="action-button danger" onClick={handleRejectHandover}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Reject Handover</span>
                  </button>
                </div>
              </div>
            )}

            {/* Admin Full Control */}
            {isAdmin && (
              <div className="action-group admin-group">
                <div className="action-header">
                  <h5>🔧 Admin Actions</h5>
                  <p>Full administrative control over this LOTO.</p>
                </div>
                <div className="action-button-container">
                  {loto.status === "pending_verification_new" && (
                    <>
                      <button className="action-button success" onClick={handleVerify}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Verify LOTO</span>
                      </button>
                      <button className="action-button danger" onClick={() => handleReject(loto)}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Reject LOTO</span>
                      </button>
                    </>
                  )}
                  {loto.status === "pending_handover_verification" && (
                    <>
                      <button className="action-button success" onClick={handleApproveHandover}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Approve Handover</span>
                      </button>
                      <button className="action-button danger" onClick={handleRejectHandover}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>Reject Handover</span>
                      </button>
                    </>
                  )}
                  {loto.status === "rejected" && (
                    <button className="action-button warning" onClick={handleUpdate}>
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Edit LOTO</span>
                    </button>
                  )}
                  {loto.status === "active" && (
                    <>
                      <button className="action-button info" onClick={() => handleHandover(loto)}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Handover</span>
                      </button>
                      <button className="action-button success" onClick={handleComplete}>
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Complete</span>
                      </button>
                    </>
                  )}
                  
                  {/* Handover Button - Available for Current Responsible User or Admin */}
                  {(isAdmin || (currentUser && loto.currentResponsible && currentUser.id === loto.currentResponsible._id)) && (
                    <button className="action-button info" onClick={() => handleHandover(loto)}>
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Create Handover</span>
                    </button>
                  )}
                  
                  {/* Status Change Button - Always Available for Admins */}
                  <button className="action-button primary" onClick={() => handleStatusChange(loto)}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Change Status</span>
                  </button>
                </div>
              </div>
            )}

            {/* Edit Rejected LOTO */}
            {loto.status === "rejected" && isIsolator && isTechnician && (
              <div className="action-group edit-group">
                <div className="action-header">
                  <h5>Edit Required</h5>
                  <p>This LOTO was rejected and requires modification.</p>
                </div>
                <div className="action-button-container">
                  <button className="action-button warning" onClick={handleUpdate}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Edit LOTO</span>
                  </button>
                </div>
              </div>
            )}

            {/* Technician Actions */}
            {loto.status === "active" && isTechnician && (isIsolator || isHandoverRecipient) && (
              <div className="action-group technician-group">
                <div className="action-header">
                  <h5>Technician Actions</h5>
                  <p>Available operations for technicians.</p>
                </div>
                <div className="action-buttons">
                  <button className="action-button primary" onClick={handleUpdate}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Update</span>
                  </button>
                  {isIsolator && (
                    <button className="action-button info" onClick={() => handleHandover(loto)}>
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Handover</span>
                    </button>
                  )}
                  <button className="action-button success" onClick={handleComplete}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Complete</span>
                  </button>
                </div>
              </div>
            )}

            {/* Update Button for Isolator (Pending) */}
            {loto.status === "pending_verification_new" && isIsolator && (
              <div className="action-group update-group">
                <div className="action-header">
                  <h5>Update Required</h5>
                  <p>You can update the LOTO details while pending.</p>
                </div>
                <div className="action-button-container">
                  <button className="action-button primary " onClick={handleUpdate}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Update Details</span>
                  </button>
                </div>
              </div>
            )}

            {/* Supervisor/Admin Full Actions */}
            {loto.status === "active" && isIsolator && (isSupervisor || currentUser?.role === "admin") && (
              <div className="action-group supervisor-group">
                <div className="action-header">
                  <h5>{currentUser?.role === "admin" ? "Admin" : "Supervisor"} Actions</h5>
                  <p>Full administrative operations available.</p>
                </div>
                <div className="action-buttons">
                  <button className="action-button primary" onClick={handleUpdate}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Update</span>
                  </button>
                  <button className="action-button info" onClick={() => handleHandover(loto)}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Handover</span>
                  </button>
                  <button className="action-button success" onClick={handleComplete}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Complete</span>
                  </button>
                </div>
              </div>
            )}

            {/* Status Information */}
            <div className="status-info-section">
              <div className="status-header">
                <h5>Current Status</h5>
                <div className="status-badge-large">{getStatusBadge(loto.status)}</div>
              </div>
              <div className="status-description">
                {loto.status === "pending_verification_new" && "⏳ Awaiting supervisor verification"}
                {loto.status === "pending_handover_verification" && "🤝 Waiting for handover verification"}
                {loto.status === "active" && "✅ Maintenance in progress"}
                {loto.status === "completed" && "🏁 Work completed and LOTO closed"}
                {loto.status === "rejected" && "❌ LOTO rejected - requires modification"}
              </div>
            </div>

            {/* Rejection Information */}
            {loto.status === "rejected" && (
              <div className="action-group rejection-group">
                <div className="action-header">
                  <h5>Rejection Details</h5>
                  <p>This LOTO was rejected and requires modification.</p>
                </div>
                <div className="rejection-details">
                  <div className="rejection-info">
                    <div className="rejection-field">
                      <label>Rejected By:</label>
                      <span>{loto.rejectedBy ? `${loto.rejectedBy.firstName} ${loto.rejectedBy.lastName}` : 'Unknown'}</span>
                    </div>
                    <div className="rejection-field">
                      <label>Rejected At:</label>
                      <span>{loto.rejectedAt ? new Date(loto.rejectedAt).toLocaleString() : 'Unknown'}</span>
                    </div>
                    <div className="rejection-field">
                      <label>Rejection Notes:</label>
                      <div className="rejection-notes">{loto.rejectionNotes || 'No notes provided'}</div>
                    </div>
                    {loto.rejectedFields && loto.rejectedFields.length > 0 && (
                      <div className="rejection-field">
                        <label>Fields Requiring Correction:</label>
                        <div className="rejected-fields-list">
                          {loto.rejectedFields.map((field, index) => (
                            <span key={index} className="rejected-field-badge">
                              {field === 'shift' && 'Shift'}
                              {field === 'location' && 'Location'}
                              {field === 'line' && 'Line'}
                              {field === 'machine' && 'Machine'}
                              {field === 'isolatedPart' && 'Isolated Part'}
                              {field === 'reason' && 'Reason'}
                              {field === 'ptwNumber' && 'PTW Number'}
                              {field === 'expectedDuration' && 'Expected Duration'}
                              {field === 'supervisor' && 'Supervisor Assignment'}
                              {field === 'energyTypes' && 'Energy Types'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delete Button for Admins */}
            {currentUser?.role === "admin" && (
              <div className="action-group delete-group">
                <div className="action-header">
                  <h5>Danger Zone</h5>
                  <p>Permanently delete this LOTO record.</p>
                </div>
                <div className="action-button-container">
                  <button className="action-button danger" onClick={handleDelete}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Delete LOTO Permanently</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
        currentStatus={loto?.status}
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

export default LOTOdetail;
