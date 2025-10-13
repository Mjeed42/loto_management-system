import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Icon from "../components/Icon";
import BackButton from "../components/BackButton";
import { useLoading } from "../contexts/LoadingContext";
import ActionButton from "../components/ActionButton";
import StandardButton from "../components/StandardButton";

const CreateLOTO = () => {
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    shift: "A",
    location: "", // No default - user must select
    line: "", // Selected line
    machines: [], // Selected machines (array for multiple selection)
    isolatedPart: "", // Final isolated part description
    reason: "",
    ptwNumber: "N/A",
    expectedDuration: "",
    supervisor: "",
    energyTypes: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supervisors, setSupervisors] = useState([]);
  const [fetchingSupervisors, setFetchingSupervisors] = useState(true);
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState("");
  const [showCustomMachine, setShowCustomMachine] = useState(false);
  const [customMachine, setCustomMachine] = useState("");
  
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
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValidation, setStepValidation] = useState({
    1: false, // Basic Information
    2: false, // Location Selection
    3: false, // Work Details
    4: false, // Energy Types
  });

  useEffect(() => {
    fetchSupervisors();
    fetchCurrentUser();
    fetchLocations();
    fetchEnergyTypes();
  }, []);

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
      console.log("Error fetching current user:", err);
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
      
      // Store all locations (only active ones should come from backend)
      const allActiveLocations = (res.data.data || []).filter(loc => loc.isActive !== false);
      setAllLocations(allActiveLocations);
      
      // Filter root locations (type = "location") and ensure they're active
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
      
      // Filter out inactive lines
      const activeLines = (res.data.data || []).filter(line => line.isActive !== false);
      setAvailableLines(activeLines);
      
      // Set dynamic label from first line's typeLabel
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
      
      // Filter out inactive machines
      const activeMachines = (res.data.data || []).filter(machine => machine.isActive !== false);
      setAvailableMachines(activeMachines);
      
      // Set dynamic label from first machine's typeLabel
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
      
      // Filter out inactive energy types (only active ones should come from backend)
      const activeEnergyTypes = (res.data.data || []).filter(et => et.isActive !== false);
      setAvailableEnergyTypes(activeEnergyTypes);
      setLoadingEnergyTypes(false);
    } catch (err) {
      console.error("Error fetching energy types:", err);
      setAvailableEnergyTypes([]);
      setLoadingEnergyTypes(false);
    }
  };

  // Get the correct home path based on user role
  const getHomePath = () => {
    if (currentUser?.role === "technician") {
      return "/technician-home";
    }
    return "/Home";
  };

  // Validate current step and update validation state
  useEffect(() => {
    validateCurrentStep();
  }, [formData, customReason, customLocation, customMachine, currentStep]);

  const validateCurrentStep = () => {
    const newValidation = { ...stepValidation };

    // Step 1: Basic Information
    newValidation[1] = !!(
      formData.shift &&
      formData.expectedDuration &&
      parseFloat(formData.expectedDuration) >= 0.5
    );

    // Step 2: Location Selection
    if (showCustomLocation) {
      newValidation[2] = !!customLocation;
    } else {
      newValidation[2] = !!(
        formData.location &&
        formData.line &&
        formData.machines.length > 0
      );
    }

    // Step 3: Work Details
    if (showCustomReason) {
      newValidation[3] = !!(customReason);
    } else {
      newValidation[3] = !!(formData.reason);
    }

    // Step 4: Energy Types - Validate that at least one energy type is selected
    newValidation[4] = formData.energyTypes && 
      formData.energyTypes.some(et => et.type);

    setStepValidation(newValidation);
  };

  const nextStep = () => {
    // First, validate current step and scroll to first invalid field
    const firstInvalidField = validateCurrentStepAndGetFirstInvalid();
    
    if (firstInvalidField) {
      // Scroll to the first invalid field
      scrollToField(firstInvalidField);
      return;
    }
    
    // If validation passes, move to next step and scroll to top
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setError(""); // Clear any errors when moving to next step
      
      // Scroll to top of the new section after state update
      setTimeout(() => {
        scrollToSectionTop();
      }, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(""); // Clear any errors when moving to previous step
      
      // Scroll to top of the previous section
      setTimeout(() => {
        scrollToSectionTop();
      }, 100);
    }
  };

  // Function to validate current step and return first invalid field
  const validateCurrentStepAndGetFirstInvalid = () => {
    switch (currentStep) {
      case 1:
        // Basic Information validation
        if (!formData.shift) return 'shift';
        if (!formData.expectedDuration || parseFloat(formData.expectedDuration) < 0.5) return 'expectedDuration';
        break;
      case 2:
        // Location Selection validation
        if (!formData.location) return 'location';
        if (showCustomLocation && !customLocation) return 'customLocation';
        if (!showCustomLocation && !formData.line) return 'line';
        if (!showCustomLocation && formData.machines.length === 0) return 'machines';
        if (showCustomMachine && !customMachine) return 'customMachine';
        // Note: isolatedPart is now optional
        break;
      case 3:
        // Work Details validation
        if (showCustomReason && !customReason) return 'customReason';
        if (!showCustomReason && !formData.reason) return 'reason';
        break;
      case 4:
        // Energy Types validation
        if (formData.energyTypes.length === 0) return 'addEnergyType';
        const firstEmptyEnergy = formData.energyTypes.findIndex(et => !et.type);
        if (firstEmptyEnergy !== -1) return `energyType-${firstEmptyEnergy}`;
        break;
    }
    return null;
  };

  // Function to scroll to a specific field
  const scrollToField = (fieldName) => {
    let element = null;
    let targetElement = null;
    
    if (fieldName.startsWith('energyType-')) {
      const index = fieldName.split('-')[1];
      element = document.querySelector(`[data-energy-index="${index}"]`);
      targetElement = element;
    } else if (fieldName === 'addEnergyType') {
      element = document.querySelector('.add-first-energy-btn');
      targetElement = element;
    } else {
      element = document.querySelector(`[name="${fieldName}"]`);
      targetElement = element;
    }
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
      
      // Add visual feedback
      setTimeout(() => {
        if (fieldName.startsWith('energyType-')) {
          // For energy type cards
          element.classList.add('invalid');
          setTimeout(() => {
            element.classList.remove('invalid');
          }, 3000);
        } else if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
          // For form inputs
          element.classList.add('invalid');
          element.focus();
          
          setTimeout(() => {
            element.classList.remove('invalid');
          }, 3000);
        }
      }, 500);
      
      // Set error message for better user guidance
      let errorMessage = '';
      switch (fieldName) {
        case 'shift':
          errorMessage = 'Please select a shift';
          break;
        case 'expectedDuration':
          errorMessage = 'Please enter expected duration (minimum 0.5 hours)';
          break;
        case 'location':
          errorMessage = 'Please select a location';
          break;
        case 'customLocation':
          errorMessage = 'Please enter custom location';
          break;
        case 'line':
          errorMessage = 'Please select a line/part';
          break;
        case 'machines':
          errorMessage = 'Please select at least one machine/equipment';
          break;
        case 'customMachine':
          errorMessage = 'Please enter custom machine name';
          break;
        case 'reason':
          errorMessage = 'Please select a reason for LOTO';
          break;
        case 'customReason':
          errorMessage = 'Please enter custom reason';
          break;
        case 'addEnergyType':
          errorMessage = 'Please add at least one energy type';
          break;
        default:
          if (fieldName.startsWith('energyType-')) {
            errorMessage = 'Please select an energy type';
          }
      }
      
      if (errorMessage) {
        setError(errorMessage);
      }
    }
  };

  // Function to scroll to top of current section
  const scrollToSectionTop = () => {
    const formSection = document.querySelector('.form-section');
    if (formSection) {
      formSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const goToStep = (step) => {
    // Allow going to any previous step or next step
    if (step <= currentStep || step === currentStep + 1) {
      // If trying to go to next step, validate first
      if (step === currentStep + 1) {
        const firstInvalidField = validateCurrentStepAndGetFirstInvalid();
        if (firstInvalidField) {
          // Scroll to the first invalid field instead of moving to next step
          scrollToField(firstInvalidField);
          return;
        }
      }
      
      setCurrentStep(step);
      setError("");
      
      // Scroll to top of the new section
      setTimeout(() => {
        scrollToSectionTop();
      }, 100);
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

  const {
    shift,
    location,
    line,
    machines,
    isolatedPart,
    reason,
    ptwNumber,
    expectedDuration,
    supervisor,
    energyTypes,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- NEW ENERGY TYPES HANDLERS ---
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
    if (formData.energyTypes.length > 1) {
      const updatedEnergyTypes = formData.energyTypes.filter((_, i) => i !== index);
    setFormData({ ...formData, energyTypes: updatedEnergyTypes });
    }
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
      
      // Fetch lines for the selected location
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
    
    // Fetch machines for the selected line
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

  const handleCustomMachineChange = (e) => {
    setCustomMachine(e.target.value);
  };

  // Reason handlers
  const handleReasonChange = (e) => {
    const selectedReason = e.target.value;
    setFormData({ ...formData, reason: selectedReason });

    if (selectedReason === "Other") {
      setShowCustomReason(true);
    } else {
      setShowCustomReason(false);
      setCustomReason("");
    }
  };

  const handleCustomReasonChange = (e) => {
    setCustomReason(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    showLoading("Creating LOTO...");
    setError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // Validate energy types
      if (formData.energyTypes.length === 0) {
        setError("Please select at least one energy type to isolate");
        hideLoading();
        return;
      }

      // Note: Isolation points are now optional, no validation needed

      // Prepare data to send with energy types
      const finalLocation =
        formData.location === "Other" && customLocation
          ? customLocation
          : formData.location || "Other";

      // Join multiple machines with comma
      const finalMachines = formData.machines.length > 0 
        ? formData.machines.join(', ') 
        : "N/A";

      const dataToSend = {
        shift: formData.shift,
        location: finalLocation,
        line: formData.line || "N/A",
        machine: finalMachines, // Send comma-separated machines
        isolatedPart: formData.isolatedPart || "N/A",
        reason:
          formData.reason === "Other" && customReason
            ? customReason
            : formData.reason || "Other",
        ptwNumber: formData.ptwNumber || "N/A",
        expectedDuration: parseFloat(formData.expectedDuration),
        supervisor: formData.supervisor,
        // --- INCLUDE ENERGY TYPES IN DATA TO SEND ---
        energyTypes: formData.energyTypes.filter(
          (et) => et.type
        ),
        // --- END INCLUDE ENERGY TYPES ---
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
        navigate(getHomePath());
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
      hideLoading();
    }
  };

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
        // Fallback hardcoded options if API fails
        { name: "Electrical", symbol: "⚡", category: "electrical", hazardLevel: "high" },
        { name: "Hydraulic Pressure", symbol: "💧", category: "hydraulic", hazardLevel: "high" },
        { name: "Pneumatic Pressure", symbol: "💨", category: "pneumatic", hazardLevel: "medium" },
        { name: "Steam", symbol: "🔥", category: "thermal", hazardLevel: "high" },
        { name: "Hot Water", symbol: "🌡️", category: "thermal", hazardLevel: "medium" },
        { name: "Mechanical", symbol: "⚙️", category: "mechanical", hazardLevel: "medium" },
        { name: "Chemical", symbol: "🧪", category: "chemical", hazardLevel: "critical" },
        { name: "Gravity", symbol: "⬇️", category: "mechanical", hazardLevel: "medium" },
        { name: "Spring Energy", symbol: "🔄", category: "mechanical", hazardLevel: "medium" },
        { name: "Kinetic Energy", symbol: "🏃", category: "mechanical", hazardLevel: "medium" },
      ];

  return (
    <div className="create-loto-container">
      <style jsx>{`
        .machine-selection-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 0.5rem;
        }
        
        .select-all-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .select-all-container button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .select-all-container button:hover {
          background: #2563eb;
        }
        
        .selected-count {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }
        
        .machine-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
          max-height: 300px;
          overflow-y: auto;
          padding: 0.5rem;
          background: white;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        
        /* Mobile dropdown style */
        .machine-dropdown {
          display: none;
        }
        
        @media (max-width: 768px) {
          .machine-list {
            display: none;
          }
          
          .machine-dropdown {
            display: block;
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            background: white;
            font-size: 0.875rem;
            color: #374151;
          }
          
          .machine-dropdown:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .select-all-container {
            flex-direction: column;
            gap: 0.75rem;
            align-items: stretch;
          }
          
          .select-all-container button {
            width: 100%;
            padding: 0.75rem;
            font-size: 0.875rem;
          }
          
          .selected-count {
            text-align: center;
            font-size: 0.8rem;
          }
        }
        
        .machine-checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .machine-checkbox-item:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        
        .machine-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #3b82f6;
          cursor: pointer;
        }
        
        .machine-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .machine-name {
          font-weight: 500;
          color: #1e293b;
          font-size: 0.875rem;
        }
        
        .machine-code {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 400;
        }
        
        .machine-checkbox-item:has(.machine-checkbox:checked) {
          background: #eff6ff;
          border-color: #3b82f6;
        }
        
        .machine-checkbox-item:has(.machine-checkbox:checked) .machine-name {
          color: #1e40af;
          font-weight: 600;
        }
        
        .machine-checkbox-item:has(.machine-checkbox:checked) .machine-code {
          color: #3b82f6;
        }
        
        /* Energy Types Loading and Warning Styles */
        .loading-energy-types {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin: 1rem 0;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .no-energy-types-warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 1rem;
          margin-top: 1rem;
          text-align: center;
        }
        
        .no-energy-types-warning p {
          margin: 0.5rem 0;
          color: #92400e;
          font-size: 0.875rem;
        }
        
        .no-energy-types-warning p:first-child {
          font-weight: 600;
        }
        
        /* Energy Types Section Styles */
        .energy-types-container {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
        }
        
        .energy-type-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
        }
        
        .energy-type-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }
        
        .energy-type-card:last-child {
          margin-bottom: 0;
        }
        
        .energy-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .energy-card-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1e293b;
          font-size: 1rem;
        }
        
        .remove-energy-btn {
          background: #fee2e2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          padding: 0.5rem;
          color: #dc2626;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .remove-energy-btn:hover {
          background: #fecaca;
          border-color: #f87171;
          transform: none;
        }
        
        .remove-energy-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f3f4f6;
          border-color: #d1d5db;
          color: #9ca3af;
        }
        
        .energy-card-content {
          display: grid;
          gap: 1rem;
        }
        
        .energy-card-content .form-field {
          margin-bottom: 0;
        }
        
        .energy-card-content .field-label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .energy-card-content .field-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: white;
        }
        
        .energy-card-content .field-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .add-energy-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }
        
        .add-energy-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 3px 8px rgba(59, 130, 246, 0.25);
        }
        
        .add-first-energy-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .add-first-energy-btn:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          background: white;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
        }
        
        .empty-state h4 {
          margin: 1rem 0 0.5rem 0;
          color: #374151;
          font-size: 1.125rem;
        }
        
        .empty-state p {
          margin: 0 0 1rem 0;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        /* Energy Review Styles */
        .energy-category {
          color: #6b7280;
          font-size: 0.875rem;
          font-style: italic;
        }
        
        .energy-hazard {
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }
        
        .energy-hazard.hazard-low {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }
        
        .energy-hazard.hazard-medium {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #f59e0b;
        }
        
        .energy-hazard.hazard-high {
          background: #fed7aa;
          color: #c2410c;
          border: 1px solid #fb923c;
        }
        
        .energy-hazard.hazard-critical {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
        
        .energy-description {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f9fafb;
          border-radius: 4px;
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .isolation-point-optional {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 400;
        }
        
        .field-input.has-value {
          border-color: #10b981;
          background: #f0fdf4;
        }
        
        .field-input.empty-value {
          border-color: #f59e0b;
          background: #fffbeb;
        }
        
        .isolation-point-status {
          margin-top: 0.5rem;
        }
        
        .status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .status-indicator.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }
        
        .status-indicator.warning {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #f59e0b;
        }
        
        .energy-type-card.invalid {
          border-color: #ef4444;
          background: #fef2f2;
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .energy-types-summary {
          margin-top: 1rem;
        }
        
        .energy-types-summary p {
          margin: 0.5rem 0;
          color: #374151;
        }
        
        .energy-types-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0.75rem 0;
          justify-content: center;
        }
        
        .energy-type-preview {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #0369a1;
        }
      `}</style>
      <BackButton to={currentUser ? getHomePath() : "/technician-home"} label={t('common.back')} />
      
      
      
      {/* Desktop Header Section - Hidden on mobile */}
      <div className="create-loto-header d-none d-md-block">
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <Icon name="plus" size="xl" />
                </div>
            <div className="header-text">
              <h1>{t('createLoto.title')}</h1>
              <p>Lockout/Tagout Safety Procedure</p>
            </div>
          </div>
          <div className="header-actions">
            <ActionButton
              variant="secondary"
              icon="list"
              onClick={() => navigate(getHomePath())}
            >
              My LOTOs
            </ActionButton>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div 
            className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${stepValidation[1] ? 'completed valid' : currentStep === 1 ? 'invalid' : ''}`}
            onClick={() => goToStep(1)}
          >
            <div className="step-number">
              {stepValidation[1] ? <Icon name="check" size="sm" /> : '1'}
                </div>
            <span>{t('createLoto.step1Title')}</span>
              </div>
          <div className={`progress-line ${currentStep > 1 ? 'completed' : ''}`}></div>
          <div 
            className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${stepValidation[2] ? 'completed valid' : currentStep === 2 ? 'invalid' : ''}`}
            onClick={() => goToStep(2)}
          >
            <div className="step-number">
              {stepValidation[2] ? <Icon name="check" size="sm" /> : '2'}
            </div>
            <span>{t('createLoto.step2Title')}</span>
          </div>
          <div className={`progress-line ${currentStep > 2 ? 'completed' : ''}`}></div>
          <div 
            className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${stepValidation[3] ? 'completed valid' : currentStep === 3 ? 'invalid' : ''}`}
            onClick={() => goToStep(3)}
          >
            <div className="step-number">
              {stepValidation[3] ? <Icon name="check" size="sm" /> : '3'}
            </div>
            <span>{t('createLoto.step3Title')}</span>
          </div>
          <div className={`progress-line ${currentStep > 3 ? 'completed' : ''}`}></div>
          <div 
            className={`progress-step ${currentStep >= 4 ? 'active' : ''} ${stepValidation[4] ? 'completed valid' : currentStep === 4 ? 'invalid' : ''}`}
            onClick={() => goToStep(4)}
          >
            <div className="step-number">
              {stepValidation[4] ? <Icon name="check" size="sm" /> : '4'}
            </div>
            <span>{t('createLoto.step4Title')}</span>
          </div>
          <div className={`progress-line ${currentStep > 4 ? 'completed' : ''}`}></div>
          <div 
            className={`progress-step ${currentStep >= 5 ? 'active' : ''}`}
            onClick={() => goToStep(5)}
          >
            <div className="step-number">5</div>
            <span>Review</span>
          </div>
        </div>
      </div>

      {/* Mobile-First Header - Show only on mobile */}
      <div className="create-loto-mobile-header d-md-none">
        {/* Mobile Progress Indicator - Compact */}
        <div className="mobile-progress-indicator">
          <div className="progress-dots">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`progress-dot ${currentStep >= step ? 'active' : ''} ${stepValidation[step] ? 'completed valid' : currentStep === step ? 'invalid' : ''}`}
                onClick={() => goToStep(step)}
              >
                {stepValidation[step] ? <Icon name="check" size="xs" /> : step}
              </div>
            ))}
          </div>
          <div className="progress-text">
            {t('createLoto.stepOf')} {currentStep} {t('createLoto.of')} 5: {
              currentStep === 1 ? t('createLoto.step1Title') :
              currentStep === 2 ? t('createLoto.step2Title') :
              currentStep === 3 ? t('createLoto.step3Title') :
              currentStep === 4 ? t('createLoto.step4Title') :
              t('createLoto.step5Title')
            }
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={onSubmit} className="create-loto-form">
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
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
              <div className="form-field">
                <label className="field-label">
                  <Icon name="clock" size="sm" />
                  <span>{t('createLoto.shift')}</span>
                </label>
                      <select
                        name="shift"
                        value={shift}
                        onChange={onChange}
                  className="field-input"
                  required
                >
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                  <option value="C">Shift C</option>
                      </select>
                  </div>

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
                  placeholder="Enter PTW number or leave as N/A"
                  className="field-input"
                />
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Step 2: Location Selection */}
        {currentStep === 2 && (
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
                      {/* Step 1: Main Location */}
              <div className="hierarchy-step">
                <label className="field-label">
                  <Icon name="home" size="sm" />
                  <span>{t('createLoto.primaryLocation')}</span>
                </label>
                        <select
                          name="location"
                          value={location}
                          onChange={handleLocationChange}
                  className="field-input location-select"
                          required
                          disabled={loadingLocations}
                        >
                          <option value="">
                            {loadingLocations ? "Loading locations..." : "-- Select Location --"}
                          </option>
                          {availableLocations.map((loc) => (
                            <option key={loc._id} value={loc.code}>
                              {loc.name}
                            </option>
                          ))}
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Custom Location Input */}
                      {showCustomLocation && (
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
                    placeholder="Enter custom location name"
                    className="field-input"
                            required
                          />
                        </div>
                      )}

                      {/* Only show Line/Machine selectors if NOT "Other" location */}
                      {!showCustomLocation && location && (
                <div className="location-steps">
                          {/* Step 2: Line Selection */}
                  <div className="hierarchy-step">
                    <label className="field-label">
                      <Icon name="zap" size="sm" />
                      <span>
                        {currentLineLabel}
                      </span>
                            </label>
                            <select
                              name="line"
                              value={line}
                              onChange={handleLineChange}
                      className="field-input"
                              required
                              disabled={!location || location === "Other" || availableLines.length === 0}
                            >
                              <option value="">
                        {availableLines.length === 0 
                          ? `No ${currentLineLabel.toLowerCase()} available` 
                          : `-- Select ${currentLineLabel} --`}
                              </option>
                              {availableLines.map((lineItem) => (
                                <option key={lineItem._id} value={lineItem.code}>
                                  {lineItem.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Step 3: Machine/Part Selection (Multi-select) */}
                          {line && (
                    <div className="hierarchy-step">
                      <label className="field-label">
                        <Icon name="settings" size="sm" />
                        <span>{currentMachineLabel} (Select one or more)</span>
                              </label>
                              
                              {availableMachines.length === 0 ? (
                                <div className="no-machines-message">
                                  No {currentMachineLabel.toLowerCase()} available
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
                                      {machines.length === availableMachines.length ? '☑ Deselect All' : '☐ Select All'}
                                    </button>
                                    <span className="selected-count">
                                      {machines.length} of {availableMachines.length} selected
                                    </span>
                                  </div>

                                  {/* Machine Dropdown for Mobile */}
                                  <select
                                    className="machine-dropdown"
                                    multiple
                                    size={Math.min(availableMachines.length, 8)}
                                    value={machines}
                                    onChange={(e) => {
                                      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                                      setFormData({ ...formData, machines: selectedValues });
                                    }}
                                  >
                                    {availableMachines.map((machineItem) => (
                                      <option key={machineItem._id} value={machineItem.code}>
                                        {machineItem.name} ({machineItem.code})
                                      </option>
                                    ))}
                                  </select>

                                  {/* Machine Checkboxes for Desktop */}
                                  <div className="machine-list">
                                    {availableMachines.map((machineItem) => (
                                      <label 
                                        key={machineItem._id} 
                                        className="machine-checkbox-item"
                                      >
                                        <input
                                          type="checkbox"
                                          className="machine-checkbox"
                                          checked={machines.includes(machineItem.code)}
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

                  {/* Custom Machine Input - PLACEHOLDER TO REMOVE */}
                  {false && (
                    <div>
                        {/* PKG Line A Machines - OLD HARDCODED VERSION */}
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
                            <option value="DA19">DA19</option>
                            <option value="DA20">DA20</option>
                            <option value="DA21">DA21</option>
                            <option value="DA22">DA22</option>
                            <option value="DA23">DA23</option>
                            <option value="DA24">DA24</option>
                            <option value="DA25">DA25</option>
                            <option value="DA26">DA26</option>
                            <option value="DA27">DA27</option>
                            <option value="DA28">DA28</option>
                            <option value="DA29">DA29</option>
                            <option value="DA30">DA30</option>
                            <option value="DA31">DA31</option>
                            <option value="DA32">DA32</option>
                            <option value="DA33">DA33</option>
                            <option value="DA34">DA34</option>
                            <option value="DA35">DA35</option>
                            <option value="DA36">DA36</option>
                            <option value="DA37">DA37</option>
                            <option value="DA38">DA38</option>
                            <option value="DA39">DA39</option>
                            <option value="DA40">DA40</option>
                            <option value="DA41">DA41</option>
                            <option value="DA42">DA42</option>
                            <option value="DA43">DA43</option>
                            <option value="DA44">DA44</option>
                            <option value="DA45">DA45</option>
                            <option value="DA46">DA46</option>
                            <option value="DA47">DA47</option>
                            <option value="DA48">DA48</option>
                            <option value="DA49">DA49</option>
                            <option value="DA50">DA50</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}

                        {/* PKG Line B Machines */}
                                {location === "PKG" && line === "B" && (
                                  <>
                                    <option value="DB01">DB01</option>
                                    <option value="DB02">DB02</option>
                                    <option value="DB03">DB03</option>
                                    <option value="DB04">DB04</option>
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
                            <option value="DB19">DB19</option>
                            <option value="DB20">DB20</option>
                            <option value="DB21">DB21</option>
                            <option value="DB22">DB22</option>
                            <option value="DB23">DB23</option>
                            <option value="DB24">DB24</option>
                            <option value="DB25">DB25</option>
                            <option value="DB26">DB26</option>
                            <option value="DB27">DB27</option>
                            <option value="DB28">DB28</option>
                            <option value="DB29">DB29</option>
                            <option value="DB30">DB30</option>
                            <option value="DB31">DB31</option>
                            <option value="DB32">DB32</option>
                            <option value="DB33">DB33</option>
                            <option value="DB34">DB34</option>
                            <option value="DB35">DB35</option>
                            <option value="DB36">DB36</option>
                            <option value="DB37">DB37</option>
                            <option value="DB38">DB38</option>
                            <option value="DB39">DB39</option>
                            <option value="DB40">DB40</option>
                            <option value="DB41">DB41</option>
                            <option value="DB42">DB42</option>
                            <option value="DB43">DB43</option>
                            <option value="DB44">DB44</option>
                            <option value="DB45">DB45</option>
                            <option value="DB46">DB46</option>
                            <option value="DB47">DB47</option>
                            <option value="DB48">DB48</option>
                            <option value="DB49">DB49</option>
                            <option value="DB50">DB50</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}

                        {/* PKG Line C Machines */}
                                {location === "PKG" && line === "C" && (
                                  <>
                                    <option value="DC01">DC01</option>
                                    <option value="DC02">DC02</option>
                                    <option value="DC03">DC03</option>
                                    <option value="DC04">DC04</option>
                                    <option value="DC05">DC05</option>
                                    <option value="DC06">DC06</option>
                                    <option value="DC07">DC07</option>
                                    <option value="DC08">DC08</option>
                            <option value="DC09">DC09</option>
                            <option value="DC10">DC10</option>
                            <option value="DC11">DC11</option>
                            <option value="DC12">DC12</option>
                            <option value="DC13">DC13</option>
                            <option value="DC14">DC14</option>
                            <option value="DC15">DC15</option>
                            <option value="DC16">DC16</option>
                            <option value="DC17">DC17</option>
                            <option value="DC18">DC18</option>
                            <option value="DC19">DC19</option>
                            <option value="DC20">DC20</option>
                            <option value="DC21">DC21</option>
                            <option value="DC22">DC22</option>
                            <option value="DC23">DC23</option>
                            <option value="DC24">DC24</option>
                            <option value="DC25">DC25</option>
                            <option value="DC26">DC26</option>
                            <option value="DC27">DC27</option>
                            <option value="DC28">DC28</option>
                            <option value="DC29">DC29</option>
                            <option value="DC30">DC30</option>
                            <option value="DC31">DC31</option>
                            <option value="DC32">DC32</option>
                            <option value="DC33">DC33</option>
                            <option value="DC34">DC34</option>
                            <option value="DC35">DC35</option>
                            <option value="DC36">DC36</option>
                            <option value="DC37">DC37</option>
                            <option value="DC38">DC38</option>
                            <option value="DC39">DC39</option>
                            <option value="DC40">DC40</option>
                            <option value="DC41">DC41</option>
                            <option value="DC42">DC42</option>
                            <option value="DC43">DC43</option>
                            <option value="DC44">DC44</option>
                            <option value="DC45">DC45</option>
                            <option value="DC46">DC46</option>
                            <option value="DC47">DC47</option>
                            <option value="DC48">DC48</option>
                            <option value="DC49">DC49</option>
                            <option value="DC50">DC50</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}

                        {/* PKG Line D Machines */}
                                {location === "PKG" && line === "D" && (
                                  <>
                                    <option value="DD01">DD01</option>
                                    <option value="DD02">DD02</option>
                                    <option value="DD03">DD03</option>
                                    <option value="DD04">DD04</option>
                            <option value="DD05">DD05</option>
                            <option value="DD06">DD06</option>
                            <option value="DD07">DD07</option>
                            <option value="DD08">DD08</option>
                            <option value="DD09">DD09</option>
                            <option value="DD10">DD10</option>
                            <option value="DD11">DD11</option>
                            <option value="DD12">DD12</option>
                            <option value="DD13">DD13</option>
                            <option value="DD14">DD14</option>
                            <option value="DD15">DD15</option>
                            <option value="DD16">DD16</option>
                            <option value="DD17">DD17</option>
                            <option value="DD18">DD18</option>
                            <option value="DD19">DD19</option>
                            <option value="DD20">DD20</option>
                            <option value="DD21">DD21</option>
                            <option value="DD22">DD22</option>
                            <option value="DD23">DD23</option>
                            <option value="DD24">DD24</option>
                            <option value="DD25">DD25</option>
                            <option value="DD26">DD26</option>
                            <option value="DD27">DD27</option>
                            <option value="DD28">DD28</option>
                            <option value="DD29">DD29</option>
                            <option value="DD30">DD30</option>
                            <option value="DD31">DD31</option>
                            <option value="DD32">DD32</option>
                            <option value="DD33">DD33</option>
                            <option value="DD34">DD34</option>
                            <option value="DD35">DD35</option>
                            <option value="DD36">DD36</option>
                            <option value="DD37">DD37</option>
                            <option value="DD38">DD38</option>
                            <option value="DD39">DD39</option>
                            <option value="DD40">DD40</option>
                            <option value="DD41">DD41</option>
                            <option value="DD42">DD42</option>
                            <option value="DD43">DD43</option>
                            <option value="DD44">DD44</option>
                            <option value="DD45">DD45</option>
                            <option value="DD46">DD46</option>
                            <option value="DD47">DD47</option>
                            <option value="DD48">DD48</option>
                            <option value="DD49">DD49</option>
                            <option value="DD50">DD50</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}

                        {/* PKG Multi-Bag Machines */}
                                {location === "PKG" && line === "Multi-Bag" && (
                                  <>
                            <option value="MB01">MB01</option>
                            <option value="MB02">MB02</option>
                            <option value="MB03">MB03</option>
                            <option value="MB04">MB04</option>
                            <option value="MB05">MB05</option>
                            <option value="MB06">MB06</option>
                            <option value="MB07">MB07</option>
                            <option value="MB08">MB08</option>
                            <option value="MB09">MB09</option>
                            <option value="MB10">MB10</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}

                        {/* Process Lines */}
                        {location === "Process" && line === "PC" && (
                          <>
                            <option value="PC01">PC01</option>
                            <option value="PC02">PC02</option>
                            <option value="PC03">PC03</option>
                            <option value="PC04">PC04</option>
                            <option value="PC05">PC05</option>
                                    <option value="Other">Other</option>
                                  </>
                                )}

                        {location === "Process" && line === "TC" && (
                          <>
                            <option value="TC01">TC01</option>
                            <option value="TC02">TC02</option>
                            <option value="TC03">TC03</option>
                            <option value="TC04">TC04</option>
                            <option value="TC05">TC05</option>
                                      <option value="Other">Other</option>
                                    </>
                                  )}

                        {location === "Process" && line === "FCP" && (
                          <>
                            <option value="FCP01">FCP01</option>
                            <option value="FCP02">FCP02</option>
                            <option value="FCP03">FCP03</option>
                            <option value="FCP04">FCP04</option>
                            <option value="FCP05">FCP05</option>
                            <option value="Other">Other</option>
                          </>
                        )}

                        {location === "Process" && line === "RBS" && (
                          <>
                            <option value="RBS01">RBS01</option>
                            <option value="RBS02">RBS02</option>
                            <option value="RBS03">RBS03</option>
                            <option value="RBS04">RBS04</option>
                            <option value="RBS05">RBS05</option>
                            <option value="Other">Other</option>
                        </>
                      )}

                        {location === "Process" && line === "CKF" && (
                          <>
                            <option value="CKF01">CKF01</option>
                            <option value="CKF02">CKF02</option>
                            <option value="CKF03">CKF03</option>
                            <option value="CKF04">CKF04</option>
                            <option value="CKF05">CKF05</option>
                            <option value="Other">Other</option>
                          </>
                        )}

                        {/* Utility Parts */}
                        {location === "Utility" && (
                          <>
                            <option value="Chiller-01">Chiller-01</option>
                            <option value="Chiller-02">Chiller-02</option>
                            <option value="AC-01">AC-01</option>
                            <option value="AC-02">AC-02</option>
                            <option value="Pump-01">Pump-01</option>
                            <option value="Pump-02">Pump-02</option>
                            <option value="Gate-01">Gate-01</option>
                            <option value="Gate-02">Gate-02</option>
                            <option value="Other">Other</option>
                          </>
                        )}

                        {/* WH-FG Parts */}
                        {location === "WH-FG" && (
                          <>
                            <option value="Gate-FG-01">Gate-FG-01</option>
                            <option value="Gate-FG-02">Gate-FG-02</option>
                            <option value="Dock-Leveler-01">Dock-Leveler-01</option>
                            <option value="Dock-Leveler-02">Dock-Leveler-02</option>
                            <option value="Crate-Dumper-01">Crate-Dumper-01</option>
                            <option value="Pallet-Inverter-01">Pallet-Inverter-01</option>
                            <option value="Banker-01">Banker-01</option>
                            <option value="Banker-02">Banker-02</option>
                            <option value="Other">Other</option>
                          </>
                        )}

                        {/* WH-RM Parts */}
                        {location === "WH-RM" && (
                          <>
                            <option value="Gate-RM-01">Gate-RM-01</option>
                            <option value="Gate-RM-02">Gate-RM-02</option>
                            <option value="Dock-Leveler-RM-01">Dock-Leveler-RM-01</option>
                            <option value="Dock-Leveler-RM-02">Dock-Leveler-RM-02</option>
                            <option value="Crate-Dumper-RM-01">Crate-Dumper-RM-01</option>
                            <option value="Pallet-Inverter-RM-01">Pallet-Inverter-RM-01</option>
                            <option value="Banker-RM-01">Banker-RM-01</option>
                            <option value="Banker-RM-02">Banker-RM-02</option>
                            <option value="Other">Other</option>
                          </>
                        )}

                        {/* Project Parts */}
                        {location === "Project" && (
                          <>
                            <option value="Project-Equipment-01">Project-Equipment-01</option>
                            <option value="Project-Equipment-02">Project-Equipment-02</option>
                            <option value="Other">Other</option>
                          </>
                        )}
                    </div>
                  )}


                      {/* Display Selected Location Path */}
                      {(location || line || machines.length > 0) && (
                    <div className="hierarchy-step">
                      <div className="location-path">
                        <Icon name="map-pin" size="sm" />
                        <strong>{t('createLoto.selectedPath')}:</strong>
                        <span>
                              {location === "Other" && customLocation
                                ? customLocation
                                : location}
                              {line && ` > ${line}`}
                              {machines.length > 0 && ` > ${machines.join(', ')}`}
                            </span>
                          </div>
                        </div>
                      )}

                  {/* Isolated Part Description */}
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
                      placeholder="Describe the specific part to be isolated (optional)"
                      className="field-input"
                      />
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Step 3: Work Details */}
        {currentStep === 3 && (
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
                        placeholder="Enter custom reason"
                    className="field-input"
                        required
                      />
                    </div>
                  )}

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
                  <option value="">-- No Supervisor Assigned --</option>
                  {fetchingSupervisors ? (
                    <option disabled>Loading supervisors...</option>
                  ) : (
                    safeSupervisors.map((sup) => (
                      <option key={sup._id} value={sup._id}>
                        {sup.firstName} {sup.lastName}
                      </option>
                    ))
                  )}
                </select>
                    </div>
                  </div>
          </div>
        </div>
        )}

        {/* Step 4: Energy Types */}
        {currentStep === 4 && (
          <div className="form-section">
          <div className="section-header">
            <div className="section-icon">
              <Icon name="zap" size="md" />
            </div>
            <div className="section-title">
              <h3>{t('createLoto.energyTypesToIsolate')}</h3>
              <p>Select all energy sources that need to be locked out. Isolation points are optional but recommended for safety.</p>
            </div>
          </div>
          
          <div className="section-content">
            <div className="energy-types-container">
              {loadingEnergyTypes ? (
                <div className="loading-energy-types">
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading available energy types...</p>
                  </div>
                </div>
              ) : formData.energyTypes.length === 0 ? (
                <div className="empty-energy-types">
                  <div className="empty-state">
                    <Icon name="zap" size="lg" />
                    <h4>{t('createLoto.noEnergyTypesAdded')}</h4>
                    <p>Add energy sources that need to be locked out during this LOTO procedure. You can specify isolation points for better safety documentation.</p>
                    {availableEnergyTypes.length === 0 ? (
                      <div className="no-energy-types-warning">
                        <p>⚠️ No energy types are currently available.</p>
                        <p>Contact your administrator to add energy types to the system.</p>
                      </div>
                    ) : (
                      <div className="energy-types-summary">
                        <p><strong>Available Energy Types:</strong> {availableEnergyTypes.length}</p>
                        <div className="energy-types-preview">
                          {availableEnergyTypes.slice(0, 3).map((et, idx) => (
                            <span key={idx} className="energy-type-preview">
                              {et.symbol} {et.name}
                            </span>
                          ))}
                          {availableEnergyTypes.length > 3 && (
                            <span className="energy-type-preview">+{availableEnergyTypes.length - 3} more</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="add-first-energy-btn"
                          onClick={addEnergyType}
                        >
                          <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                            <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{t('createLoto.addEnergyType')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {formData.energyTypes.map((energy, index) => (
                <div key={index} className="energy-type-card" data-energy-index={index}>
                  <div className="energy-card-header">
                    <div className="energy-card-title">
                      <Icon name="zap" size="sm" />
                      <span>{t('createLoto.energySource')} {index + 1}</span>
                    </div>
                            <button
                              type="button"
                      className="remove-energy-btn"
                              onClick={() => removeEnergyType(index)}
                              disabled={energyTypes.length <= 1}
                      title="Remove energy type"
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
                                <option value="">Select energy type</option>
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
                        <span className="isolation-point-optional">(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={energy.isolationPoint}
                                onChange={(e) =>
                          handleEnergyTypeChange(index, "isolationPoint", e.target.value)
                        }
                        placeholder="e.g., Panel A-Switch 3, Valve B-12 (optional)"
                        className={`field-input ${energy.isolationPoint ? 'has-value' : 'empty-value'}`}
                              />
                              {energy.isolationPoint && (
                                <div className="isolation-point-status">
                                  <span className="status-indicator success">✓ Isolation point specified</span>
                                </div>
                              )}
                              {!energy.isolationPoint && (
                                <div className="isolation-point-status">
                                  <span className="status-indicator warning">⚠ No isolation point specified</span>
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

        {/* Step 5: Review */}
        {currentStep === 5 && (
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Icon name="eye" size="md" />
                        </div>
              <div className="section-title">
                <h3>{t('createLoto.reviewYourLoto')}</h3>
                <p>{t('createLoto.pleaseReviewDesc')}</p>
              </div>
            </div>
            
            <div className="section-content">
              <div className="review-grid">
                {/* Basic Information Review */}
                <div className="review-section">
                  <h4><Icon name="info" size="sm" /> {t('createLoto.basicInformation')}</h4>
                  <div className="review-item">
                    <span className="review-label">{t('createLoto.shift')}:</span>
                    <span className="review-value">{formData.shift}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">{t('createLoto.expectedDuration')}:</span>
                    <span className="review-value">{formData.expectedDuration} hours</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">{t('createLoto.ptwNumber')}:</span>
                    <span className="review-value">{formData.ptwNumber || "N/A"}</span>
                  </div>
                </div>

                {/* Location Review */}
                <div className="review-section">
                  <h4><Icon name="map-pin" size="sm" /> {t('createLoto.locationDetails')}</h4>
                  <div className="review-item">
                    <span className="review-label">{t('createLoto.location')}:</span>
                    <span className="review-value">
                      {showCustomLocation ? customLocation : formData.location}
                    </span>
                  </div>
                  {!showCustomLocation && (
                    <>
                      <div className="review-item">
                        <span className="review-label">Line/Part:</span>
                        <span className="review-value">{formData.line}</span>
                      </div>
                      <div className="review-item">
                        <span className="review-label">Machine(s):</span>
                        <span className="review-value">
                          {formData.machines.length > 0 ? formData.machines.join(', ') : 'None selected'}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="review-item">
                    <span className="review-label">Isolated Part:</span>
                    <span className="review-value">{formData.isolatedPart}</span>
                      </div>
                </div>

                {/* Work Details Review */}
                <div className="review-section">
                  <h4><Icon name="clipboard" size="sm" /> {t('createLoto.workDetails')}</h4>
                  <div className="review-item">
                    <span className="review-label">{t('createLoto.reason')}:</span>
                    <span className="review-value">
                      {showCustomReason ? customReason : formData.reason}
                    </span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Supervisor:</span>
                    <span className="review-value">
                      {formData.supervisor 
                        ? safeSupervisors.find(s => s._id === formData.supervisor)?.firstName + " " + 
                          safeSupervisors.find(s => s._id === formData.supervisor)?.lastName
                        : "No supervisor assigned"
                      }
                    </span>
                    </div>
                  </div>

                {/* Energy Types Review */}
                <div className="review-section ">
                  <h4><Icon name="zap" size="sm" /> {t('createLoto.energyTypesToIsolate')}</h4>
                  <div className="energy-review-grid">
                    {formData.energyTypes.filter(et => et.type).length > 0 ? (
                      formData.energyTypes.filter(et => et.type).map((energy, index) => {
                        const energyTypeInfo = energyTypeOptions.find(eto => eto.name === energy.type);
                        return (
                          <div key={index} className="energy-review-item">
                            <div className="energy-type">
                              {energyTypeInfo?.symbol} {energy.type}
                              {energyTypeInfo?.category && (
                                <span className="energy-category"> ({energyTypeInfo.category})</span>
                              )}
                              {energyTypeInfo?.hazardLevel && (
                                <span className={`energy-hazard hazard-${energyTypeInfo.hazardLevel}`}>
                                  [{energyTypeInfo.hazardLevel.toUpperCase()}]
                                </span>
                              )}
                            </div>
                            <div className="isolation-point">
                              <strong>Isolation Point:</strong> {energy.isolationPoint || 'Not specified'}
                            </div>
                            {energyTypeInfo?.description && (
                              <div className="energy-description">
                                <strong>Description:</strong> {energyTypeInfo.description}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-energy-types">
                        <p>⚠️ No energy types have been configured yet.</p>
                        <p>Please go back to Step 4 to add energy types and isolation points.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="wizard-navigation">
          <div className="nav-buttons">
            {currentStep > 1 && (
              <button
                type="button"
                className="nav-btn btn-secondary"
                onClick={prevStep}
              >
                <Icon name="chevron-left" size="sm" />
                <span>{t('createLoto.previous')}</span>
              </button>
            )}

            {currentStep < 5 && (
              <button
                type="button"
                className="nav-btn btn-primary"
                onClick={nextStep}
              >
                <span>{t('createLoto.next')}</span>
                <Icon name="chevron-right" size="sm" />
              </button>
            )}

            {currentStep === 5 && (
              <button
                type="submit"
                className="nav-btn btn-success submit-btn"
                disabled={!stepValidation[1] || !stepValidation[2] || !stepValidation[3] || formData.energyTypes.filter(et => et.type).length === 0}
              >
                <Icon name="check" size="sm" />
                <span>{t('createLoto.createLotoProcedure')}</span>
              </button>
            )}

            <button
              type="button"
              className="nav-btn btn-outline cancel-btn"
              onClick={() => navigate(getHomePath())}
            >
              <Icon name="x" size="sm" />
              <span>{t('createLoto.cancel')}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateLOTO;