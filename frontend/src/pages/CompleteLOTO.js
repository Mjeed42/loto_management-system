import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CompleteLOTO = () => {
  const { id } = useParams(); // get LOTO ID from route
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    actualFinishDate: today,
    actualFinishTime: "",
    completionNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          "https://loto-backend-643788243736.europe-west1.run.app/api/auth/me",
          config
        );
        setCurrentUser(res.data.user);
      } catch (err) {
        console.log("Error fetching current user", err);
      }
    };

    fetchCurrentUser();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const completeData = {
        actualFinishDate: formData.actualFinishDate || today,
        actualFinishTime: formData.actualFinishTime || new Date().toISOString(),
        completionNotes: formData.completionNotes,
      };

      await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}/complete`,
        completeData,
        config
      );

      alert("LOTO completed successfully!");
      navigate("/loto-list");
    } catch (err) {
      setError(err.response?.data?.message || "Error completing LOTO");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>Complete LOTO</h1>
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
          <label>Actual Finish Date:</label>
          <input
            type="date"
            name="actualFinishDate"
            value={formData.actualFinishDate}
            onChange={onChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Actual Finish Time:</label>
          <input
            type="time"
            name="actualFinishTime"
            value={formData.actualFinishTime}
            onChange={onChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Completion Notes:</label>
          <textarea
            name="completionNotes"
            value={formData.completionNotes}
            onChange={onChange}
            placeholder="Enter completion notes (work completed, any issues, recommendations, etc.)"
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
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {submitting ? "Completing..." : "Complete LOTO"}
        </button>
      </form>
    </div>
  );
};

export default CompleteLOTO;
