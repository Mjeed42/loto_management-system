import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const CreateLOTO = () => {
  const [formData, setFormData] = useState({
    shift: "A",
    location: "Processing", // Default location
    line: "", // Will be populated based on location selection
    machine: "", // Will be populated based on line selection
    customLocation: "", // For "Other" location
    isolatedPart: "",
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
  const [lines, setLines] = useState(["A", "B", "C", "D", "E"]); // Default lines
  const [machines, setMachines] = useState([]); // Machines will be populated based on line
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

  // Mock machine data based on line selection
  const getMachinesForLine = (selectedLine) => {
    const machineData = {
      A: [
        "Pump P-101",
        "Valve V-205",
        "Compressor C-301",
        "Motor M-402",
        "Boiler B-501",
      ],
      B: [
        "Pump P-102",
        "Valve V-206",
        "Compressor C-302",
        "Motor M-403",
        "Boiler B-502",
      ],
      C: [
        "Pump P-103",
        "Valve V-207",
        "Compressor C-303",
        "Motor M-404",
        "Boiler B-503",
      ],
      D: [
        "Pump P-104",
        "Valve V-208",
        "Compressor C-304",
        "Motor M-405",
        "Boiler B-504",
      ],
      E: [
        "Pump P-105",
        "Valve V-209",
        "Compressor C-305",
        "Motor M-406",
        "Boiler B-505",
      ],
    };

    return machineData[selectedLine] || [];
  };

  const {
    shift,
    location,
    line,
    machine,
    customLocation,
    isolatedPart,
    reason,
    ptwNumber,
    expectedDuration,
    supervisor,
  } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;

    // Reset dependent fields when location changes
    if (name === "location") {
      setFormData({
        ...formData,
        [name]: value,
        line: "",
        machine: "",
        customLocation: value === "Other" ? "" : formData.customLocation,
      });

      // If selecting a specific location, populate lines
      if (value !== "Other") {
        setLines(["A", "B", "C", "D", "E"]);
      }
    }
    // Reset machine when line changes
    else if (name === "line") {
      setFormData({
        ...formData,
        [name]: value,
        machine: "",
      });

      // Populate machines based on selected line
      const machinesForLine = getMachinesForLine(value);
      setMachines(machinesForLine);
    }
    // Handle other fields normally
    else {
      setFormData({ ...formData, [name]: value });
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

      // Prepare data to send
      const dataToSend = {
        shift,
        location,
        isolatedPart,
        reason,
        ptwNumber,
        expectedDuration: parseFloat(expectedDuration),
        supervisor,
      };

      // Add line and machine if selected
      if (line) dataToSend.line = line;
      if (machine) dataToSend.machine = machine;
      if (customLocation) dataToSend.customLocation = customLocation;

      const res = await axios.post(
        "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
        dataToSend,
        config
      );

      alert(
        `LOTO created successfully!\nSerial Number: ${res.data.data.serialNumber}`
      );
      navigate("/loto-list");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating LOTO");
    } finally {
      setSubmitting(false);
    }
  };

  // Ensure supervisors is always an array before mapping
  const safeSupervisors = Array.isArray(supervisors) ? supervisors : [];

  return (
    <div className="cf-dashboard">
      <main className="cf-main">
        <div className="cf-card">
          <div className="cf-card-header cf-flex cf-justify-between cf-items-center">
            <h1 className="cf-card-title cf-flex cf-items-center">
              <Icon name="add" className="cf-mr-2" /> Create New LOTO
            </h1>
            <div className="cf-flex cf-gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/loto-list")}
              >
                <Icon name="back" className="cf-mr-2" /> Back to List
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => navigate("/dashboard")}
              >
                <Icon name="dashboard" className="cf-mr-2" /> Dashboard
              </Button>
            </div>
          </div>
          <div className="cf-card-body">
            {error && (
              <div className="cf-alert cf-alert-danger cf-mb-4">
                <Icon name="warning" className="cf-mr-2" /> {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="cf-grid cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-6">
                <div>
                  <div className="cf-form-group cf-mb-3">
                    <label className="cf-form-label">Shift</label>
                    <select
                      name="shift"
                      value={shift}
                      onChange={onChange}
                      className="cf-form-control"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="cf-form-group cf-mb-3">
                    <label className="cf-form-label">
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
                      className="cf-form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Selection Tree */}
              <div className="cf-form-group cf-mb-3">
                <label className="cf-form-label">Area</label>
                <select
                  name="location"
                  value={location}
                  onChange={onChange}
                  className="cf-form-control"
                  required
                >
                  <option value="Processing">Processing</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Production">Production</option>
                  <option value="Storage">Storage</option>
                  <option value="Other">Other (Specify)</option>
                </select>
              </div>

              {/* Line Selection (if not "Other" location) */}
              {location !== "Other" && (
                <div className="cf-form-group cf-mb-3">
                  <label className="cf-form-label">Line</label>
                  <select
                    name="line"
                    value={line}
                    onChange={onChange}
                    className="cf-form-control"
                    required={location !== "Other"}
                  >
                    <option value="">Select a line</option>
                    {lines.map((l) => (
                      <option key={l} value={l}>
                        Line {l}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Machine Selection (if line is selected) */}
              {line && location !== "Other" && (
                <div className="cf-form-group cf-mb-3">
                  <label className="cf-form-label">Machine</label>
                  <select
                    name="machine"
                    value={machine}
                    onChange={onChange}
                    className="cf-form-control"
                    required
                  >
                    <option value="">Select a machine</option>
                    {machines.map((m, index) => (
                      <option key={index} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Custom Location Input (if "Other" is selected) */}
              {location === "Other" && (
                <div className="cf-form-group cf-mb-3">
                  <label className="cf-form-label">Custom Location</label>
                  <input
                    type="text"
                    name="customLocation"
                    value={customLocation}
                    onChange={onChange}
                    placeholder="Enter custom location description"
                    className="cf-form-control"
                    required={location === "Other"}
                  />
                </div>
              )}

              <div className="cf-form-group cf-mb-3">
                <label className="cf-form-label">Isolated Part</label>
                <input
                  type="text"
                  name="isolatedPart"
                  value={isolatedPart}
                  onChange={onChange}
                  placeholder="Enter part description"
                  className="cf-form-control"
                  required
                />
              </div>

              <div className="cf-form-group cf-mb-3">
                <label className="cf-form-label">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={reason}
                  onChange={onChange}
                  placeholder="Enter reason"
                  className="cf-form-control"
                  required
                />
              </div>

              <div className="cf-form-group cf-mb-4">
                <label className="cf-form-label">PTW Number</label>
                <input
                  type="text"
                  name="ptwNumber"
                  value={ptwNumber}
                  onChange={onChange}
                  placeholder="Enter PTW number or N/A"
                  className="cf-form-control"
                />
              </div>

              <div className="cf-form-group cf-mb-4">
                <label className="cf-form-label">
                  Assign Supervisor for Verification (Optional)
                </label>
                {fetchingSupervisors ? (
                  <div className="cf-flex cf-items-center">
                    <span
                      className="cf-spinner cf-spinner-sm cf-mr-2"
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
                    className="cf-form-control"
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
                <div className="cf-form-help">
                  Select a specific supervisor or admin who will verify this
                  LOTO request
                </div>
              </div>

              <div className="cf-flex cf-gap-2">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span
                        className="cf-spinner cf-spinner-sm cf-mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Icon name="save" className="cf-mr-2" /> Create LOTO
                    </>
                  )}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate("/loto-list")}
                >
                  <Icon name="cancel" className="cf-mr-2" /> Cancel
                </Button>

                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/dashboard")}
                >
                  <Icon name="dashboard" className="cf-mr-2" /> Dashboard
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateLOTO;
