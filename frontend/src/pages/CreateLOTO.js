import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const CreateLOTO = () => {
  const [formData, setFormData] = useState({
    shift: "A",
    isolatedPart: "",
    reason: "",
    ptwNumber: "N/A",
    expectedDuration: "",
    supervisor: "", // NEW FIELD
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [technicians, setTechnicians] = useState([]); // NEW STATE FOR TECHNICIANS
  const [supervisors, setSupervisors] = useState([]); // NEW STATE FOR SUPERVISORS
  const [fetchingSupervisors, setFetchingSupervisors] = useState(true); // NEW LOADING STATE
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    shift,
    isolatedPart,
    reason,
    ptwNumber,
    expectedDuration,
    supervisor,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchTechnicians();
    fetchSupervisors();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch all technicians
      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/users/technicians",
        config
      );
      setTechnicians(res.data.users || res.data.data || []);
    } catch (err) {
      console.log(
        "Error fetching technicians:",
        err.response?.data?.message || err.message
      );
      setTechnicians([]); // Ensure it's always an array
    }
  };

  const fetchSupervisors = async () => {
    try {
      setFetchingSupervisors(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/users/supervisors",
        config
      );
      let supervisorsData = [];
      if (res.data.supervisors) {
        supervisorsData = res.data.supervisors;
      } else if (res.data.data && res.data.data.supervisors) {
        supervisorsData = res.data.data.supervisors;
      } else if (Array.isArray(res.data.data)) {
        supervisorsData = res.data.data;
      }

      // Ensure it's always an array
      supervisorsData = Array.isArray(supervisorsData) ? supervisorsData : [];

      setSupervisors(supervisorsData);
      setFetchingSupervisors(false);
    } catch (err) {
      console.error("Error fetching supervisors:", err);
      setError(err.response?.data?.message || "Error fetching supervisors");
      setSupervisors([]);
      setFetchingSupervisors(false);
    }
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

      const res = await axios.post(
        "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
        formData,
        config
      );

      // Show success notification
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/loto-list");
      }, 3000);

      // Reset form after successful submission
      setFormData({
        shift: "A",
        isolatedPart: "",
        reason: "",
        ptwNumber: "N/A",
        expectedDuration: "",
        supervisor: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error creating LOTO");
    } finally {
      setSubmitting(false);
    }
  };

  // Ensure technicians is always an array before mapping
  const safeTechnicians = Array.isArray(technicians) ? technicians : [];
  const safeSupervisors = Array.isArray(supervisors) ? supervisors : [];

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
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
                      ➕
                    </span>
                    Create New LOTO
                  </h1>
                  <p className="lead text-muted mb-0">
                    Start a new lockout/tagout procedure for equipment maintenance
                  </p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/loto-list")}
                    className="hover-scale"
                  >
                    <span className="me-2">⬅️</span> Back to List
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate("/dashboard")}
                    className="hover-scale"
                  >
                    <span className="me-2">🏠</span> Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="alert alert-success d-flex align-items-center mb-4">
          <span className="me-3" style={{ fontSize: "1.5rem" }}>
            ✅
          </span>
          <div>
            <strong>Success!</strong> LOTO created successfully.
          </div>
        </div>
      )}

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

      {/* Form Card */}
      <div className="row">
        <div className="col-12">
          <div className="card bg-glass border-0 shadow-lg">
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="row">
                  {/* Shift and Duration */}
                  <div className="col-md-6 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">Shift</label>
                      <select
                        name="shift"
                        value={shift}
                        onChange={onChange}
                        className="form-control"
                        style={{
                          borderRadius: "0.75rem",
                          border: "2px solid #e2e8f0",
                          background: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">
                        Expected Duration (hours)
                      </label>
                      <input
                        type="number"
                        name="expectedDuration"
                        value={expectedDuration}
                        onChange={onChange}
                        placeholder="Enter duration in hours"
                        step="0.5"
                        min="0.5"
                        className="form-control"
                        style={{
                          borderRadius: "0.75rem",
                          border: "2px solid #e2e8f0",
                          background: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Isolated Part */}
                  <div className="col-12 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">Isolated Part</label>
                      <input
                        type="text"
                        name="isolatedPart"
                        value={isolatedPart}
                        onChange={onChange}
                        placeholder="Enter part description"
                        className="form-control"
                        style={{
                          borderRadius: "0.75rem",
                          border: "2px solid #e2e8f0",
                          background: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="col-12 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">Reason</label>
                      <input
                        type="text"
                        name="reason"
                        value={reason}
                        onChange={onChange}
                        placeholder="Enter reason"
                        className="form-control"
                        style={{
                          borderRadius: "0.75rem",
                          border: "2px solid #e2e8f0",
                          background: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* PTW Number */}
                  <div className="col-12 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">PTW Number</label>
                      <input
                        type="text"
                        name="ptwNumber"
                        value={ptwNumber}
                        onChange={onChange}
                        placeholder="Enter PTW number or N/A"
                        className="form-control"
                        style={{
                          borderRadius: "0.75rem",
                          border: "2px solid #e2e8f0",
                          background: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Supervisor Assignment */}
                  <div className="col-12 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">
                        Assign Supervisor for Verification (Optional)
                      </label>
                      {fetchingSupervisors ? (
                        <div className="d-flex align-items-center">
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span>Loading supervisors...</span>
                        </div>
                      ) : (
                        <select
                          name="supervisor"
                          value={supervisor}
                          onChange={onChange}
                          className="form-control"
                          style={{
                            borderRadius: "0.75rem",
                            border: "2px solid #e2e8f0",
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <option value="">
                            None - Any supervisor/admin can verify
                          </option>
                          {safeSupervisors.map((sup) => (
                            <option key={sup._id} value={sup._id}>
                              {sup.firstName} {sup.lastName} ({sup.username}) -{" "}
                              {sup.role === "admin" ? "Admin" : "Supervisor"}
                            </option>
                          ))}
                        </select>
                      )}
                      <div className="form-text mt-2">
                        Select a specific supervisor or admin who will verify this
                        LOTO request. If none selected, any supervisor or admin can
                        verify.
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12">
                    <div className="d-flex gap-2">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={submitting}
                        className="hover-scale"
                      >
                        {submitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <span className="me-2">💾</span> Create LOTO
                          </>
                        )}
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => navigate("/loto-list")}
                        className="hover-scale"
                      >
                        <span className="me-2">❌</span> Cancel
                      </Button>

                      <Button
                        variant="outline-primary"
                        onClick={() => navigate("/dashboard")}
                        className="hover-scale"
                      >
                        <span className="me-2">🏠</span> Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLOTO;
