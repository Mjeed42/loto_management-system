import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const LOTOdetail = () => {
  const [loto, setLoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTO();
    fetchCurrentUser();
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

  const handleAcceptHandover = async () => {
    if (
      !window.confirm(
        "Are you sure you want to accept this handover? The LOTO will be reset to pending status and require re-verification."
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

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}/accept-handover`,
        {},
        config
      );

      setLoto(res.data.data);
      alert(
        "Handover accepted successfully! The LOTO has been reset to pending status and requires re-verification."
      );
      fetchLOTO();
    } catch (err) {
      alert(err.response?.data?.message || "Error accepting handover");
    }
  };

  const handleRejectHandover = async () => {
    if (!window.confirm("Are you sure you want to reject this handover?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}/reject-handover`,
        {},
        config
      );

      setLoto(res.data.data);
      alert("Handover rejected successfully!");
      fetchLOTO();
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting handover");
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
  const handleHandover = () => navigate(`/loto/${id}/handover`);
  const handleComplete = () => navigate(`/loto/${id}/complete`);

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
      pending: { text: "⏳ Pending", variant: "warning" },
      active: { text: "✅ Active", variant: "success" },
      completed: { text: "🏁 Completed", variant: "secondary" },
      pending_handover: { text: "🤝 Pending Handover", variant: "info" },
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
    (currentUser.role === "supervisor" || currentUser.role === "admin");
  const isTechnician = currentUser && currentUser.role === "technician";
  const isSupervisor = currentUser && currentUser.role === "supervisor";

  return (
    <div className="loto-details-container animate-fade-in">
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
            {/* Handover Acceptance */}
            {loto.status === "pending_handover" && isHandoverRecipient && (
              <div className="action-group handover-group">
                <div className="action-header">
                  <h5>Handover Requested</h5>
                  <p>You've been asked to take over this LOTO. Accepting resets it to pending.</p>
                </div>
                <div className="action-buttons">
                  <button className="action-button success" onClick={handleAcceptHandover}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Accept</span>
                  </button>
                  <button className="action-button danger" onClick={handleRejectHandover}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            )}

            {/* Verification */}
            {loto.status === "pending" && canVerify && (
              <div className="action-group verification-group">
                <div className="action-header">
                  <h5>Verification Required</h5>
                  <p>This LOTO is pending supervisor verification.</p>
                </div>
                <div className="action-button-container">
                  <button className="action-button success " onClick={handleVerify}>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Verify LOTO</span>
                  </button>
                </div>
              </div>
            )}

            {/* Technician Actions */}
            {loto.status === "active" && isIsolator && isTechnician && (
              <div className="action-group technician-group">
                <div className="action-header">
                  <h5>Technician Actions</h5>
                  <p>Available operations for technicians.</p>
                </div>
                <div className="action-buttons">
                  <button className="action-button info" onClick={handleHandover}>
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

            {/* Update Button for Isolator (Pending) */}
            {loto.status === "pending" && isIsolator && (
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
                  <button className="action-button info" onClick={handleHandover}>
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
                {loto.status === "pending" && "⏳ Awaiting supervisor verification"}
                {loto.status === "pending_handover" && "🤝 Waiting for handover acceptance"}
                {loto.status === "active" && "✅ Maintenance in progress"}
                {loto.status === "completed" && "🏁 Work completed and LOTO closed"}
              </div>
            </div>

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
    </div>
  );
};

export default LOTOdetail;
