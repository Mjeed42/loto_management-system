import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const UpdateLOTO = () => {
  const [formData, setFormData] = useState({
    expectedDuration: "",
    reason: "",
    ptwNumber: "N/A",
    isolatedPart: "",
    supervisor: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loto, setLoto] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [fetchingSupervisors, setFetchingSupervisors] = useState(true);
  const [showCustomReason, setShowCustomReason] = useState(false); // 👈 For "Other" reason
  const [customReason, setCustomReason] = useState(""); // 👈 Custom reason text
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTO();
    fetchSupervisors();
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
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}`,
        config
      );

      setLoto(res.data.data);

      // Prefill form
      setFormData({
        expectedDuration: res.data.data.expectedDuration,
        reason: res.data.data.reason,
        ptwNumber: res.data.data.ptwNumber,
        isolatedPart: res.data.data.isolatedPart,
        supervisor: res.data.data.supervisor?._id || "",
      });

      // Check if reason is "Other" → show custom input
      if (
        res.data.data.reason &&
        !["Change over", "Shutdown", "Maintenance"].includes(
          res.data.data.reason
        )
      ) {
        setShowCustomReason(true);
        setCustomReason(res.data.data.reason);
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching LOTO");
      setLoading(false);
    }
  };

  const fetchSupervisors = async () => {
    try {
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

      supervisorsData = Array.isArray(supervisorsData) ? supervisorsData : [];

      setSupervisors(supervisorsData);
      setFetchingSupervisors(false);
    } catch (err) {
      console.log("Error fetching supervisors:", err);
      setError(err.response?.data?.message || "Error fetching supervisors");
      setSupervisors([]);
      setFetchingSupervisors(false);
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReasonChange = (e) => {
    const selectedReason = e.target.value;
    setFormData({ ...formData, reason: selectedReason });
    setShowCustomReason(selectedReason === "Other");
    if (selectedReason !== "Other") {
      setCustomReason("");
    }
  };

  const handleCustomReasonChange = (e) => {
    setCustomReason(e.target.value);
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

      // Prepare final reason
      const finalReason =
        formData.reason === "Other" && customReason
          ? customReason
          : formData.reason;

      const dataToSend = {
        ...formData,
        reason: finalReason,
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}`,
        dataToSend,
        config
      );

      alert("LOTO updated successfully!");
      navigate(`/loto/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating LOTO");
    } finally {
      setSubmitting(false);
    }
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
      <div className="alert alert-danger d-flex align-items-center">
        <span className="me-3" style={{ fontSize: "1.5rem" }}>
          ⚠️
        </span>
        <div>
          <strong>Error:</strong> {error}
        </div>
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

  const { expectedDuration, reason, ptwNumber, isolatedPart, supervisor } =
    formData;
  const safeSupervisors = Array.isArray(supervisors) ? supervisors : [];
  const reasonOptions = ["Change over", "Shutdown", "Maintenance", "Other"];

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
                      ✏️
                    </span>
                    Update LOTO
                  </h1>
                  <p className="lead text-muted mb-0">
                    Modify lockout/tagout details for ongoing maintenance
                  </p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(`/loto/${id}`)}
                    className="hover-scale"
                  >
                    <span className="me-2">⬅️</span> Back to Detail
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigate("/Home")}
                    className="hover-scale"
                  >
                    <span className="me-2">🏠</span> Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  {/* Expected Duration */}
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

                  {/* PTW Number */}
                  <div className="col-md-6 mb-4">
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

                  {/* Isolated Part */}
                  <div className="col-12 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">
                        Isolated Part
                      </label>
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

                  {/* Reason Dropdown — NOW LIKE CREATELOTO */}
                  <div className="col-12 mb-4">
                    <label className="form-label fw-medium">Reason</label>
                    <select
                      name="reason"
                      value={reason}
                      onChange={handleReasonChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select a reason</option>
                      {reasonOptions.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Reason Input */}
                  {showCustomReason && (
                    <div className="col-12 mb-4">
                      <label className="form-label fw-medium">
                        Specify Custom Reason
                      </label>
                      <input
                        type="text"
                        name="customReason"
                        value={customReason}
                        onChange={handleCustomReasonChange}
                        placeholder="Enter custom reason"
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
                  )}

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
                        >
                          <option value="">
                            None - Any supervisor can verify
                          </option>
                          {supervisors
                            .filter((sup) => sup.role === "supervisor") // only supervisors
                            .map((sup) => (
                              <option key={sup._id} value={sup._id}>
                                {sup.firstName} {sup.lastName}
                              </option>
                            ))}
                        </select>
                      )}
                      <div className="form-text mt-2">
                        Select a specific supervisor who will verify this LOTO
                        request. If none selected, any supervisor can verify.
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
                            Updating...
                          </>
                        ) : (
                          <>
                            <span className="me-2">💾</span> Update LOTO
                          </>
                        )}
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/loto/${id}`)}
                        className="hover-scale"
                      >
                        <span className="me-2">❌</span> Cancel
                      </Button>

                      <Button
                        variant="outline-primary"
                        onClick={() => navigate("/Home")}
                        className="hover-scale"
                      >
                        <span className="me-2">🏠</span> Home
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

export default UpdateLOTO;
