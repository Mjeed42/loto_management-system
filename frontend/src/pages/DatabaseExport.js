import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const DatabaseExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState({
    lotos: true,
    users: true,
    locations: true,
    energytypes: true,
    handovernotifications: true,
  });
  const [collectionData, setCollectionData] = useState({});
  const [fetchingCollections, setFetchingCollections] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
    fetchAvailableCollections();
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

  const fetchAvailableCollections = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch metadata about available collections
      const collections = [
        { name: "lotos", displayName: "LOTO Records", description: "All LOTO procedures and their complete data (includes dynamic handover history)", icon: "📋" },
        { name: "users", displayName: "Users", description: "All system users and their information", icon: "👥" },
        { name: "locations", displayName: "Locations", description: "Complete location hierarchy (locations, lines, machines)", icon: "📍" },
        { name: "energytypes", displayName: "Energy Types", description: "All available energy isolation types", icon: "⚡" },
        { name: "handovernotifications", displayName: "Handover Notifications", description: "All handover notifications (system-wide for admin)", icon: "🔔" },
      ];

      setCollections(collections);
    } catch (err) {
      console.error("Error fetching collections:", err);
    }
  };

  const fetchCollectionData = async (collectionName) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let endpoint = "";
      switch (collectionName) {
        case "lotos":
          endpoint = "https://loto-backend-643788243736.europe-west1.run.app/api/loto";
          break;
        case "users":
          endpoint = "https://loto-backend-643788243736.europe-west1.run.app/api/admin/users";
          break;
        case "locations":
          endpoint = "https://loto-backend-643788243736.europe-west1.run.app/api/locations";
          break;
        case "energytypes":
          endpoint = "https://loto-backend-643788243736.europe-west1.run.app/api/energy-types";
          break;
        case "handovernotifications":
          endpoint = "https://loto-backend-643788243736.europe-west1.run.app/api/notifications/handover/all";
          break;
        default:
          throw new Error(`Unknown collection: ${collectionName}`);
      }

      const res = await axios.get(endpoint, config);
      
      // Handle different response formats
      let data = [];
      if (res.data.data) {
        if (res.data.data.notifications) {
          // Handover notifications format (old endpoint)
          data = res.data.data.notifications;
        } else if (Array.isArray(res.data.data)) {
          // Direct array in data field (new admin endpoint)
          data = res.data.data;
        } else {
          data = [res.data.data];
        }
      } else if (res.data.notifications) {
        // Direct notifications array
        data = res.data.notifications;
      } else if (res.data.users) {
        // Users endpoint format
        data = res.data.users;
      } else if (Array.isArray(res.data)) {
        // Direct array response
        data = res.data;
      }

      return data;
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      throw err;
    }
  };

  const formatCollectionForExcel = (collectionName, data) => {
    if (!data || data.length === 0) return [];

    switch (collectionName) {
      case "lotos":
        return formatLOTOsData(data);
      case "users":
        return formatUsersData(data);
      case "locations":
        return formatLocationsData(data);
      case "energytypes":
        return formatEnergyTypesData(data);
      case "handovernotifications":
        return formatHandoverNotificationsData(data);
      default:
        // Generic formatter - flatten all fields
        return formatGenericData(data);
    }
  };

  const formatGenericData = (data) => {
    return data.map(item => {
      const flattened = {};
      Object.keys(item).forEach(key => {
        const value = item[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Flatten nested objects
          Object.keys(value).forEach(nestedKey => {
            flattened[`${key}_${nestedKey}`] = value[nestedKey];
          });
        } else if (Array.isArray(value)) {
          flattened[key] = JSON.stringify(value);
        } else {
          flattened[key] = value;
        }
      });
      return flattened;
    });
  };

  const formatLOTOsData = (lotos) => {
    // Find maximum handovers across all LOTOs (DYNAMIC)
    const maxHandoversInData = lotos.reduce((max, loto) => {
      const handoverCount = loto.handoverHistory?.length || 0;
      return Math.max(max, handoverCount);
    }, 0);
    
    const dynamicMaxHandovers = Math.max(maxHandoversInData, 3);
    
    console.log(`📊 Database Export - LOTO: Found max ${maxHandoversInData} handovers. Creating ${dynamicMaxHandovers} handover sets.`);
    
    return lotos.map(loto => {
      const formattedLoto = {
        // === BASIC INFORMATION ===
        "ID": loto._id,
        "Serial Number": loto.serialNumber,
        "Date": loto.date ? new Date(loto.date).toLocaleString() : "N/A",
        "Shift": loto.shift,
        "Status": loto.status,
        
        // === LOCATION ===
        "Location": loto.location,
        "Line": loto.line || "N/A",
        "Machine": loto.machine || "N/A",
        "Isolated Part": loto.isolatedPart,
        
        // === WORK DETAILS ===
        "Reason": loto.reason,
        "PTW Number": loto.ptwNumber || "N/A",
        "Expected Duration (hrs)": loto.expectedDuration,
        "Work Summary": loto.workSummary || "N/A",
        
        // === PEOPLE ===
        "Isolator Name": loto.isolatorName,
        "Isolator ID": loto.isolator?._id || loto.isolator || "N/A",
        "Supervisor Name": loto.supervisorName || "N/A",
        "Supervisor ID": loto.supervisor?._id || loto.supervisor || "N/A",
        "Current Responsible": loto.currentResponsibleName || loto.isolatorName,
        "Assigned Technician": loto.assignedTechnician || "N/A",
        
        // === HANDOVER SUMMARY ===
        "Total Handovers": loto.handoverHistory?.length || 0,
        "Responsibility Chain": loto.handoverHistory && loto.handoverHistory.length > 0 
          ? [loto.isolatorName, ...loto.handoverHistory.map(h => h.toUserName)].join(" → ")
          : loto.isolatorName,
        
        // === VERIFICATION ===
        "Verified By": loto.verifiedBy ? "Yes" : "No",
        "Verified At": loto.verifiedAt ? new Date(loto.verifiedAt).toLocaleString() : "N/A",
        
        // === SNAPSHOT ===
        "Is Snapshot": loto.isSnapshot ? "Yes" : "No",
        "Snapshot Reason": loto.snapshotReason || "N/A",
        "Snapshot Created At": loto.snapshotCreatedAt ? new Date(loto.snapshotCreatedAt).toLocaleString() : "N/A",
        "Snapshot Created For": loto.snapshotCreatedForName || "N/A",
        "Original LOTO ID": loto.originalLotoId || "N/A",
        
        // === ENERGY TYPES ===
        "Energy Types Count": loto.energyTypes?.length || 0,
        "Energy Types": loto.energyTypes && loto.energyTypes.length > 0
          ? loto.energyTypes.map(e => `${e.type}: ${e.isolationPoint}`).join(" | ")
          : "N/A",
        
        // === COMPLETION ===
        "Completed By": loto.completedByName || loto.completedBy || "N/A",
        "Completed At": loto.completedAt ? new Date(loto.completedAt).toLocaleString() : "N/A",
        "Actual Finish Time": loto.actualFinishTime ? new Date(loto.actualFinishTime).toLocaleString() : "N/A",
        "Completion Notes": loto.completionNotes || "N/A",
        
        // === REJECTION ===
        "Rejection Count": loto.rejectionHistory?.length || 0,
        "Status Changes Count": loto.statusHistory?.length || 0,
        
        // === TIMESTAMPS ===
        "Created At": loto.createdAt ? new Date(loto.createdAt).toLocaleString() : "N/A",
        "Updated At": loto.updatedAt ? new Date(loto.updatedAt).toLocaleString() : "N/A",
      };
      
      // ==========================================
      // === HANDOVER HISTORY (DETAILED - AT END) ===
      // ==========================================
      if (loto.handoverHistory && loto.handoverHistory.length > 0) {
        for (let i = 0; i < dynamicMaxHandovers; i++) {
          const handoverNum = i + 1;
          const handover = loto.handoverHistory[i];
          
          if (handover) {
            const recipientStatus = handover.recipientStatus || "pending";
            const verificationStatus = handover.verificationStatus || "pending";
            
            let overallStatus = "";
            if (verificationStatus === "approved") {
              overallStatus = "✅ COMPLETED";
            } else if (verificationStatus === "rejected") {
              overallStatus = "❌ REJECTED BY SUPERVISOR";
            } else if (recipientStatus === "rejected") {
              overallStatus = "❌ REJECTED BY RECIPIENT";
            } else if (recipientStatus === "accepted") {
              overallStatus = "⏳ AWAITING SUPERVISOR";
            } else {
              overallStatus = "⏳ AWAITING RECIPIENT";
            }
            
            formattedLoto[`History ${handoverNum} - Overall Status`] = overallStatus;
            formattedLoto[`History ${handoverNum} - From`] = handover.fromUserName || "Unknown";
            formattedLoto[`History ${handoverNum} - To`] = handover.toUserName || "Unknown";
            formattedLoto[`History ${handoverNum} - Transfer Date`] = handover.handoverDate 
              ? new Date(handover.handoverDate).toLocaleString() 
              : "Unknown";
            formattedLoto[`History ${handoverNum} - Type`] = handover.handoverType 
              ? handover.handoverType.replace(/_/g, ' ').toUpperCase() 
              : "OTHER";
            formattedLoto[`History ${handoverNum} - Initiated By`] = handover.createdByName || "Unknown";
            formattedLoto[`History ${handoverNum} - Transfer Notes`] = handover.handoverNotes || "—";
            formattedLoto[`History ${handoverNum} - Recipient Decision`] = 
              recipientStatus === "accepted" ? "✅ ACCEPTED" :
              recipientStatus === "rejected" ? "❌ REJECTED" :
              "⏳ PENDING";
            formattedLoto[`History ${handoverNum} - Recipient Decision Date`] = 
              handover.recipientDecisionDate 
                ? new Date(handover.recipientDecisionDate).toLocaleString()
                : "—";
            formattedLoto[`History ${handoverNum} - Recipient Notes`] = 
              handover.recipientDecisionNotes || "—";
            formattedLoto[`History ${handoverNum} - Supervisor Verification`] = 
              verificationStatus === "approved" ? "✅ APPROVED" :
              verificationStatus === "rejected" ? "❌ REJECTED" :
              recipientStatus === "accepted" ? "⏳ PENDING" :
              "⏸️ ON HOLD";
            formattedLoto[`History ${handoverNum} - Verified By`] = handover.verifiedByName || "—";
            formattedLoto[`History ${handoverNum} - Verification Date`] = 
              handover.verificationDate 
                ? new Date(handover.verificationDate).toLocaleString()
                : "—";
            formattedLoto[`History ${handoverNum} - Supervisor Notes`] = handover.verificationNotes || "—";
            formattedLoto[`History ${handoverNum} - Rejection Reason`] = handover.rejectionReason || "—";
            formattedLoto[`History ${handoverNum} - Assigned Verifier`] = handover.assignedVerifierName || "—";
          } else {
            // Empty columns
            formattedLoto[`History ${handoverNum} - Overall Status`] = "—";
            formattedLoto[`History ${handoverNum} - From`] = "—";
            formattedLoto[`History ${handoverNum} - To`] = "—";
            formattedLoto[`History ${handoverNum} - Transfer Date`] = "—";
            formattedLoto[`History ${handoverNum} - Type`] = "—";
            formattedLoto[`History ${handoverNum} - Initiated By`] = "—";
            formattedLoto[`History ${handoverNum} - Transfer Notes`] = "—";
            formattedLoto[`History ${handoverNum} - Recipient Decision`] = "—";
            formattedLoto[`History ${handoverNum} - Recipient Decision Date`] = "—";
            formattedLoto[`History ${handoverNum} - Recipient Notes`] = "—";
            formattedLoto[`History ${handoverNum} - Supervisor Verification`] = "—";
            formattedLoto[`History ${handoverNum} - Verified By`] = "—";
            formattedLoto[`History ${handoverNum} - Verification Date`] = "—";
            formattedLoto[`History ${handoverNum} - Supervisor Notes`] = "—";
            formattedLoto[`History ${handoverNum} - Rejection Reason`] = "—";
            formattedLoto[`History ${handoverNum} - Assigned Verifier`] = "—";
          }
        }
        
        formattedLoto["Handover History Note"] = `All ${loto.handoverHistory.length} handover(s) shown. Max in dataset: ${dynamicMaxHandovers}`;
      } else {
        // No handovers - add empty columns
        for (let i = 1; i <= dynamicMaxHandovers; i++) {
          formattedLoto[`History ${i} - Overall Status`] = "—";
          formattedLoto[`History ${i} - From`] = "—";
          formattedLoto[`History ${i} - To`] = "—";
          formattedLoto[`History ${i} - Transfer Date`] = "—";
          formattedLoto[`History ${i} - Type`] = "—";
          formattedLoto[`History ${i} - Initiated By`] = "—";
          formattedLoto[`History ${i} - Transfer Notes`] = "—";
          formattedLoto[`History ${i} - Recipient Decision`] = "—";
          formattedLoto[`History ${i} - Recipient Decision Date`] = "—";
          formattedLoto[`History ${i} - Recipient Notes`] = "—";
          formattedLoto[`History ${i} - Supervisor Verification`] = "—";
          formattedLoto[`History ${i} - Verified By`] = "—";
          formattedLoto[`History ${i} - Verification Date`] = "—";
          formattedLoto[`History ${i} - Supervisor Notes`] = "—";
          formattedLoto[`History ${i} - Rejection Reason`] = "—";
          formattedLoto[`History ${i} - Assigned Verifier`] = "—";
        }
        
        formattedLoto["Handover History Note"] = "No handovers";
      }
      
      return formattedLoto;
    });
  };

  const formatUsersData = (users) => {
    return users.map(user => ({
      "ID": user._id,
      "First Name": user.firstName,
      "Last Name": user.lastName,
      "Email": user.email,
      "Role": user.role,
      "Department": user.department || "N/A",
      "Position": user.position || "N/A",
      "Is Active": user.isActive !== false ? "Yes" : "No",
      "Created At": user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
      "Updated At": user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A",
    }));
  };

  const formatLocationsData = (locations) => {
    return locations.map(location => ({
      "ID": location._id,
      "Name": location.name,
      "Code": location.code,
      "Type": location.type,
      "Type Label": location.typeLabel || location.type,
      "Section": location.section || "N/A",
      "Parent ID": location.parent || "N/A",
      "Children Count": location.children?.length || 0,
      "Is Leaf": location.isLeaf ? "Yes" : "No",
      "Is Active": location.isActive !== false ? "Yes" : "No",
      "Description": location.description || "N/A",
      "Created At": location.createdAt ? new Date(location.createdAt).toLocaleString() : "N/A",
      "Updated At": location.updatedAt ? new Date(location.updatedAt).toLocaleString() : "N/A",
    }));
  };

  const formatEnergyTypesData = (energyTypes) => {
    return energyTypes.map(energyType => ({
      "ID": energyType._id,
      "Name": energyType.name,
      "Code": energyType.code,
      "Category": energyType.category || "N/A",
      "Description": energyType.description || "N/A",
      "Is Active": energyType.isActive !== false ? "Yes" : "No",
      "Created At": energyType.createdAt ? new Date(energyType.createdAt).toLocaleString() : "N/A",
      "Updated At": energyType.updatedAt ? new Date(energyType.updatedAt).toLocaleString() : "N/A",
    }));
  };

  const formatHandoverNotificationsData = (notifications) => {
    return notifications.map(notification => ({
      "ID": notification._id,
      "LOTO ID": notification.lotoId?._id || notification.lotoId || "N/A",
      "Serial Number": notification.lotoId?.serialNumber || "N/A",
      "Isolated Part": notification.lotoDetails?.isolatedPart || notification.lotoId?.isolatedPart || "N/A",
      "Reason": notification.lotoDetails?.reason || notification.lotoId?.reason || "N/A",
      "Shift": notification.lotoDetails?.shift || notification.lotoId?.shift || "N/A",
      "Line": notification.lotoDetails?.line || notification.lotoId?.line || "N/A",
      "From User": notification.fromUser 
        ? `${notification.fromUser.firstName} ${notification.fromUser.lastName}` 
        : "Unknown",
      "From User ID": notification.fromUser?._id || "N/A",
      "To User ID": notification.toUser?._id || "N/A",
      "To User": notification.toUser 
        ? `${notification.toUser.firstName} ${notification.toUser.lastName}` 
        : "Unknown",
      "Handover Notes": notification.handoverNotes || "N/A",
      "Status": notification.status,
      "Read": notification.read ? "Yes" : "No",
      "Read At": notification.readAt ? new Date(notification.readAt).toLocaleString() : "N/A",
      "Responded At": notification.respondedAt ? new Date(notification.respondedAt).toLocaleString() : "N/A",
      "Created At": notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "N/A",
    }));
  };

  const handleCollectionToggle = (collectionName) => {
    setSelectedCollections(prev => ({
      ...prev,
      [collectionName]: !prev[collectionName]
    }));
  };

  const handleSelectAll = () => {
    const newSelected = {};
    collections.forEach(col => {
      newSelected[col.name] = true;
    });
    setSelectedCollections(newSelected);
  };

  const handleDeselectAll = () => {
    const newSelected = {};
    collections.forEach(col => {
      newSelected[col.name] = false;
    });
    setSelectedCollections(newSelected);
  };

  const handleExportDatabase = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const selectedList = Object.keys(selectedCollections).filter(
        key => selectedCollections[key]
      );

      if (selectedList.length === 0) {
        setError("Please select at least one collection to export.");
        setLoading(false);
        return;
      }

      setFetchingCollections(true);

      // Fetch all selected collections
      const fetchPromises = selectedList.map(async (collectionName) => {
        const data = await fetchCollectionData(collectionName);
        return { collectionName, data };
      });

      const results = await Promise.all(fetchPromises);
      
      setFetchingCollections(false);

      // Create Excel workbook with multiple sheets
      const workbook = XLSX.utils.book_new();
      
      let totalRecords = 0;
      results.forEach(({ collectionName, data }) => {
        if (data && data.length > 0) {
          const formattedData = formatCollectionForExcel(collectionName, data);
          const worksheet = XLSX.utils.json_to_sheet(formattedData);
          
          // Auto-size columns
          const maxColWidth = 50;
          const minColWidth = 10;
          const colWidths = [];
          
          if (formattedData && formattedData.length > 0) {
            const headers = Object.keys(formattedData[0]);
            headers.forEach((header) => {
              let maxWidth = header.length;
              formattedData.forEach(row => {
                const cellValue = String(row[header] || '');
                maxWidth = Math.max(maxWidth, cellValue.length);
              });
              colWidths.push({ wch: Math.min(Math.max(maxWidth, minColWidth), maxColWidth) });
            });
          }
          
          worksheet["!cols"] = colWidths;
          
          // Get display name for sheet
          const collectionInfo = collections.find(c => c.name === collectionName);
          const sheetName = collectionInfo ? collectionInfo.displayName : collectionName;
          
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
          totalRecords += data.length;
        }
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `Database_Export_${timestamp}.xlsx`;
      
      XLSX.writeFile(workbook, filename);

      setSuccess(
        `✅ Successfully exported database!\n` +
        `  📊 Collections: ${results.length}\n` +
        `  📄 Total Records: ${totalRecords}\n` +
        `  💾 File: ${filename}`
      );
    } catch (err) {
      setError(err.message || "Export failed. Please try again.");
    } finally {
      setLoading(false);
      setFetchingCollections(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="data-export-container animate-fade-in">
        <div className="access-denied">
          <div className="access-icon">
            <svg className="access-svg" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access the database export feature.</p>
          <button className="action-btn primary" onClick={() => navigate("/Home")}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="data-export-container animate-fade-in">
      {/* Header Section */}
      <div className="data-export-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon">
              <svg className="header-svg" viewBox="0 0 24 24" fill="none">
                <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1>Database Export</h1>
              <p>Export complete MongoDB collections to Excel format</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="action-btn secondary"
              onClick={() => navigate("/Home")}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="modern-error-alert">
          <div className="error-icon">
            <svg className="error-svg" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="error-content">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="modern-success-alert">
          <div className="success-icon">
            <svg className="success-svg" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="success-content">
            <h4>Success</h4>
            <p style={{ whiteSpace: 'pre-line' }}>{success}</p>
          </div>
        </div>
      )}

      {/* Collections Selection */}
      <div className="export-options-section">
        <div className="section-header">
          <div className="section-icon">
            <svg className="section-svg" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="section-title">
            <h3>Select Collections to Export</h3>
            <p>Choose which database tables you want to export</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={handleSelectAll}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Select All
          </button>
          <button className="quick-action-btn secondary" onClick={handleDeselectAll}>
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Deselect All
          </button>
        </div>

        {/* Collections Grid */}
        <div className="collections-grid">
          {collections.map((collection) => (
            <div
              key={collection.name}
              className={`collection-card ${selectedCollections[collection.name] ? 'selected' : ''}`}
              onClick={() => handleCollectionToggle(collection.name)}
            >
              <div className="collection-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCollections[collection.name] || false}
                  onChange={() => handleCollectionToggle(collection.name)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="collection-icon">{collection.icon}</div>
              <div className="collection-info">
                <h4>{collection.displayName}</h4>
                <p>{collection.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <div className="export-actions">
          <button
            className="export-btn primary"
            onClick={handleExportDatabase}
            disabled={loading || fetchingCollections}
          >
            {loading || fetchingCollections ? (
              <>
                <div className="spinner-border-sm"></div>
                <span>{fetchingCollections ? 'Fetching Data...' : 'Exporting...'}</span>
              </>
            ) : (
              <>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Export Database</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <h4>About Database Export</h4>
            <ul>
              <li>Each collection will be exported as a separate sheet in the Excel file</li>
              <li>All records from selected collections will be included</li>
              <li>Data is formatted for easy reading and analysis</li>
              <li>Column widths are automatically adjusted</li>
              <li>Export preserves all field data and timestamps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseExport;

