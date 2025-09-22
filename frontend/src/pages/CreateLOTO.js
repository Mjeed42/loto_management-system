import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const CreateLOTO = () => {
  const [formData, setFormData] = useState({
    shift: "A",
    location: "PKG", // Default location
    line: "", // Selected line
    machine: "", // Selected machine
    isolatedPart: "", // Final isolated part description
    reason: "",
    ptwNumber: "N/A",
    expectedDuration: "",
    supervisor: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [supervisors, setSupervisors] = useState([]);
  const [fetchingSupervisors, setFetchingSupervisors] = useState(true);
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [showCustomLocation, setShowCustomLocation] = useState(false); // 👈 NEW
  const [customLocation, setCustomLocation] = useState(""); // 👈 NEW
  const navigate = useNavigate();

  useEffect(() => {
    fetchSupervisors();
  }, []);

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

  const {
    shift,
    location,
    line,
    machine,
    isolatedPart,
    reason,
    ptwNumber,
    expectedDuration,
    supervisor,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👇 UPDATED: Handle Location Change (like Reason)
  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setFormData({
      ...formData,
      location: selectedLocation,
      line: "",
      machine: "",
      isolatedPart: "",
    });
    setShowCustomLocation(selectedLocation === "Other");
    if (selectedLocation !== "Other") {
      setCustomLocation("");
    }
  };

  const handleLineChange = (e) => {
    const selectedLine = e.target.value;
    setFormData({
      ...formData,
      line: selectedLine,
      machine: "",
      isolatedPart: "",
    });
  };

  const handleMachineChange = (e) => {
    const selectedMachine = e.target.value;
    setFormData({
      ...formData,
      machine: selectedMachine,
      isolatedPart: selectedMachine,
    });
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

  // 👇 NEW: Handle Custom Location Input
  const handleCustomLocationChange = (e) => {
    setCustomLocation(e.target.value);
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

      if (
        !shift ||
        !location ||
        !isolatedPart ||
        !reason ||
        !expectedDuration
      ) {
        setError("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      // 👇 UPDATED: Use customLocation if location is "Other"
      const finalLocation =
        location === "Other" && customLocation
          ? customLocation
          : location || "Other";

      const dataToSend = {
        shift,
        location: finalLocation,
        line: formData.line || "N/A",
        machine: formData.machine || "N/A",
        isolatedPart: formData.isolatedPart || "N/A",
        reason:
          formData.reason === "Other" && customReason
            ? customReason
            : formData.reason || "Other",
        ptwNumber: ptwNumber || "N/A",
        expectedDuration: parseFloat(expectedDuration),
        supervisor,
      };

      console.log("Sending LOTO creation request:", dataToSend);

      const res = await axios.post(
        "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
        dataToSend,
        config
      );

      console.log("LOTO creation response:", res.data);

      if (res.data && res.data.success) {
        alert(
          `LOTO created successfully!\nSerial Number: ${
            res.data.data?.serialNumber || res.data.serialNumber
          }`
        );
        navigate("/loto-list");
      } else {
        setError(res.data?.message || "Error creating LOTO");
      }
    } catch (err) {
      console.error("LOTO creation error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error creating LOTO";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
                      ➕
                    </span>
                    Create New LOTO
                  </h1>
                  <p className="lead text-muted mb-0">
                    Start a new lockout/tagout procedure for equipment
                    maintenance
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

                  {/* Hierarchical Location Selection */}
                  <div className="col-12 mb-4">
                    <div className="form-group">
                      <label className="form-label fw-medium">
                        Location Selection
                      </label>

                      {/* Step 1: Main Location (now like Reason) */}
                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          Select Main Location
                        </label>
                        <select
                          name="location"
                          value={location}
                          onChange={handleLocationChange}
                          className="form-control"
                          style={{
                            borderRadius: "0.75rem",
                            border: "2px solid #e2e8f0",
                            background: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(10px)",
                          }}
                          required
                        >
                          <option value="">-- Select Location --</option>
                          <option value="PKG">PKG</option>
                          <option value="Process">Process</option>
                          <option value="Utility">Utility</option>
                          <option value="WH-FG">WH-FG</option>
                          <option value="WH-RM">WH-RM</option>
                          <option value="Project">Project</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* 👇 Custom Location Input */}
                      {showCustomLocation && (
                        <div className="mb-3">
                          <label className="form-label fw-medium">
                            Specify Custom Location
                          </label>
                          <input
                            type="text"
                            name="customLocation"
                            value={customLocation}
                            onChange={handleCustomLocationChange}
                            placeholder="Enter custom location"
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

                      {/* 👇 Only show Line/Machine selectors if NOT "Other" location */}
                      {!showCustomLocation && location && (
                        <>
                          {/* Step 2: Line Selection */}
                          <div className="mb-3">
                            <label className="form-label fw-medium">
                              {["PKG", "Process"].includes(location)
                                ? "Select Line"
                                : "Select Part"}
                            </label>
                            <select
                              name="line"
                              value={line}
                              onChange={handleLineChange}
                              className="form-control"
                              style={{
                                borderRadius: "0.75rem",
                                border: "2px solid #e2e8f0",
                                background: "rgba(255, 255, 255, 0.9)",
                                backdropFilter: "blur(10px)",
                              }}
                              required
                            >
                              <option value="">
                                -- Select{" "}
                                {["PKG", "Process"].includes(location)
                                  ? "Line"
                                  : "Part"}{" "}
                                --
                              </option>

                              {location === "PKG" && (
                                <>
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                  <option value="Multi-Bag">Multi-Bag</option>
                                </>
                              )}
                              {location === "Process" && (
                                <>
                                  <option value="PC">PC</option>
                                  <option value="TC">TC</option>
                                  <option value="FCP">FCP</option>
                                  <option value="RBS">RBS</option>
                                  <option value="CKF">CKF</option>
                                </>
                              )}
                              {location === "Utility" && (
                                <>
                                  <option value="Chiller">Chiller</option>
                                  <option value="AC">AC</option>
                                  <option value="Pump">Pump</option>
                                  <option value="Gate">Gate</option>
                                  <option value="Other">Other</option>
                                </>
                              )}
                              {location === "WH-FG" && (
                                <>
                                  <option value="Gate">Gate</option>
                                  <option value="Dock Leveler">
                                    Dock Leveler
                                  </option>
                                  <option value="Crate Dumper">
                                    Crate Dumper
                                  </option>
                                  <option value="Pallet Inverter">
                                    Pallet Inverter
                                  </option>
                                  <option value="Banker">Banker</option>
                                  <option value="Other">Other</option>
                                </>
                              )}
                              {location === "WH-RM" && (
                                <>
                                  <option value="Gate">Gate</option>
                                  <option value="Dock Leveler">
                                    Dock Leveler
                                  </option>
                                  <option value="Crate Dumper">
                                    Crate Dumper
                                  </option>
                                  <option value="Pallet Inverter">
                                    Pallet Inverter
                                  </option>
                                  <option value="Banker">Banker</option>
                                  <option value="Other">Other</option>
                                </>
                              )}
                              {location === "Project" && (
                                <>
                                  <option value="Other">Other</option>
                                </>
                              )}
                            </select>
                          </div>

                          {/* Step 3: Machine/Part Selection */}
                          {line && (
                            <div className="mb-3">
                              <label className="form-label fw-medium">
                                Select Machine/Part
                              </label>
                              <select
                                name="machine"
                                value={machine}
                                onChange={handleMachineChange}
                                className="form-control"
                                style={{
                                  borderRadius: "0.75rem",
                                  border: "2px solid #e2e8f0",
                                  background: "rgba(255, 255, 255, 0.9)",
                                  backdropFilter: "blur(10px)",
                                }}
                                required
                              >
                                <option value="">
                                  -- Select Machine/Part --
                                </option>

                                {location === "PKG" && line === "A" && (
                                  <>
                                    <option value="DA01">DA01</option>
                                    <option value="DA02">DA02</option>
                                    <option value="DA03">DA03</option>
                                    <option value="DA04">DA04</option>
                                    <option value="DA05">DA05</option>
                                    <option value="DA06">DA06</option>
                                    <option value="DA07">DA07</option>
                                    <option value="DA08">DA08</option>
                                    <option value="DA09">DA09</option>
                                    <option value="DA10">DA10</option>
                                    <option value="DA11">DA11</option>
                                    <option value="DA12">DA12</option>
                                    <option value="DA13">DA13</option>
                                    <option value="DA14">DA14</option>
                                    <option value="DA15">DA15</option>
                                    <option value="DA16">DA16</option>
                                    <option value="DA17">DA17</option>
                                    <option value="DA18">DA18</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "PKG" && line === "B" && (
                                  <>
                                    <option value="DB01">DB01</option>
                                    <option value="DB02">DB02</option>
                                    <option value="DB03">DB03</option>
                                    <option value="DB04">DB04</option>
                                    <option value="GUCP01">GUCP01</option>
                                    <option value="DB05">DB05</option>
                                    <option value="DB06">DB06</option>
                                    <option value="DB07">DB07</option>
                                    <option value="DB08">DB08</option>
                                    <option value="DB09">DB09</option>
                                    <option value="DB10">DB10</option>
                                    <option value="DB11">DB11</option>
                                    <option value="DB12">DB12</option>
                                    <option value="DB13">DB13</option>
                                    <option value="DB14">DB14</option>
                                    <option value="DB15">DB15</option>
                                    <option value="DB16">DB16</option>
                                    <option value="DB17">DB17</option>
                                    <option value="DB18">DB18</option>
                                    <option value="GUCP06">GUCP06</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "PKG" && line === "C" && (
                                  <>
                                    <option value="GUCP07">GUCP07</option>
                                    <option value="DC01">DC01</option>
                                    <option value="DC02">DC02</option>
                                    <option value="DC03">DC03</option>
                                    <option value="DC04">DC04</option>
                                    <option value="DC05">DC05</option>
                                    <option value="DC06">DC06</option>
                                    <option value="DC07">DC07</option>
                                    <option value="DC08">DC08</option>
                                    <option value="GUCP10">GUCP10</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "PKG" && line === "D" && (
                                  <>
                                    <option value="DD01">DD01</option>
                                    <option value="DD02">DD02</option>
                                    <option value="DD03">DD03</option>
                                    <option value="DD04">DD04</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "PKG" && line === "Multi-Bag" && (
                                  <>
                                    <option value="MP01">MP01</option>
                                    <option value="MP02">MP02</option>
                                    <option value="MP03">MP03</option>
                                    <option value="MP04">MP04</option>
                                    <option value="MP05">MP05</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "Process" && line === "PC" && (
                                  <>
                                    <option value="Oven">Oven</option>
                                    <option value="Fryer">Fryer</option>
                                    <option value="Slicer">Slicer</option>
                                    <option value="Starch Recovery">
                                      Starch Recovery
                                    </option>
                                    <option value="Optical Sorter">
                                      Optical Sorter
                                    </option>
                                    <option value="Sessioning Loop">
                                      Sessioning Loop
                                    </option>
                                    <option value="Dump Station">
                                      Dump Station
                                    </option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "Process" && line === "TC" && (
                                  <>
                                    <option value="Oven">Oven</option>
                                    <option value="Starch Recovery">
                                      Starch Recovery
                                    </option>
                                    <option value="Dump Station">
                                      Dump Station
                                    </option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "Process" && line === "FCP" && (
                                  <>
                                    <option value="Optical Sorter">
                                      Optical Sorter
                                    </option>
                                    <option value="Mill Mixer">
                                      Mill Mixer
                                    </option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "Process" && line === "RBS" && (
                                  <>
                                    <option value="Extruder">Extruder</option>
                                    <option value="Sheeter">Sheeter</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {location === "Process" && line === "CKF" && (
                                  <>
                                    <option value="Sessioning Loop">
                                      Sessioning Loop
                                    </option>
                                    <option value="Other">Other</option>
                                  </>
                                )}
                                {(location === "Utility" ||
                                  location === "WH-FG" ||
                                  location === "WH-RM" ||
                                  location === "Project") &&
                                  line && (
                                    <>
                                      <option value={line}>{line}</option>
                                      <option value="Other">Other</option>
                                    </>
                                  )}
                              </select>
                            </div>
                          )}
                        </>
                      )}

                      {/* Display Selected Location Path */}
                      {(location || line || machine) && (
                        <div className="alert alert-info d-flex align-items-center mt-3">
                          <span className="me-3" style={{ fontSize: "1.5rem" }}>
                            📍
                          </span>
                          <div>
                            <strong>Selected Location Path:</strong>
                            <span className="ms-2">
                              {location === "Other" && customLocation
                                ? customLocation
                                : location}
                              {line && ` > ${line}`}
                              {machine && ` > ${machine}`}
                            </span>
                          </div>
                        </div>
                      )}
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

                  {/* Reason Dropdown */}
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

                  {/* Custom Reason Text Box */}
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
                        required
                      />
                    </div>
                  )}

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

export default CreateLOTO;
