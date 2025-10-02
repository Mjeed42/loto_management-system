import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import BackButton from "../components/BackButton";

const UpdateLOTO = () => {
  const [formData, setFormData] = useState({
    shift: "",
    location: "",
    line: "",
    machine: "",
    expectedDuration: "",
    reason: "",
    ptwNumber: "N/A",
    isolatedPart: "",
    supervisor: "",
    energyTypes: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loto, setLoto] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [fetchingSupervisors, setFetchingSupervisors] = useState(true);
  const [showCustomReason, setShowCustomReason] = useState(false); // 👈 For "Other" reason
  const [customReason, setCustomReason] = useState(""); // 👈 Custom reason text
  const [allowedFields, setAllowedFields] = useState([]); // Fields that can be updated
  const [currentUser, setCurrentUser] = useState(null); // Current user info
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTO();
    fetchSupervisors();
    fetchCurrentUser();
  }, [id]);

  // Update field permissions when both loto and currentUser are available
  useEffect(() => {
    if (loto && currentUser) {
      updateFieldPermissions();
    }
  }, [loto, currentUser]);

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

      // Field permissions will be set after currentUser is loaded

      // Prefill form
      setFormData({
        shift: res.data.data.shift || "",
        location: res.data.data.location || "",
        line: res.data.data.line || "",
        machine: res.data.data.machine || "",
        expectedDuration: res.data.data.expectedDuration,
        reason: res.data.data.reason,
        ptwNumber: res.data.data.ptwNumber,
        isolatedPart: res.data.data.isolatedPart,
        supervisor: res.data.data.supervisor?._id || "",
        energyTypes: res.data.data.energyTypes && res.data.data.energyTypes.length > 0 
          ? res.data.data.energyTypes 
          : [{ type: "", isolationPoint: "" }],
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

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/auth/me",
        config
      );

      // Use the same structure as LOTOList.js
      setCurrentUser(res.data.user);
    } catch (err) {
      console.log("❌ Error fetching current user:", err);
      setCurrentUser(null);
    }
  };

  const updateFieldPermissions = () => {
    if (!loto || !currentUser) return;

    let fieldsToAllow = [];
    
    // Check status-based permissions first (regardless of role)
    if (loto.status === "pending_verification_new") {
      // New LOTO pending verification: can update ALL fields
      fieldsToAllow = [
        "shift", "location", "line", "machine", "isolatedPart", 
        "reason", "ptwNumber", "expectedDuration", "supervisor", "energyTypes"
      ];
    } else if (loto.status === "pending_handover_verification") {
      // LOTO under handover verification: ONLY expectedDuration and supervisor
      fieldsToAllow = ["expectedDuration", "supervisor"];
    } else if (loto.status === "rejected") {
      // Rejected LOTOs: only the fields that were rejected
      fieldsToAllow = loto.rejectedFields || [];
    } else if (loto.status === "pending" || loto.status.includes("pending")) {
      // Fallback for any pending status - allow all fields
      fieldsToAllow = [
        "shift", "location", "line", "machine", "isolatedPart", 
        "reason", "ptwNumber", "expectedDuration", "supervisor", "energyTypes"
      ];
    } else {
      // Default fallback - allow basic fields
      fieldsToAllow = ["expectedDuration", "supervisor"];
    }

    // ADMIN OVERRIDE: Admins can update ANY field in ANY condition
    if (currentUser.role === "admin") {
      fieldsToAllow = [
        "shift", "location", "line", "machine", "isolatedPart", 
        "reason", "ptwNumber", "expectedDuration", "supervisor", "energyTypes"
      ];
    }

    // FALLBACK: If no fields are allowed but user is authenticated and LOTO is editable, allow all fields
    if (fieldsToAllow.length === 0 && currentUser && (loto.status === "pending_verification_new" || loto.status.includes("pending"))) {
      fieldsToAllow = [
        "shift", "location", "line", "machine", "isolatedPart", 
        "reason", "ptwNumber", "expectedDuration", "supervisor", "energyTypes"
      ];
    }
    
    setAllowedFields(fieldsToAllow);
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

  // Energy Types handlers
  const handleEnergyTypeChange = (index, field, value) => {
    const updatedEnergyTypes = [...formData.energyTypes];
    updatedEnergyTypes[index][field] = value;
    setFormData({ ...formData, energyTypes: updatedEnergyTypes });
  };

  const addEnergyType = () => {
    setFormData({
      ...formData,
      energyTypes: [...formData.energyTypes, { type: "", isolationPoint: "" }],
    });
  };

  const removeEnergyType = (index) => {
    if (formData.energyTypes.length <= 1) return; // Prevent removing the last one
    const updatedEnergyTypes = formData.energyTypes.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, energyTypes: updatedEnergyTypes });
  };

  // Helper function to check if a field should be shown
  const isFieldAllowed = (fieldName) => {
    return allowedFields.includes(fieldName);
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

      // Create base data with all form fields
      const allFormData = {
        ...formData,
        reason: finalReason,
      };

      // Filter to only include allowed fields
      const dataToSend = {};
      allowedFields.forEach(fieldName => {
        if (allFormData.hasOwnProperty(fieldName)) {
          dataToSend[fieldName] = allFormData[fieldName];
        }
      });

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
      <BackButton to={`/loto/${id}`} label="Back to LOTO Details" />
      
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
              {/* Field Update Information */}

              {currentUser && currentUser.role === "admin" && (
                <div className="alert alert-success mb-4">
                  <div className="d-flex align-items-center">
                    <span className="me-3" style={{ fontSize: "1.5rem" }}>👑</span>
                    <div>
                      <strong>Admin Full Access:</strong> You can modify all LOTO fields regardless of status or restrictions.
                    </div>
                  </div>
                </div>
              )}
              
              {currentUser && currentUser.role !== "admin" && loto.status === "pending_verification_new" && (
                <div className="alert alert-info mb-4">
                  <div className="d-flex align-items-center">
                    <span className="me-3" style={{ fontSize: "1.5rem" }}>📝</span>
                    <div>
                      <strong>Full Update Mode:</strong> You can modify all LOTO details since this is a new LOTO pending verification.
                    </div>
                  </div>
                </div>
              )}
              
              {loto.status === "pending_handover_verification" && (
                <div className="alert alert-warning mb-4">
                  <div className="d-flex align-items-center">
                    <span className="me-3" style={{ fontSize: "1.5rem" }}>🤝</span>
                    <div>
                      <strong>Handover Verification Mode:</strong> While the handover is being verified, you can only update Expected Duration and Assigned Supervisor.
                      <div className="mt-2">
                        <strong>Only these fields will be saved:</strong> Expected Duration, Assigned Supervisor
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {currentUser && currentUser.role !== "admin" && loto.status === "rejected" && (
                <div className="alert alert-warning mb-4">
                  <div className="d-flex align-items-center">
                    <span className="me-3" style={{ fontSize: "1.5rem" }}>⚠️</span>
                    <div>
                      <strong>Selective Update Mode:</strong> You can only modify the fields that were marked as requiring correction during rejection.
                      {allowedFields.length > 0 && (
                        <div className="mt-2">
                          <strong>Fields you can update:</strong> {allowedFields.map(field => {
                            const fieldLabels = {
                              shift: 'Shift',
                              location: 'Location',
                              line: 'Line',
                              machine: 'Machine',
                              isolatedPart: 'Isolated Part',
                              reason: 'Reason',
                              ptwNumber: 'PTW Number',
                              expectedDuration: 'Expected Duration',
                              supervisor: 'Supervisor Assignment',
                              energyTypes: 'Energy Types'
                            };
                            return fieldLabels[field] || field;
                          }).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {loto.status === "pending" && (
                <div className="alert alert-info mb-4">
                  <div className="d-flex align-items-center">
                    <span className="me-3" style={{ fontSize: "1.5rem" }}>ℹ️</span>
                    <div>
                      <strong>Limited Update Mode:</strong> You can only modify the Expected Duration and Supervisor Assignment for pending LOTOs.
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="row">
                  {/* Expected Duration */}
                  {isFieldAllowed("expectedDuration") && (
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
                  )}

                  {/* PTW Number */}
                  {isFieldAllowed("ptwNumber") && (
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
                  )}

                  {/* Isolated Part */}
                  {isFieldAllowed("isolatedPart") && (
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
                  )}

                  {/* Reason Dropdown */}
                  {isFieldAllowed("reason") && (
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
                  )}

                  {/* Custom Reason Input */}
                  {showCustomReason && isFieldAllowed("reason") && (
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

                  {/* Shift */}
                  {isFieldAllowed("shift") && (
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <label className="form-label fw-medium">Shift</label>
                        <select
                          name="shift"
                          value={formData.shift}
                          onChange={onChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select shift</option>
                          <option value="A">Shift A</option>
                          <option value="B">Shift B</option>
                          <option value="C">Shift C</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {isFieldAllowed("location") && (
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <label className="form-label fw-medium">Location</label>
                        <select
                          name="location"
                          value={formData.location}
                          onChange={onChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select location</option>
                          <option value="Processing">Processing</option>
                          <option value="PKG">PKG</option>
                          <option value="Process">Process</option>
                          <option value="Utility">Utility</option>
                          <option value="WH-FG">WH-FG</option>
                          <option value="WH-RM">WH-RM</option>
                          <option value="Project">Project</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Line */}
                  {isFieldAllowed("line") && (
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <label className="form-label fw-medium">Line</label>
                        <input
                          type="text"
                          name="line"
                          value={formData.line}
                          onChange={onChange}
                          placeholder="Enter line number"
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
                  )}

                  {/* Machine */}
                  {isFieldAllowed("machine") && (
                    <div className="col-md-6 mb-4">
                      <div className="form-group">
                        <label className="form-label fw-medium">Machine</label>
                        <input
                          type="text"
                          name="machine"
                          value={formData.machine}
                          onChange={onChange}
                          placeholder="Enter machine name/number"
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
                  )}

                  {/* Supervisor Assignment */}
                  {isFieldAllowed("supervisor") && (
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
                  )}

                  {/* Energy Types Section */}
                  {isFieldAllowed("energyTypes") && (
                    <div className="col-12 mb-4">
                      <div className="form-group">
                        <h5 className="mb-3 fw-medium">
                          <span className="me-2">⚡</span> Energy Types to Isolate
                        </h5>
                        <p className="text-muted mb-3">
                          Select the energy types that need to be isolated for
                          this LOTO procedure.
                        </p>

                        {formData.energyTypes.map((energy, index) => (
                          <div
                            key={index}
                            className="border rounded p-3 mb-3 bg-light"
                          >
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">Energy Type {index + 1}</h6>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => removeEnergyType(index)}
                                disabled={formData.energyTypes.length <= 1}
                              >
                                <span className="me-1">🗑️</span> Remove
                              </button>
                            </div>

                            <div className="row">
                              <div className="col-md-6">
                                <label className="form-label fw-medium">
                                  Energy Type
                                </label>
                                <select
                                  value={energy.type}
                                  onChange={(e) =>
                                    handleEnergyTypeChange(
                                      index,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  required
                                >
                                  <option value="">Select energy type</option>
                                  <option value="Electrical">Electrical</option>
                                  <option value="Water">Water</option>
                                  <option value="Air">Air</option>
                                  <option value="Gas">Gas</option>
                                  <option value="Chemical">Chemical</option>
                                  <option value="Rotating Machine">
                                    Rotating Machine
                                  </option>
                                  <option value="Mechanical">Mechanical</option>
                                  <option value="Nitrogen">Nitrogen</option>
                                  <option value="Hydraulic Oil">
                                    Hydraulic Oil
                                  </option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label fw-medium">
                                  Isolation Point Reference
                                </label>
                                <input
                                  type="text"
                                  value={energy.isolationPoint}
                                  onChange={(e) =>
                                    handleEnergyTypeChange(
                                      index,
                                      "isolationPoint",
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g., Valve V-101, Switch SW-205"
                                  className="form-control"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={addEnergyType}
                        >
                          <span className="me-2">➕</span> Add Energy Type
                        </button>
                      </div>
                    </div>
                  )}

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
