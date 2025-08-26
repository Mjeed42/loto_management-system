import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateLOTO = () => {
  const [formData, setFormData] = useState({
    expectedDuration: "",
    reason: "",
    ptwNumber: "N/A",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTO();
  }, [id]);

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

      setFormData({
        expectedDuration: res.data.data.expectedDuration,
        reason: res.data.data.reason,
        ptwNumber: res.data.data.ptwNumber,
      });

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching LOTO");
      setLoading(false);
    }
  };

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

      await axios.put(`http://localhost:5000/api/loto/${id}`, formData, config);

      alert("LOTO updated successfully!");
      navigate("/loto-list");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating LOTO");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading LOTO details...</h2>
      </div>
    );
  }

  const { expectedDuration, reason, ptwNumber } = formData;

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
        <h1>Update LOTO</h1>
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
            Reason:
          </label>
          <input
            type="text"
            name="reason"
            value={reason}
            onChange={onChange}
            placeholder="Enter reason"
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
            PTW Number:
          </label>
          <input
            type="text"
            name="ptwNumber"
            value={ptwNumber}
            onChange={onChange}
            placeholder="Enter PTW number or N/A"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Expected Duration (hours):
          </label>
          <input
            type="number"
            name="expectedDuration"
            value={expectedDuration}
            onChange={onChange}
            placeholder="Enter duration in hours"
            step="0.5"
            min="0.5"
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

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {submitting ? "Updating..." : "Update LOTO"}
        </button>
      </form>
    </div>
  );
};

export default UpdateLOTO;
