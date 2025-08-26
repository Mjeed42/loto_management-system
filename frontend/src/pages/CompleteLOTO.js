import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CompleteLOTO = () => {
  const [formData, setFormData] = useState({
    actualFinishTime: "",
    actualFinishDate: "",
    completionNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

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
        actualFinishTime: formData.actualFinishTime || new Date().toISOString(),
        actualFinishDate:
          formData.actualFinishDate || new Date().toISOString().split("T")[0],
        completionNotes: formData.completionNotes,
      };

      await axios.put(
        `http://localhost:5000/api/loto/${id}/complete`,
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

  const { actualFinishTime, actualFinishDate, completionNotes } = formData;

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
          <label style={{ display: "block", marginBottom: "5px" }}>
            Actual Finish Date:
          </label>
          <input
            type="date"
            name="actualFinishDate"
            value={actualFinishDate}
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
          <label style={{ display: "block", marginBottom: "5px" }}>
            Actual Finish Time:
          </label>
          <input
            type="time"
            name="actualFinishTime"
            value={actualFinishTime}
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
          <label style={{ display: "block", marginBottom: "5px" }}>
            Completion Notes:
          </label>
          <textarea
            name="completionNotes"
            value={completionNotes}
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
