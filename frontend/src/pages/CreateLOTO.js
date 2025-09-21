import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const CreateLOTO = () => {
  const [formData, setFormData] = useState({
    shift: "A",
    location: "Processing", // Default location
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
  const navigate = useNavigate();

  // Location hierarchy based on your Excel structure
  const locationHierarchy = {
    Processing: ["A", "B", "C", "D", "Multi-Bag"],
    PKG: ["A", "B", "C", "D", "Multi-Bag"],
    Process: ["PC", "TC", "FCP", "RBS", "CKF"],
    Utility: ["Chiller", "AC", "Pump", "Gate", "Other"],
    "WH-FG": [
      "Gate",
      "Dock Leveler",
      "Crate Dumper",
      "Pallet Inverter",
      "Banker",
      "Other",
    ],
    "WH-RM": [
      "Gate",
      "Dock Leveler",
      "Crate Dumper",
      "Pallet Inverter",
      "Banker",
      "Other",
    ],
    Project: ["Other"],
    Other: ["Other"],
  };

  // Machine hierarchy for Processing/PKG locations
  const machineHierarchy = {
    Processing: {
      A: [
        "DA01",
        "DA02",
        "DA03",
        "DA04",
        "DA05",
        "DA06",
        "DA07",
        "DA08",
        "DA09",
        "DA10",
        "DA11",
        "DA12",
        "DA13",
        "DA14",
        "DA15",
        "DA16",
        "DA17",
        "DA18",
      ],
      B: [
        "DB01",
        "DB02",
        "DB03",
        "DB04",
        "GUCP01",
        "DB05",
        "DB06",
        "DB07",
        "DB08",
        "DB09",
        "DB10",
        "DB11",
        "DB12",
        "DB13",
        "DB14",
        "DB15",
        "DB16",
        "DB17",
        "DB18",
        "GUCP06",
      ],
      C: [
        "GUCP07",
        "DC01",
        "DC02",
        "DC03",
        "DC04",
        "DC05",
        "DC06",
        "DC07",
        "DC08",
        "GUCP10",
      ],
      D: ["DD01", "DD02", "DD03", "DD04"],
      "Multi-Bag": ["MP01", "MP02", "MP03", "MP04", "MP05"],
    },
    PKG: {
      A: [
        "DA01",
        "DA02",
        "DA03",
        "DA04",
        "DA05",
        "DA06",
        "DA07",
        "DA08",
        "DA09",
        "DA10",
        "DA11",
        "DA12",
        "DA13",
        "DA14",
        "DA15",
        "DA16",
        "DA17",
        "DA18",
      ],
      B: [
        "DB01",
        "DB02",
        "DB03",
        "DB04",
        "GUCP01",
        "DB05",
        "DB06",
        "DB07",
        "DB08",
        "DB09",
        "DB10",
        "DB11",
        "DB12",
        "DB13",
        "DB14",
        "DB15",
        "DB16",
        "DB17",
        "DB18",
        "GUCP06",
      ],
      C: [
        "GUCP07",
        "DC01",
        "DC02",
        "DC03",
        "DC04",
        "DC05",
        "DC06",
        "DC07",
        "DC08",
        "GUCP10",
      ],
      D: ["DD01", "DD02", "DD03", "DD04"],
      "Multi-Bag": ["MP01", "MP02", "MP03", "MP04", "MP05"],
    },
  };

  // Part hierarchy for Process, Utility, WH-FG, WH-RM locations
  const partHierarchy = {
    Process: {
      PC: [
        "Oven",
        "Fryer",
        "Slicer",
        "Starch Recovery",
        "Optical Sorter",
        "Sessioning Loop",
        "Dump Station",
        "Other",
      ],
      TC: ["Oven", "Starch Recovery", "Dump Station", "Other"],
      FCP: ["Optical Sorter", "Mill Mixer", "Other"],
      RBS: ["Extruder", "Sheeter", "Other"],
      CKF: ["Sessioning Loop", "Other"],
    },
    Utility: ["Chiller", "AC", "Pump", "Gate", "Other"],
    "WH-FG": [
      "Gate",
      "Dock Leveler",
      "Crate Dumper",
      "Pallet Inverter",
      "Banker",
      "Other",
    ],
    "WH-RM": [
      "Gate",
      "Dock Leveler",
      "Crate Dumper",
      "Pallet Inverter",
      "Banker",
      "Other",
    ],
    Project: ["Other"],
    Other: ["Other"],
  };

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

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setFormData({
      ...formData,
      location: selectedLocation,
      line: "",
      machine: "",
      isolatedPart: "",
    });
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

      // Prepare data to send - ensure location is valid
      const dataToSend = {
        shift,
        location: formData.location || "Other", // Default to "Other" if not selected
        line: formData.line || "N/A",
        machine: formData.machine || "N/A",
        isolatedPart: formData.isolatedPart || "N/A",
        reason,
        ptwNumber: ptwNumber || "N/A",
        expectedDuration: parseFloat(expectedDuration),
        supervisor,
      };

      const res = await axios.post(
        "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
        dataToSend,
        config
      );

      // Check if the response is successful
      if (res.status === 201 && res.data.success) {
        alert(
          `LOTO created successfully!\nSerial Number: ${res.data.data.serialNumber}`
        );
        navigate("/loto-list");
      } else {
        // Handle error response
        setError(res.data.message || "Error creating LOTO");
      }
    } catch (err) {
      // Handle network errors
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

              {/* Hierarchical Location Selection - TREE STRUCTURE */}
              <div className="cf-form-group cf-mb-4">
                <label className="cf-form-label">Location Selection</label>

                {/* Step 1: Main Location */}
                <div className="cf-mb-3">
                  <label className="cf-form-label">Select Main Location</label>
                  <select
                    name="location"
                    value={location}
                    onChange={handleLocationChange}
                    className="cf-form-control"
                    required
                  >
                    <option value="">-- Select Location --</option>
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

                {/* Step 2: Line/Part Selection (appears when location is selected) */}
                {location && locationHierarchy[location] && (
                  <div className="cf-mb-3">
                    <label className="cf-form-label">
                      {["Processing", "PKG", "Process"].includes(location)
                        ? "Select Line"
                        : "Select Part"}
                    </label>
                    <select
                      name="line"
                      value={line}
                      onChange={handleLineChange}
                      className="cf-form-control"
                      required
                    >
                      <option value="">
                        -- Select{" "}
                        {["Processing", "PKG", "Process"].includes(location)
                          ? "Line"
                          : "Part"}{" "}
                        --
                      </option>
                      {locationHierarchy[location].map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 3: Machine/Part Selection (appears when line is selected for Processing/PKG) */}
                {location &&
                  (location === "Processing" || location === "PKG") &&
                  line &&
                  machineHierarchy[location]?.[line] && (
                    <div className="cf-mb-3">
                      <label className="cf-form-label">Select Machine</label>
                      <select
                        name="machine"
                        value={machine}
                        onChange={handleMachineChange}
                        className="cf-form-control"
                        required
                      >
                        <option value="">-- Select Machine --</option>
                        {machineHierarchy[location][line].map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {/* For Process location with specific lines */}
                {location === "Process" &&
                  line &&
                  partHierarchy.Process?.[line] && (
                    <div className="cf-mb-3">
                      <label className="cf-form-label">Select Part</label>
                      <select
                        name="machine"
                        value={machine}
                        onChange={handleMachineChange}
                        className="cf-form-control"
                        required
                      >
                        <option value="">-- Select Part --</option>
                        {partHierarchy.Process[line].map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {/* For Utility, WH-FG, WH-RM, Project, Other locations */}
                {location &&
                  ["Utility", "WH-FG", "WH-RM", "Project", "Other"].includes(
                    location
                  ) &&
                  !line && (
                    <div className="cf-mb-3">
                      <label className="cf-form-label">Select Part</label>
                      <select
                        name="machine"
                        value={machine}
                        onChange={handleMachineChange}
                        className="cf-form-control"
                        required
                      >
                        <option value="">-- Select Part --</option>
                        {partHierarchy[location].map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                {/* Display Selected Location Path */}
                {(location || line || machine) && (
                  <div className="cf-alert cf-alert-info cf-mt-3">
                    <Icon name="location" className="cf-mr-2" />
                    Selected Location Path:
                    <strong>
                      {location}
                      {line && ` > ${line}`}
                      {machine && ` > ${machine}`}
                    </strong>
                  </div>
                )}
              </div>

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

              {/* Supervisor Dropdown - FIXED ARRAY ITERATION */}
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
                    {/* FIXED: Ensure safeSupervisors is always an array before mapping */}
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
