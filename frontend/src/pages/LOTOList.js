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

      const res = await axios.get("http://localhost:5000/api/auth/me", config);
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

      const res = await axios.get("http://localhost:5000/api/loto", config);
      setLotos(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching LOTOs");
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
        `http://localhost:5000/api/loto/${lotoId}/verify`,
        {},
        config
      );

      setLotos(
        lotos.map((loto) => (loto._id === lotoId ? res.data.data : loto))
      );

      alert("LOTO verified successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error verifying LOTO");
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
      pending: { text: "Pending", variant: "warning" },
      active: { text: "Active", variant: "success" },
      completed: { text: "Completed", variant: "secondary" },
      pending_handover: { text: "Pending Handover", variant: "info" },
      handover: { text: "Handover", variant: "info" },
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading LOTOs...</p>
      </div>
    );
  }

  const canVerify =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "supervisor");
  const isTechnician = currentUser && currentUser.role === "technician";

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <Icon name="list" /> LOTO List
        </h1>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={fetchLOTOs}>
            <Icon name="refresh" /> Refresh
          </Button>
          <Button variant="primary" onClick={() => navigate("/create-loto")}>
            <Icon name="add" /> Create LOTO
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/dashboard")}
          >
            <Icon name="dashboard" /> Dashboard
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <Icon name="warning" /> {error}
        </div>
      )}

      {lotos.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <h3 className="mb-3">No LOTOs found</h3>
          <p className="mb-4">
            Create your first lockout/tagout request to get started.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="primary" onClick={() => navigate("/create-loto")}>
              <Icon name="add" /> Create New LOTO
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/dashboard")}
            >
              <Icon name="dashboard" /> Go to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Shift</th>
                    <th>Isolator</th>
                    <th>Part</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lotos.map((loto) => (
                    <tr key={loto._id}>
                      <td>{new Date(loto.date).toLocaleDateString()}</td>
                      <td>{loto.shift}</td>
                      <td>
                        {loto.isolator?.firstName} {loto.isolator?.lastName}
                      </td>
                      <td>{loto.isolatedPart}</td>
                      <td>{loto.reason}</td>
                      <td>{getStatusBadge(loto.status)}</td>
                      <td>{loto.expectedDuration} hrs</td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {canVerify && loto.status === "pending" && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleVerify(loto._id)}
                            >
                              <Icon name="check" /> Verify
                            </Button>
                          )}

                          {isTechnician &&
                            (loto.status === "active" ||
                              loto.status === "handover") && (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleUpdate(loto._id)}
                                >
                                  <Icon name="edit" /> Update
                                </Button>
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleHandover(loto._id)}
                                >
                                  <Icon name="handover" /> Handover
                                </Button>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleComplete(loto._id)}
                                >
                                  <Icon name="check" /> Complete
                                </Button>
                              </>
                            )}

                          {(loto.status === "active" ||
                            loto.status === "completed") &&
                            !canVerify &&
                            !isTechnician && (
                              <span className="text-muted">-</span>
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
  );
};

export default LOTOList;
