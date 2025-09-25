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
    <div className="animate-fade-in">
      {/* Header Section — IDENTICAL TO CREATELOTO */}
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
                      📄
                    </span>
                    LOTO Details - {loto.serialNumber}
                  </h1>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    variant="outline-secondary"
                    onClick={fetchLOTO}
                    className="hover-scale"
                  >
                    <span className="me-2">🔄</span> Refresh
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/loto-list")}
                    className="hover-scale"
                  >
                    <span className="me-2">⬅️</span> Back to List
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

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4">
          <span className="me-3" style={{ fontSize: "1.5rem" }}>
            ⚠️
          </span>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      <div className="row">
        {/* Main Info Card — STYLED LIKE CREATELOTO */}
        <div className="col-lg-8 mb-4">
          <div className="card bg-glass border-0 shadow-lg">
            <div className="card-header bg-light border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">📋 LOTO Information</h5>
                <div>{getStatusBadge(loto.status)}</div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Serial Number:</strong>{" "}
                    <span className="fw-medium">{loto.serialNumber}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Date Created:</strong>{" "}
                    <span className="fw-medium">
                      {new Date(loto.date).toLocaleString()}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong>Shift:</strong>{" "}
                    <span className="fw-medium">{loto.shift}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Isolator:</strong>{" "}
                    <span className="fw-medium">{loto.isolatorName}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Location Path:</strong>{" "}
                    <span className="fw-medium text-info">{locationPath}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-2">
                    <strong>Authorized Supervisor:</strong>{" "}
                    {loto.supervisorName ? (
                      <span className="fw-medium text-success">
                        {loto.supervisorName}
                      </span>
                    ) : (
                      <span className="text-muted">None assigned</span>
                    )}
                  </p>
                  <p className="mb-2">
                    <strong>Isolated Part:</strong>{" "}
                    <span className="fw-medium">{loto.isolatedPart}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Reason:</strong>{" "}
                    <span className="fw-medium">{loto.reason}</span>
                  </p>
                  <p className="mb-2">
                    <strong>PTW Number:</strong>{" "}
                    <span className="fw-medium">{loto.ptwNumber}</span>
                  </p>
                  <p className="mb-2">
                    <strong>Expected Duration:</strong>{" "}
                    <span className="fw-medium">
                      {loto.expectedDuration} hours
                    </span>
                  </p>
                  <div className="cf-mt-3">
                    <p>
                      <strong>Energy Types to Isolate:</strong>
                    </p>
                    {loto.energyTypes && loto.energyTypes.length > 0 ? (
                      <div className="cf-flex cf-flex-wrap cf-gap-2">
                        {loto.energyTypes.map((energy, index) => (
                          <div key={index} className="cf-card cf-card-sm">
                            <div className="cf-card-body cf-p-2">
                              <div className="cf-flex cf-items-center">
                                <span className="cf-badge cf-badge-info cf-badge-pill cf-mr-2">
                                  {energy.type}
                                </span>
                                <span className="cf-text-muted cf-text-sm">
                                  {energy.isolationPoint}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="cf-text-muted">None specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Verified By */}
              {loto.verifiedBy && (
                <div className="mt-4 p-3 bg-light border rounded">
                  <h6 className="fw-bold mb-2">✅ Verified By</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {loto.verifiedBy.firstName}{" "}
                    {loto.verifiedBy.lastName}
                  </p>
                  <p className="mb-0">
                    <strong>At:</strong>{" "}
                    {new Date(loto.verifiedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Handover Notes */}
              {loto.handoverNotes && (
                <div className="mt-4 p-3 bg-info bg-opacity-10 border rounded">
                  <h6 className="fw-bold mb-2">🤝 Handover Notes</h6>
                  <p className="mb-0">{loto.handoverNotes}</p>
                </div>
              )}

              {/* Completion Notes */}
              {loto.completionNotes && (
                <div className="mt-4 p-3 bg-success bg-opacity-10 border rounded">
                  <h6 className="fw-bold mb-2">🏁 Completion Notes</h6>
                  <p className="mb-0">{loto.completionNotes}</p>
                </div>
              )}

              {/* Actual Finish Time */}
              {loto.actualFinishTime && (
                <div className="mt-4 p-3 bg-secondary bg-opacity-10 border rounded">
                  <h6 className="fw-bold mb-2">⏱️ Actual Finish</h6>
                  <p className="mb-1">
                    <strong>Time:</strong>{" "}
                    {new Date(loto.actualFinishTime).toLocaleTimeString()}
                  </p>
                  <p className="mb-0">
                    <strong>Date:</strong>{" "}
                    {new Date(loto.actualFinishDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Card — FULLY STYLED + DELETE BUTTON */}
        <div className="col-lg-4">
          <div className="card bg-glass border-0 shadow-lg mb-4">
            <div className="card-header bg-light border-0">
              <h5 className="mb-0 fw-bold">⚡ Actions</h5>
            </div>
            <div className="card-body">
              {/* Handover Acceptance */}
              {loto.status === "pending_handover" && isHandoverRecipient && (
                <div className="mb-4 p-3 bg-info bg-opacity-10 rounded">
                  <h6 className="fw-bold mb-2">🤝 Handover Requested</h6>
                  <p className="mb-3 small">
                    You’ve been asked to take over this LOTO. Accepting resets
                    it to pending.
                  </p>
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      onClick={handleAcceptHandover}
                      className="hover-scale flex-grow-1"
                    >
                      ✅ Accept
                    </Button>
                    <Button
                      variant="danger"
                      onClick={handleRejectHandover}
                      className="hover-scale flex-grow-1"
                    >
                      ❌ Reject
                    </Button>
                  </div>
                </div>
              )}

              {/* Verification */}
              {loto.status === "pending" && canVerify && (
                <div className="mb-4 p-3 bg-warning bg-opacity-10 rounded">
                  <Button
                    variant="success"
                    onClick={handleVerify}
                    className="w-100 hover-scale"
                  >
                    ✅ Verify LOTO
                  </Button>
                </div>
              )}

              {/* Technician Actions */}
              {loto.status === "active" && isIsolator && isTechnician && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">🛠️ Technician Actions</h6>
                  <div className="d-grid gap-2">
                    <Button
                      variant="info"
                      onClick={handleHandover}
                      className="hover-scale"
                    >
                      🤝 Handover
                    </Button>
                    <Button
                      variant="success"
                      onClick={handleComplete}
                      className="hover-scale"
                    >
                      🏁 Complete
                    </Button>
                  </div>
                </div>
              )}

              {/* Update Button for Isolator (Pending) */}
              {loto.status === "pending" && isIsolator && (
                <div className="mb-4 p-3 bg-warning bg-opacity-10 rounded">
                  <Button
                    variant="primary"
                    onClick={handleUpdate}
                    className="w-100 hover-scale"
                  >
                    ✏️ Update Details
                  </Button>
                </div>
              )}

              {/* Supervisor/Admin Full Actions */}
              {loto.status === "active" &&
                isIsolator &&
                (isSupervisor || currentUser?.role === "admin") && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      {currentUser?.role === "admin"
                        ? "👑 Admin"
                        : "👷 Supervisor"}{" "}
                      Actions
                    </h6>
                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        onClick={handleUpdate}
                        className="hover-scale"
                      >
                        ✏️ Update
                      </Button>
                      <Button
                        variant="info"
                        onClick={handleHandover}
                        className="hover-scale"
                      >
                        🤝 Handover
                      </Button>
                      <Button
                        variant="success"
                        onClick={handleComplete}
                        className="hover-scale"
                      >
                        🏁 Complete
                      </Button>
                    </div>
                  </div>
                )}

              {/* Status Info */}
              <div className="p-3 bg-light border rounded mt-4">
                <h6 className="fw-bold mb-2">📌 Current Status</h6>
                <div className="mb-2">{getStatusBadge(loto.status)}</div>
                <small className="text-muted">
                  {loto.status === "pending" &&
                    "⏳ Awaiting supervisor verification"}
                  {loto.status === "pending_handover" &&
                    "🤝 Waiting for handover acceptance"}
                  {loto.status === "active" && "✅ Maintenance in progress"}
                  {loto.status === "completed" &&
                    "🏁 Work completed and LOTO closed"}
                </small>
              </div>

              {/* 🗑️ DELETE BUTTON FOR ADMINS — STYLED LIKE CREATELOTO */}
              {currentUser?.role === "admin" && (
                <div className="mt-4 p-3 bg-danger bg-opacity-10 rounded">
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="w-100 hover-scale"
                  >
                    🗑️ Delete LOTO Permanently
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LOTOdetail;
