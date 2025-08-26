import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

      // Update the LOTO in the list
      setLotos(
        lotos.map((loto) => (loto._id === lotoId ? res.data.data : loto))
      );

      alert("LOTO verified successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error verifying LOTO");
    }
  };

  // In the action buttons section, update the onClick handlers:
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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading LOTOs...</h2>
      </div>
    );
  }

  // Check if current user is admin or supervisor
  const canVerify =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "supervisor");
  const isTechnician = currentUser && currentUser.role === "technician";

  return (
    <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>LOTO List</h1>
        <button
          onClick={fetchLOTOs}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {lotos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            backgroundColor: "#f8f9fa",
            borderRadius: "5px",
          }}
        >
          <h3>No LOTOs found</h3>
          <p>
            Click "Create New LOTO" to create your first lockout/tagout request.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Date
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Shift
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Isolator
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Part
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Reason
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Duration
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #dee2e6",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {lotos.map((loto) => (
                <tr
                  key={loto._id}
                  style={{ borderBottom: "1px solid #dee2e6" }}
                >
                  <td style={{ padding: "12px" }}>
                    {new Date(loto.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px" }}>{loto.shift}</td>
                  <td style={{ padding: "12px" }}>
                    {loto.isolator?.firstName} {loto.isolator?.lastName}
                  </td>
                  <td style={{ padding: "12px" }}>{loto.isolatedPart}</td>
                  <td style={{ padding: "12px" }}>{loto.reason}</td>
                  <td style={{ padding: "12px" }}>
                    {getStatusBadge(loto.status)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {loto.expectedDuration} hrs
                  </td>
                  <td style={{ padding: "12px" }}>
                    {canVerify && loto.status === "pending" && (
                      <button
                        onClick={() => handleVerify(loto._id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          marginRight: "5px",
                        }}
                      >
                        Verify
                      </button>
                    )}

                    {isTechnician &&
                      (loto.status === "active" ||
                        loto.status === "handover") && (
                        <div>
                          <button
                            onClick={() => handleUpdate(loto._id)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              marginRight: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleHandover(loto._id)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#17a2b8",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              marginRight: "5px",
                              marginBottom: "5px",
                            }}
                          >
                            Handover
                          </button>
                          <button
                            onClick={() => handleComplete(loto._id)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Complete
                          </button>
                        </div>
                      )}

                    {loto.status === "active" &&
                      !canVerify &&
                      !isTechnician && (
                        <span style={{ fontSize: "12px", color: "#6c757d" }}>
                          Active
                        </span>
                      )}
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
