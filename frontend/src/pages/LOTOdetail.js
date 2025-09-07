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
      console.log("Error fetching current user");
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

      // Refresh the page to show updated status
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

      // Refresh the page to show updated status
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

      // Refresh the page to show updated status
      fetchLOTO();
    } catch (err) {
      alert(err.response?.data?.message || "Error verifying LOTO");
    }
  };

  const handleUpdate = async () => {
    navigate(`/loto/${id}/update`);
  };

  const handleHandover = async () => {
    navigate(`/loto/${id}/handover`);
  };

  const handleComplete = async () => {
    navigate(`/loto/${id}/complete`);
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
      <div className="alert alert-danger">
        <Icon name="warning" /> {error}
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: "Pending", variant: "warning" },
      active: { text: "Active", variant: "success" },
      completed: { text: "Completed", variant: "secondary" },
      pending_handover: { text: "Pending Handover", variant: "info" },
    };

    const config = statusConfig[status] || {
      text: status,
      variant: "secondary",
    };

    return (
      <span className={`badge bg-${config.variant} badge-pill`}>
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
    (currentUser.role === "manager" || currentUser.role === "admin");
  const isTechnician = currentUser && currentUser.role === "technician";
  const isSupervisor = currentUser && currentUser.role === "supervisor";
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <Icon name="document" /> LOTO Details
        </h1>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={fetchLOTO}>
            <Icon name="refresh" /> Refresh
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/loto-list")}
          >
            <Icon name="back" /> Back to List
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <Icon name="warning" /> {error}
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <Icon name="info" /> LOTO Information
              </h5>
              <div className="d-flex gap-2">{getStatusBadge(loto.status)}</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Serial Number:</strong> {loto.serialNumber}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(loto.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Shift:</strong> {loto.shift}
                  </p>
                  <p>
                    <strong>Isolator:</strong> {loto.isolatorName}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Isolated Part:</strong> {loto.isolatedPart}
                  </p>
                  <p>
                    <strong>Reason:</strong> {loto.reason}
                  </p>
                  <p>
                    <strong>PTW Number:</strong> {loto.ptwNumber}
                  </p>
                  <p>
                    <strong>Expected Duration:</strong> {loto.expectedDuration}{" "}
                    hours
                  </p>
                </div>
              </div>

              {loto.verifiedBy && (
                <div className="mt-3 p-3 bg-light rounded">
                  <p>
                    <strong>Verified By:</strong> {loto.verifiedBy.firstName}{" "}
                    {loto.verifiedBy.lastName}
                  </p>
                  <p>
                    <strong>Verified At:</strong>{" "}
                    {new Date(loto.verifiedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {loto.handoverNotes && (
                <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
                  <p>
                    <strong>Handover Notes:</strong> {loto.handoverNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <Icon name="actions" /> Actions
              </h5>
            </div>
            <div className="card-body">
              {/* Handover Acceptance Section */}
              {loto.status === "pending_handover" && isHandoverRecipient && (
                <div className="mb-4 p-3 bg-info bg-opacity-10 rounded">
                  <h6 className="mb-3">
                    <Icon name="handover" /> Handover Request
                  </h6>
                  <p className="mb-3">
                    You have been requested to take over this LOTO. Accepting
                    will reset the LOTO to pending status requiring
                    re-verification.
                  </p>
                  <div className="d-flex gap-2">
                    <Button variant="success" onClick={handleAcceptHandover}>
                      <Icon name="check" /> Accept Handover
                    </Button>
                    <Button variant="danger" onClick={handleRejectHandover}>
                      <Icon name="cancel" /> Reject Handover
                    </Button>
                  </div>
                </div>
              )}

              {/* Verification Section */}
              {loto.status === "pending" && canVerify && (
                <div className="mb-4 p-3 bg-warning bg-opacity-10 rounded">
                  <h6 className="mb-3">
                    <Icon name="verify" /> Pending Verification
                  </h6>
                  <p className="mb-3">
                    This LOTO requires verification before it can be activated.
                  </p>
                  <Button
                    variant="success"
                    onClick={handleVerify}
                    className="w-100"
                  >
                    <Icon name="check" /> Verify LOTO
                  </Button>
                </div>
              )}

              {/* Technician Actions */}
              {loto.status === "active" && isIsolator && isTechnician && (
                <div className="mb-4">
                  <h6 className="mb-3">
                    <Icon name="tools" /> Technician Actions
                  </h6>
                  <div className="d-grid gap-2">
                    <Button variant="info" onClick={handleHandover}>
                      <Icon name="handover" /> Handover LOTO
                    </Button>
                    <Button variant="success" onClick={handleComplete}>
                      <Icon name="check" /> Complete LOTO
                    </Button>
                  </div>
                </div>
              )}
              {loto.status === "pending" && isIsolator && isTechnician && (
                <div className="mb-4">
                  <h6 className="mb-3">
                    <Icon name="tools" /> Technician Actions
                  </h6>
                  <div className="d-grid gap-2">
                    <Button variant="primary" onClick={handleUpdate}>
                      <Icon name="edit" /> Update LOTO
                    </Button>
                  </div>
                </div>
              )}
              {/* Supervisor Actions */}
              {loto.status === "active" && isIsolator && isSupervisor && (
                <div className="mb-4">
                  <h6 className="mb-3">
                    <Icon name="tools" /> Supervisor Actions
                  </h6>
                  <div className="d-grid gap-2">
                    <Button variant="primary" onClick={handleUpdate}>
                      <Icon name="edit" /> Update LOTO
                    </Button>
                    <Button variant="info" onClick={handleHandover}>
                      <Icon name="handover" /> Handover LOTO
                    </Button>
                    <Button variant="success" onClick={handleComplete}>
                      <Icon name="check" /> Complete LOTO
                    </Button>
                  </div>
                </div>
              )}
              {/* admin Actions */}
              {loto.status === "active" && currentUser.role === "admin" && (
                <div className="mb-4">
                  <h6 className="mb-3">
                    <Icon name="tools" /> Admin Actions
                  </h6>
                  <div className="d-grid gap-2">
                    <Button variant="primary" onClick={handleUpdate}>
                      <Icon name="edit" /> Update LOTO
                    </Button>
                    <Button variant="info" onClick={handleHandover}>
                      <Icon name="handover" /> Handover LOTO
                    </Button>
                    <Button variant="success" onClick={handleComplete}>
                      <Icon name="check" /> Complete LOTO
                    </Button>
                  </div>
                </div>
              )}

              {/* Status Information */}
              <div className="p-3 bg-light rounded">
                <h6 className="mb-3">
                  <Icon name="status" /> Current Status
                </h6>
                <p className="mb-2">
                  <strong>Status:</strong> {getStatusBadge(loto.status)}
                </p>
                {loto.status === "pending" && (
                  <p className="mb-0 text-muted">
                    <Icon name="info" /> Awaiting verification by manager/admin
                  </p>
                )}
                {loto.status === "pending_handover" && (
                  <p className="mb-0 text-muted">
                    <Icon name="info" /> Awaiting handover acceptance
                  </p>
                )}
                {loto.status === "active" && (
                  <p className="mb-0 text-muted">
                    <Icon name="info" /> LOTO is currently active
                  </p>
                )}
                {loto.status === "completed" && (
                  <p className="mb-0 text-muted">
                    <Icon name="info" /> LOTO has been completed
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LOTOdetail;
