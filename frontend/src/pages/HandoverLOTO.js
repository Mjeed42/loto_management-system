import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const HandoverLOTO = () => {
  const [formData, setFormData] = useState({
    handoverTo: "",
    handoverNotes: "",
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/users/technicians",
        config
      );

      // Make sure we're accessing the data correctly
      const technicians =
        res.data.data?.technicians || res.data.technicians || [];
      setUsers(technicians);
      setFilteredUsers(technicians);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        "Error fetching users: " + (err.response?.data?.message || err.message)
      );
      setUsers([]);
      setFilteredUsers([]);
      setLoading(false);
    }
  };

  function onChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onUserSelect = (userId) => {
    setFormData({ ...formData, handoverTo: userId });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (!formData.handoverTo) {
      setError("Please select a technician to handover to");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const handoverData = {
        handoverTo: formData.handoverTo,
        handoverNotes: formData.handoverNotes,
      };

      await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}/handover`,
        handoverData,
        config
      );

      alert("LOTO handed over successfully!");
      navigate("/loto-list");
    } catch (err) {
      setError(err.response?.data?.message || "Error handing over LOTO");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading technicians...</h2>
      </div>
    );
  }

  const { handoverNotes } = formData;

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Handover LOTO</h1>
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

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Handover To:
          </label>

          {/* Searchable Dropdown */}
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              position: "relative",
              backgroundColor: "#fff",
            }}
          >
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search technicians..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {/* Dropdown List */}
            {searchTerm && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderTop: "none",
                  borderRadius: "0 0 4px 4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 1000,
                }}
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        onUserSelect(user._id);
                        setSearchTerm("");
                      }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f5f5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#fff")
                      }
                    >
                      {user.firstName} {user.lastName} ({user.username})
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "10px", color: "#666" }}>
                    No technicians found
                  </div>
                )}
              </div>
            )}

            {/* Selected User Display */}
            {formData.handoverTo && (
              <div
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#e9ecef",
                  margin: "5px",
                  borderRadius: "3px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {(() => {
                  const selectedUser = users.find(
                    (u) => u._id === formData.handoverTo
                  );
                  return selectedUser
                    ? `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.username})`
                    : "Selected user";
                })()}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, handoverTo: "" });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc3545",
                    cursor: "pointer",
                    fontSize: "16px",
                    padding: "0 5px",
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Handover Notes:
          </label>
          <textarea
            name="handoverNotes"
            value={handoverNotes}
            onChange={onChange}
            placeholder="Enter handover notes (current status, safety considerations, etc.)"
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {submitting ? "Processing Handover..." : "Handover LOTO"}
        </button>
      </form>
      
    </div>
  );
};

export default HandoverLOTO;
