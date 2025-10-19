import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../components/Icon";
import BackButton from "../components/BackButton";
import { useLoading } from "../contexts/LoadingContext";
import ActionButton from "../components/ActionButton";

const UpdateLOTO = () => {
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    shift: "",
    location: "",
    line: "",
    machines: [], // Changed to array for multi-select
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
  const [successMessage, setSuccessMessage] = useState("");
  const [loto, setLoto] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [fetchingSupervisors, setFetchingSupervisors] = useState(true);
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState("");
  const [allowedFields, setAllowedFields] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Dynamic location data
  const [allLocations, setAllLocations] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableLines, setAvailableLines] = useState([]);
  const [availableMachines, setAvailableMachines] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  // Dynamic energy types data
  const [availableEnergyTypes, setAvailableEnergyTypes] = useState([]);
  const [loadingEnergyTypes, setLoadingEnergyTypes] = useState(true);
  
  // Dynamic labels from selected location hierarchy
  const [currentLineLabel, setCurrentLineLabel] = useState("Line/Part");
  const [currentMachineLabel, setCurrentMachineLabel] = useState("Machine/Equipment");
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Get the correct home path based on user role
  const getHomePath = () => {
    if (currentUser?.role === "technician") {
      return "/technician-home";
    }
    return "/Home";
  };

  useEffect(() => {
    fetchLOTO();
    fetchSupervisors();
    fetchCurrentUser();
    fetchLocations();
    fetchEnergyTypes();
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

      const lotoData = res.data.data;
      setLoto(lotoData);

      // Convert machine string to array if it contains commas
      let machinesArray = [];
      if (lotoData.machine && lotoData.machine !== "N/A") {
        machinesArray = lotoData.machine.split(',').map(m => m.trim()).filter(Boolean);
      }

      // Check if location is "Other" or custom
      const isCustomLocation = lotoData.location && 
        !["Processing", "PKG", "Process", "Utility", "WH-FG", "WH-RM", "Project"].includes(lotoData.location);
      
      if (isCustomLocation && lotoData.location !== "Other") {
        setShowCustomLocation(true);
        setCustomLocation(lotoData.location);
      }

      // Prefill form
      setFormData({
        shift: lotoData.shift || "",
        location: isCustomLocation ? "Other" : lotoData.location || "",
        line: lotoData.line || "",
        machines: machinesArray,
        expectedDuration: lotoData.expectedDuration,
        reason: lotoData.reason,
        ptwNumber: lotoData.ptwNumber,
        isolatedPart: lotoData.isolatedPart,
        supervisor: lotoData.supervisor?._id || "",
        energyTypes: lotoData.energyTypes && lotoData.energyTypes.length > 0 
          ? lotoData.energyTypes 
          : [{ type: "", isolationPoint: "" }],
      });

      // Check if reason is "Other" → show custom input
      if (
        lotoData.reason &&
        !["Change over", "Shutdown", "Maintenance"].includes(lotoData.reason)
      ) {
        setShowCustomReason(true);
        setCustomReason(lotoData.reason);
      }

      // Load location hierarchy if location exists
      if (lotoData.location && lotoData.location !== "Other" && !isCustomLocation) {
        const locationObj = allLocations.find(loc => loc.code === lotoData.location);
        if (locationObj) {
          await fetchLinesForLocation(locationObj._id);
          
          if (lotoData.line) {
            // Need to wait for lines to load before finding the line
            setTimeout(async () => {
              const lineObj = availableLines.find(line => line.code === lotoData.line);
              if (lineObj) {
                await fetchMachinesForLine(lineObj._id);
              }
            }, 500);
          }
        }
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching LOTO");
      setLoading(false);
    }
  };

  // Effect to load location hierarchy after locations are fetched
  useEffect(() => {
    const loadLocationHierarchy = async () => {
      if (!loto || allLocations.length === 0 || loadingLocations) return;
      
      const isCustomLocation = loto.location && 
        !["Processing", "PKG", "Process", "Utility", "WH-FG", "WH-RM", "Project"].includes(loto.location);
      
      if (loto.location && loto.location !== "Other" && !isCustomLocation) {
        const locationObj = allLocations.find(loc => loc.code === loto.location);
        if (locationObj) {
          await fetchLinesForLocation(locationObj._id);
        }
      }
    };

    loadLocationHierarchy();
  }, [loto, allLocations, loadingLocations]);

  // Effect to load machines when lines are loaded
  useEffect(() => {
    const loadMachines = async () => {
      if (!loto || !loto.line || availableLines.length === 0) return;
      
      const lineObj = availableLines.find(line => line.code === loto.line);
      if (lineObj) {
        await fetchMachinesForLine(lineObj._id);
      }
    };

    loadMachines();
  }, [loto, availableLines]);

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

      setCurrentUser(res.data.user);
    } catch (err) {
      console.log("❌ Error fetching current user:", err);
      setCurrentUser(null);
    }
  };

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/locations",
        config
      );
      
      const allActiveLocations = (res.data.data || []).filter(loc => loc.isActive !== false);
      setAllLocations(allActiveLocations);
      
      const rootLocations = allActiveLocations.filter(loc => loc.type === "location");
      setAvailableLocations(rootLocations);
      
      setLoadingLocations(false);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setLoadingLocations(false);
    }
  };

  // Fetch lines for a specific location
  const fetchLinesForLocation = async (locationId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `https://loto-backend-643788243736.europe-west1.run.app/api/locations/${locationId}/children`,
        config
      );
      
      const activeLines = (res.data.data || []).filter(line => line.isActive !== false);
      setAvailableLines(activeLines);
      
      if (activeLines.length > 0 && activeLines[0].typeLabel) {
        setCurrentLineLabel(activeLines[0].typeLabel);
      } else {
        setCurrentLineLabel("Line/Part");
      }
    } catch (err) {
      console.error("Error fetching lines:", err);
      setAvailableLines([]);
      setCurrentLineLabel("Line/Part");
    }
  };

  // Fetch machines for a specific line
  const fetchMachinesForLine = async (lineId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `https://loto-backend-643788243736.europe-west1.run.app/api/locations/${lineId}/children`,
        config
      );
      
      const activeMachines = (res.data.data || []).filter(machine => machine.isActive !== false);
      setAvailableMachines(activeMachines);
      
      if (activeMachines.length > 0 && activeMachines[0].typeLabel) {
        setCurrentMachineLabel(activeMachines[0].typeLabel);
      } else {
        setCurrentMachineLabel("Machine/Equipment");
      }
    } catch (err) {
      console.error("Error fetching machines:", err);
      setAvailableMachines([]);
      setCurrentMachineLabel("Machine/Equipment");
    }
  };

  // Fetch energy types from API
  const fetchEnergyTypes = async () => {
    try {
      setLoadingEnergyTypes(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/energy-types",
        config
      );
      
      const activeEnergyTypes = (res.data.data || []).filter(et => et.isActive !== false);
      setAvailableEnergyTypes(activeEnergyTypes);
      setLoadingEnergyTypes(false);
    } catch (err) {
      console.error("Error fetching energy types:", err);
      setAvailableEnergyTypes([]);
      setLoadingEnergyTypes(false);
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

  // Location handlers
  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setFormData({
      ...formData,
      location: selectedLocation,
      line: "",
      machines: [],
    });

    if (selectedLocation === "Other") {
      setShowCustomLocation(true);
      setAvailableLines([]);
      setAvailableMachines([]);
    } else {
      setShowCustomLocation(false);
      setCustomLocation("");
      
      const locationObj = availableLocations.find(loc => loc.code === selectedLocation);
      if (locationObj) {
        fetchLinesForLocation(locationObj._id);
      }
      setAvailableMachines([]);
    }
  };

  const handleCustomLocationChange = (e) => {
    setCustomLocation(e.target.value);
  };

  const handleLineChange = (e) => {
    const selectedLine = e.target.value;
    setFormData({ ...formData, line: selectedLine, machines: [] });
    
    const lineObj = availableLines.find(line => line.code === selectedLine);
    if (lineObj) {
      fetchMachinesForLine(lineObj._id);
    }
  };

  const handleMachineToggle = (machineCode) => {
    setFormData(prev => {
      const isSelected = prev.machines.includes(machineCode);
      const newMachines = isSelected
        ? prev.machines.filter(m => m !== machineCode)
        : [...prev.machines, machineCode];
      
      return { ...prev, machines: newMachines };
    });
  };

  const handleSelectAllMachines = () => {
    const allMachineCodes = availableMachines.map(m => m.code);
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.length === allMachineCodes.length ? [] : allMachineCodes
    }));
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
    if (formData.energyTypes.length <= 1) return;
    const updatedEnergyTypes = formData.energyTypes.filter((_, i) => i !== index);
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
    setSuccessMessage("");
    showLoading("Updating LOTO...");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Prepare final location
      const finalLocation =
        formData.location === "Other" && customLocation
          ? customLocation
          : formData.location || "Other";

      // Prepare final reason
      const finalReason =
        formData.reason === "Other" && customReason
          ? customReason
          : formData.reason;

      // Join multiple machines with comma
      const finalMachines = formData.machines.length > 0 
        ? formData.machines.join(', ') 
        : "N/A";

      // Create base data with all form fields
      const allFormData = {
        ...formData,
        location: finalLocation,
        machine: finalMachines,
        reason: finalReason,
        energyTypes: formData.energyTypes.filter(et => et.type),
      };

      // Remove the machines array (we're sending machine string instead)
      delete allFormData.machines;

      // Filter to only include allowed fields
      const dataToSend = {};
      allowedFields.forEach(fieldName => {
        if (allFormData.hasOwnProperty(fieldName)) {
          dataToSend[fieldName] = allFormData[fieldName];
        }
      });

      console.log("Sending update data:", dataToSend);

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${id}`,
        dataToSend,
        config
      );

      // Hide loading first
      hideLoading();
      
      // Wait a tiny bit to ensure loading is hidden
      setTimeout(() => {
        // Show success message with countdown
        let countdown = 3;
        setSuccessMessage(`${t('updateLoto.lotoUpdatedSuccess')} ${t('updateLoto.redirectingIn')} ${countdown} ${t('updateLoto.seconds')}...`);
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Show an alert as well for immediate feedback
        alert(`✅ ${t('common.success')}!\n\n${t('updateLoto.lotoUpdatedSuccess')}\n\n${t('updateLoto.redirectToDetailsPage')}`);
        
        // Update countdown every second
        const countdownInterval = setInterval(() => {
          countdown--;
          if (countdown > 0) {
            setSuccessMessage(`${t('updateLoto.lotoUpdatedSuccess')} ${t('updateLoto.redirectingIn')} ${countdown} ${countdown > 1 ? t('updateLoto.seconds') : t('updateLoto.second')}...`);
          } else {
            clearInterval(countdownInterval);
            setSuccessMessage(`${t('updateLoto.redirectingNow')}...`);
          }
        }, 1000);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          clearInterval(countdownInterval);
          navigate(`/loto/${id}`);
        }, 3000);
      }, 100);
    } catch (err) {
      hideLoading();
      const errorMessage = err.response?.data?.message || "Error updating LOTO";
      setError(errorMessage);
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (!loto) {
    return (
      <div className="text-center py-5">
        <h2>LOTO not found</h2>
      </div>
    );
  }

  const { expectedDuration, reason, ptwNumber, isolatedPart, supervisor } = formData;
  const safeSupervisors = Array.isArray(supervisors) ? supervisors : [];
  const reasonOptions = ["Change over", "Shutdown", "Maintenance", "Other"];

  // Dynamic energy type options from API (fallback to hardcoded if API fails)
  const energyTypeOptions = availableEnergyTypes.length > 0 
    ? availableEnergyTypes.map(et => ({
        name: et.name,
        symbol: et.symbol,
        category: et.category,
        hazardLevel: et.hazardLevel,
        description: et.description
      }))
    : [
        { name: "Electrical", symbol: "⚡", category: "electrical", hazardLevel: "high" },
        { name: "Hydraulic Pressure", symbol: "💧", category: "hydraulic", hazardLevel: "high" },
        { name: "Pneumatic Pressure", symbol: "💨", category: "pneumatic", hazardLevel: "medium" },
        { name: "Steam", symbol: "🔥", category: "thermal", hazardLevel: "high" },
        { name: "Hot Water", symbol: "🌡️", category: "thermal", hazardLevel: "medium" },
        { name: "Mechanical", symbol: "⚙️", category: "mechanical", hazardLevel: "medium" },
        { name: "Chemical", symbol: "🧪", category: "chemical", hazardLevel: "critical" },
        { name: "Gravity", symbol: "⬇️", category: "mechanical", hazardLevel: "medium" },
      ];

  return (
    <div className="create-loto-container">
      <BackButton to={`/loto/${id}`} label={t('common.back')} />
      
      {/* Desktop Header Section */}
      <div className="create-loto-header d-none d-md-block">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Icon name="edit" size="xl" />
            </div>
            <div className="header-text">
              <h1>{t('updateLoto.title')}</h1>
              <p>{t('updateLoto.subtitle')} - {loto.serialNumber}</p>
            </div>
          </div>
          <div className="header-actions">
            <ActionButton
              variant="secondary"
              icon="eye"
              onClick={() => navigate(`/loto/${id}`)}
            >
              {t('updateLoto.viewDetails')}
            </ActionButton>
            <ActionButton
              variant="secondary"
              icon="home"
              onClick={() => navigate(getHomePath())}
            >
              {t('common.home')}
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="create-loto-mobile-header d-md-none">
        <div className="mobile-progress-indicator">
          <div className="progress-text">
            <Icon name="edit" size="md" /> {t('updateLoto.title')} - {loto.serialNumber}
          </div>
        </div>
      </div>

      {/* Success Message Display */}
      {successMessage && (
        <div 
          className="alert alert-success mb-4" 
          role="alert"
          style={{
            padding: '1.5rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            border: '3px solid #10b981',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
            animation: 'successPulse 0.5s ease-in-out'
          }}
        >
          <div className="d-flex align-items-center justify-content-center flex-column flex-md-row">
            <span style={{ fontSize: "3rem", marginRight: "1rem", animation: 'checkBounce 0.6s ease' }}>
              ✅
            </span>
            <div className="text-center">
              <h4 className="mb-2" style={{ color: '#065f46', fontWeight: 700 }}>
                {t('updateLoto.updateSuccessful')}
              </h4>
              <p className="mb-0" style={{ color: '#047857', fontSize: '1rem' }}>
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <div className="d-flex align-items-center">
            <span style={{ fontSize: "2rem", marginRight: "1rem" }}>⚠️</span>
            <div>
              <h5 className="mb-1">{t('common.error')}</h5>
              <p className="mb-0">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Info */}
      {currentUser && currentUser.role === "admin" && (
        <div className="alert alert-success mb-4">
          <div className="d-flex align-items-center">
            <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>👑</span>
            <div>
              <strong>{t('updateLoto.adminFullAccess')}:</strong> {t('updateLoto.adminFullAccessDesc')}
            </div>
          </div>
        </div>
      )}
      
      {currentUser && currentUser.role !== "admin" && loto.status === "pending_verification_new" && (
        <div className="alert alert-info mb-4">
          <div className="d-flex align-items-center">
            <span style={{ fontSize: "1.5rem", marginRight: "1rem" }}>📝</span>
            <div>
              <strong>{t('updateLoto.fullUpdateMode')}:</strong> {t('updateLoto.fullUpdateModeDesc')}
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={onSubmit} className="create-loto-form">
        
        {/* Basic Information Section */}
        {(isFieldAllowed("shift") || isFieldAllowed("expectedDuration") || isFieldAllowed("ptwNumber")) && (
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Icon name="info" size="md" />
              </div>
              <div className="section-title">
                <h3>{t('createLoto.basicInformation')}</h3>
                <p>{t('createLoto.essentialDetailsDesc')}</p>
              </div>
            </div>
            
            <div className="section-content">
              <div className="form-grid">
                {isFieldAllowed("shift") && (
                  <div className="form-field">
                    <label className="field-label">
                      <Icon name="clock" size="sm" />
                      <span>{t('createLoto.shift')}</span>
                    </label>
                    <select
                      name="shift"
                      value={formData.shift}
                      onChange={onChange}
                      className="field-input"
                      required
                    >
                      <option value="">{t('createLoto.selectShift')}</option>
                      <option value="A">Shift A</option>
                      <option value="B">Shift B</option>
                      <option value="C">Shift C</option>
                    </select>
                  </div>
                )}

                {isFieldAllowed("expectedDuration") && (
                  <div className="form-field">
                    <label className="field-label">
                      <Icon name="clock" size="sm" />
                      <span>{t('createLoto.expectedDuration')}</span>
                    </label>
                    <input
                      type="number"
                      name="expectedDuration"
                      value={expectedDuration}
                      onChange={onChange}
                      placeholder="e.g., 2.5"
                      step="0.5"
                      min="0.5"
                      className="field-input"
                      required
                    />
                  </div>
                )}

                {isFieldAllowed("ptwNumber") && (
                  <div className="form-field full-width">
                    <label className="field-label">
                      <Icon name="file" size="sm" />
                      <span>{t('createLoto.ptwNumber')}</span>
                    </label>
                    <input
                      type="text"
                      name="ptwNumber"
                      value={ptwNumber}
                      onChange={onChange}
                      placeholder={t('createLoto.ptwPlaceholder')}
                      className="field-input"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Location Selection Section */}
        {(isFieldAllowed("location") || isFieldAllowed("line") || isFieldAllowed("machine") || isFieldAllowed("isolatedPart")) && (
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Icon name="map-pin" size="md" />
              </div>
              <div className="section-title">
                <h3>{t('createLoto.locationSelection')}</h3>
                <p>{t('createLoto.locationSelectionDesc')}</p>
              </div>
            </div>
            
            <div className="section-content">
              <div className="location-hierarchy">
                {/* Location */}
                {isFieldAllowed("location") && (
                  <div className="hierarchy-step">
                    <label className="field-label">
                      <Icon name="home" size="sm" />
                      <span>{t('createLoto.primaryLocation')}</span>
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleLocationChange}
                      className="field-input location-select"
                      required
                      disabled={loadingLocations}
                    >
                      <option value="">
                        {loadingLocations ? t('createLoto.loadingLocations') : t('createLoto.selectLocation')}
                      </option>
                      {availableLocations.map((loc) => (
                        <option key={loc._id} value={loc.code}>
                          {loc.name}
                        </option>
                      ))}
                      <option value="Other">{t('common.other')}</option>
                    </select>
                  </div>
                )}

                {/* Custom Location Input */}
                {showCustomLocation && isFieldAllowed("location") && (
                  <div className="hierarchy-step">
                    <label className="field-label">
                      <Icon name="edit" size="sm" />
                      <span>{t('createLoto.customLocation')}</span>
                    </label>
                    <input
                      type="text"
                      name="customLocation"
                      value={customLocation}
                      onChange={handleCustomLocationChange}
                      placeholder={t('createLoto.customLocationPlaceholder')}
                      className="field-input"
                      required
                    />
                  </div>
                )}

                {/* Line */}
                {isFieldAllowed("line") && !showCustomLocation && formData.location && (
                  <div className="hierarchy-step">
                    <label className="field-label">
                      <Icon name="zap" size="sm" />
                      <span>{currentLineLabel}</span>
                    </label>
                    <select
                      name="line"
                      value={formData.line}
                      onChange={handleLineChange}
                      className="field-input"
                      required
                      disabled={!formData.location || formData.location === "Other" || availableLines.length === 0}
                    >
                      <option value="">
                        {availableLines.length === 0 
                          ? `${t('updateLoto.no')} ${currentLineLabel.toLowerCase()} ${t('updateLoto.available')}` 
                          : `-- ${t('createLoto.select')} ${currentLineLabel} --`}
                      </option>
                      {availableLines.map((lineItem) => (
                        <option key={lineItem._id} value={lineItem.code}>
                          {lineItem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Machine Multi-Select */}
                {isFieldAllowed("machine") && !showCustomLocation && (formData.line || formData.machines.length > 0) && (
                  <div className="hierarchy-step">
                    <label className="field-label">
                      <Icon name="settings" size="sm" />
                      <span>{currentMachineLabel} ({t('updateLoto.selectOneOrMore')})</span>
                    </label>
                    
                    {!formData.line && formData.machines.length > 0 ? (
                      <div className="alert alert-info">
                        <strong>{t('updateLoto.currentMachines')}:</strong> {formData.machines.join(', ')}
                        <br/>
                        <small>{t('updateLoto.selectLocationToChange')}</small>
                      </div>
                    ) : availableMachines.length === 0 && formData.line ? (
                      <div className="alert alert-warning">
                        {t('updateLoto.loadingMachines')}...
                      </div>
                    ) : availableMachines.length === 0 ? (
                      <div className="alert alert-info">
                        {t('updateLoto.selectLineToSeeMachines')}
                      </div>
                    ) : (
                      <div className="machine-selection-container">
                        {/* Select All Button */}
                        <div className="select-all-container">
                          <button
                            type="button"
                            className="select-all-btn"
                            onClick={handleSelectAllMachines}
                          >
                            {formData.machines.length === availableMachines.length 
                              ? `☑ ${t('updateLoto.deselectAll')}` 
                              : `☐ ${t('updateLoto.selectAll')}`}
                          </button>
                          <span className="selected-count">
                            {formData.machines.length} {t('updateLoto.of')} {availableMachines.length} {t('updateLoto.selected')}
                          </span>
                        </div>

                        {/* Machine Checkboxes */}
                        <div className="machine-list">
                          {availableMachines.map((machineItem) => (
                            <label 
                              key={machineItem._id} 
                              className="machine-checkbox-item"
                            >
                              <input
                                type="checkbox"
                                className="machine-checkbox"
                                checked={formData.machines.includes(machineItem.code)}
                                onChange={() => handleMachineToggle(machineItem.code)}
                              />
                              <span className="machine-info">
                                <span className="machine-name">{machineItem.name}</span>
                                <span className="machine-code">({machineItem.code})</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Isolated Part */}
                {isFieldAllowed("isolatedPart") && (
                  <div className="hierarchy-step">
                    <label className="field-label">
                      <Icon name="target" size="sm" />
                      <span>{t('createLoto.isolatedPartDescription')}</span>
                    </label>
                    <input
                      type="text"
                      name="isolatedPart"
                      value={isolatedPart}
                      onChange={onChange}
                      placeholder={t('createLoto.isolatedPartPlaceholder')}
                      className="field-input"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Work Details Section */}
        {(isFieldAllowed("reason") || isFieldAllowed("supervisor")) && (
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Icon name="clipboard" size="md" />
              </div>
              <div className="section-title">
                <h3>{t('createLoto.workDetails')}</h3>
                <p>{t('createLoto.specifyReasonDesc')}</p>
              </div>
            </div>
            
            <div className="section-content">
              <div className="form-grid">
                {isFieldAllowed("reason") && (
                  <div className="form-field">
                    <label className="field-label">
                      <Icon name="info" size="sm" />
                      <span>{t('createLoto.reasonForLoto')}</span>
                    </label>
                    <select
                      name="reason"
                      value={reason}
                      onChange={handleReasonChange}
                      className="field-input"
                      required
                    >
                      <option value="">{t('createLoto.selectReason')}</option>
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
                  <div className="form-field">
                    <label className="field-label">
                      <Icon name="edit" size="sm" />
                      <span>{t('createLoto.customReason')}</span>
                    </label>
                    <input
                      type="text"
                      name="customReason"
                      value={customReason}
                      onChange={handleCustomReasonChange}
                      placeholder={t('createLoto.customReasonPlaceholder')}
                      className="field-input"
                      required
                    />
                  </div>
                )}

                {isFieldAllowed("supervisor") && (
                  <div className="form-field">
                    <label className="field-label">
                      <Icon name="user-check" size="sm" />
                      <span>{t('createLoto.assignSupervisor')}</span>
                    </label>
                    <select
                      name="supervisor"
                      value={supervisor}
                      onChange={onChange}
                      className="field-input"
                    >
                      <option value="">{t('createLoto.noSupervisorAssigned')}</option>
                      {fetchingSupervisors ? (
                        <option disabled>{t('createLoto.loadingSupervisors')}</option>
                      ) : (
                        safeSupervisors.map((sup) => (
                          <option key={sup._id} value={sup._id}>
                            {sup.firstName} {sup.lastName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Energy Types Section */}
        {isFieldAllowed("energyTypes") && (
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Icon name="zap" size="md" />
              </div>
              <div className="section-title">
                <h3>{t('createLoto.energyTypesToIsolate')}</h3>
                <p>{t('updateLoto.energyTypesDesc')}</p>
              </div>
            </div>
            
            <div className="section-content">
              <div className="energy-types-container">
                {loadingEnergyTypes ? (
                  <div className="loading-energy-types">
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>{t('createLoto.loadingEnergyTypes')}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {formData.energyTypes.map((energy, index) => (
                      <div key={index} className="energy-type-card">
                        <div className="energy-card-header">
                          <div className="energy-card-title">
                            <Icon name="zap" size="sm" />
                            <span>{t('createLoto.energySource')} {index + 1}</span>
                          </div>
                          <button
                            type="button"
                            className="remove-energy-btn"
                            onClick={() => removeEnergyType(index)}
                            disabled={formData.energyTypes.length <= 1}
                            title={t('createLoto.removeEnergyType')}
                          >
                            <Icon name="x" size="sm" />
                          </button>
                        </div>

                        <div className="energy-card-content">
                          <div className="form-field">
                            <label className="field-label">
                              <span>{t('createLoto.energyType')}</span>
                            </label>
                            <select
                              value={energy.type}
                              onChange={(e) =>
                                handleEnergyTypeChange(index, "type", e.target.value)
                              }
                              className="field-input"
                              required
                            >
                              <option value="">{t('createLoto.selectEnergyType')}</option>
                              {energyTypeOptions.map((et) => (
                                <option key={et.name} value={et.name}>
                                  {et.symbol} {et.name} {et.category ? `(${et.category})` : ''} {et.hazardLevel ? `[${et.hazardLevel.toUpperCase()}]` : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-field">
                            <label className="field-label">
                              <span>{t('createLoto.isolationPointReference')}</span>
                              <span className="isolation-point-optional">({t('updateLoto.optional')})</span>
                            </label>
                            <input
                              type="text"
                              value={energy.isolationPoint || ''}
                              onChange={(e) =>
                                handleEnergyTypeChange(index, "isolationPoint", e.target.value)
                              }
                              placeholder={t('createLoto.isolationPointPlaceholder')}
                              className={`field-input ${energy.isolationPoint ? 'has-value' : 'empty-value'}`}
                            />
                            {energy.isolationPoint && (
                              <div className="isolation-point-status">
                                <span className="status-indicator success">✓ {t('createLoto.isolationPointSpecified')}</span>
                              </div>
                            )}
                            {!energy.isolationPoint && (
                              <div className="isolation-point-status">
                                <span className="status-indicator warning">⚠ {t('createLoto.noIsolationPoint')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="add-energy-btn"
                      onClick={addEnergyType}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{t('createLoto.addAnotherEnergyType')}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="wizard-navigation">
          <div className="nav-buttons">
            <button
              type="submit"
              className="nav-btn btn-success submit-btn"
              disabled={submitting || !!successMessage}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {t('updateLoto.updatingLoto')}
                </>
              ) : successMessage ? (
                <>
                  <Icon name="check" size="sm" />
                  <span>{t('updateLoto.updateSuccessful')}</span>
                </>
              ) : (
                <>
                  <Icon name="check" size="sm" />
                  <span>{t('updateLoto.updateLoto')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="nav-btn btn-outline cancel-btn"
              onClick={() => navigate(`/loto/${id}`)}
              disabled={submitting || !!successMessage}
            >
              <Icon name="x" size="sm" />
              <span>{t('common.cancel')}</span>
            </button>

            <button
              type="button"
              className="nav-btn btn-secondary"
              onClick={() => navigate(getHomePath())}
              disabled={submitting || !!successMessage}
            >
              <Icon name="home" size="sm" />
              <span>{t('common.home')}</span>
            </button>
          </div>
        </div>
      </form>
      
    </div>
  );
};

export default UpdateLOTO;
