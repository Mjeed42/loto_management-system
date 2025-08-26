import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateLOTO = () => {
  const [formData, setFormData] = useState({
    shift: "A",
    isolatedPart: "",
    reason: "",
    ptwNumber: "N/A",
    expectedDuration: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { shift, isolatedPart, reason, ptwNumber, expectedDuration } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        "http://localhost:5000/api/loto",
        formData,
        config
      );

      alert("LOTO created successfully!");
      // Reset form
      setFormData({
        shift: "A",
        isolatedPart: "",
        reason: "",
        ptwNumber: "N/A",
        expectedDuration: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error creating LOTO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px" }}>
      <h1>Create New LOTO</h1>

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
            Shift:
          </label>
          <select
            name="shift"
            value={shift}
            onChange={onChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Isolated Part:
          </label>
          <input
            type="text"
            name="isolatedPart"
            value={isolatedPart}
            onChange={onChange}
            placeholder="Enter part description"
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
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Creating..." : "Create LOTO"}
        </button>
      </form>
    </div>
  );
};

export default CreateLOTO;
