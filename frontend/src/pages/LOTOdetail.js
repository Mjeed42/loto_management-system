import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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

      const res = await axios.get("http://localhost:5000/api/auth/me", config);
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
        `http://localhost:5000/api/loto/${id}`,
        config
      );
      setLoto(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching LOTO");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading LOTO details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "20px",
          margin: "20px",
          borderRadius: "4px",
        }}
      >
        {error}
      </div>
    );
  }

  if (!loto) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>LOTO not found</h2>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { backgroundColor: "#ffc107", color: "#000" },
      active: { backgroundColor: "#28a745", color: "#fff" },
      completed: { backgroundColor: "#6c757d", color: "#fff" },
      handover: { backgroundColor: "#17a2b8", color: "#fff" },
    };

    return (
      <span
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          ...statusStyles[status],
        }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>LOTO Details</h1>
        <button
          onClick={() => navigate("/loto-list")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to List
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          // In the basic information section, add:
          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>
              Basic Information
            </h3>
            <p>
              <strong>Serial Number:</strong> {loto.serialNumber}
            </p>
            <p>
              <strong>Date:</strong> {new Date(loto.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Shift:</strong> {loto.shift}
            </p>
            <p>
              <strong>Status:</strong> {getStatusBadge(loto.status)}
            </p>
          </div>
          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>
              Equipment Information
            </h3>
            <p>
              <strong>Isolated Part:</strong> {loto.isolatedPart}
            </p>
            <p>
              <strong>Reason:</strong> {loto.reason}
            </p>
            <p>
              <strong>PTW Number:</strong> {loto.ptwNumber}
            </p>
          </div>
          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>Timing</h3>
            <p>
              <strong>Expected Duration:</strong> {loto.expectedDuration} hours
            </p>
            {loto.actualStartTime && (
              <p>
                <strong>Actual Start Time:</strong>{" "}
                {new Date(loto.actualStartTime).toLocaleString()}
              </p>
            )}
          </div>
          <div>
            <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>
              Personnel
            </h3>
            <p>
              <strong>Isolator:</strong> {loto.isolator?.firstName}{" "}
              {loto.isolator?.lastName}
            </p>
            {loto.verifiedBy && (
              <p>
                <strong>Verified By:</strong> {loto.verifiedBy?.firstName}{" "}
                {loto.verifiedBy?.lastName}
              </p>
            )}
          </div>
        </div>
      </div>

      {loto.status === "active" &&
        currentUser &&
        currentUser.id === loto.isolator._id && (
          <div
            style={{
              backgroundColor: "#e3f2fd",
              padding: "20px",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            <h3 style={{ margin: "0 0 15px 0" }}>Available Actions</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate(`/loto/${id}/update`)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Update LOTO
              </button>
              <button
                onClick={() => navigate(`/loto/${id}/handover`)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#17a2b8",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Handover
              </button>
              <button
                onClick={() => navigate(`/loto/${id}/complete`)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Complete LOTO
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default LOTOdetail;
