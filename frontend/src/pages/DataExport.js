import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const DataExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [exportOptions, setExportOptions] = useState({
    format: "excel",
    dateRange: "all",
    status: "all",
    includeUsers: true,
    includeEnergyTypes: true,
    includeNotes: true,
    includeAdminActions: false,
  });
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
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

  const fetchAllLOTOs = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
        config
      );
      return res.data.data;
    } catch (err) {
      throw new Error("Failed to fetch LOTO data");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/admin/users",
        config
      );

      // Handle different possible response formats
      let usersData = [];
      if (res.data.users) {
        usersData = res.data.users;
      } else if (res.data.data && res.data.data.users) {
        usersData = res.data.data.users;
      } else if (Array.isArray(res.data.data)) {
        usersData = res.data.data;
      }

      // Ensure it's always an array
      return Array.isArray(usersData) ? usersData : [];
    } catch (err) {
      throw new Error("Failed to fetch users data");
    }
  };

  const filterLOTOs = (lotos) => {
    let filtered = [...lotos];

    // Filter by status
    if (exportOptions.status !== "all") {
      filtered = filtered.filter((loto) => loto.status === exportOptions.status);
    }

    // Filter by date range
    if (exportOptions.dateRange === "custom") {
      if (customDateRange.startDate && customDateRange.endDate) {
        const startDate = new Date(customDateRange.startDate);
        const endDate = new Date(customDateRange.endDate);
        filtered = filtered.filter((loto) => {
          const lotoDate = new Date(loto.date);
          return lotoDate >= startDate && lotoDate <= endDate;
        });
      }
    } else if (exportOptions.dateRange === "last30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter((loto) => {
        const lotoDate = new Date(loto.date);
        return lotoDate >= thirtyDaysAgo;
      });
    } else if (exportOptions.dateRange === "last7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter((loto) => {
        const lotoDate = new Date(loto.date);
        return lotoDate >= sevenDaysAgo;
      });
    }

    return filtered;
  };

  const formatLOTOData = (lotos, users = []) => {
    return lotos.map((loto) => {
      const formattedLoto = {
        "Serial Number": loto.serialNumber,
        "Date Created": new Date(loto.date).toLocaleDateString(),
        "Time Created": new Date(loto.date).toLocaleTimeString(),
        "Shift": loto.shift,
        "Status": loto.status,
        "Isolator Name": loto.isolatorName,
        "Location": loto.location,
        "Line": loto.line || "N/A",
        "Machine": loto.machine || "N/A",
        "Isolated Part": loto.isolatedPart,
        "Reason": loto.reason,
        "PTW Number": loto.ptwNumber,
        "Expected Duration (hours)": loto.expectedDuration,
      };

      // Add supervisor information if available
      if (loto.supervisorName) {
        formattedLoto["Authorized Supervisor"] = loto.supervisorName;
      } else {
        formattedLoto["Authorized Supervisor"] = "None assigned";
      }

      // Add initial verification information (for new LOTO)
      if (loto.verifiedBy) {
        const verifier = users.find((user) => user._id === loto.verifiedBy._id);
        formattedLoto["Initial Verified By"] = verifier 
          ? `${verifier.firstName} ${verifier.lastName}` 
          : `${loto.verifiedBy.firstName} ${loto.verifiedBy.lastName}`;
        formattedLoto["Initial Verified At"] = new Date(loto.verifiedAt).toLocaleString();
        formattedLoto["Verification Type"] = "Initial LOTO Verification";
      } else {
        formattedLoto["Initial Verified By"] = loto.status === "pending_verification_new" ? "Pending initial verification" : "Not verified";
        formattedLoto["Initial Verified At"] = "N/A";
        formattedLoto["Verification Type"] = loto.status === "pending_verification_new" ? "Awaiting Initial Verification" : "No Initial Verification";
      }

      // Add handover information
      if (loto.handoverTo) {
        const handoverUser = users.find((user) => user._id === loto.handoverTo._id);
        formattedLoto["Current Handover To"] = handoverUser 
          ? `${handoverUser.firstName} ${handoverUser.lastName}` 
          : `${loto.handoverTo.firstName} ${loto.handoverTo.lastName}`;
      } else {
        formattedLoto["Current Handover To"] = "N/A";
      }

      // Add handover history if available
      if (loto.handoverHistory && loto.handoverHistory.length > 0) {
        formattedLoto["Total Handovers"] = loto.handoverHistory.length;
        
        // Create handover chain
        const handoverChain = [`${loto.isolator.firstName} ${loto.isolator.lastName}`];
        loto.handoverHistory.forEach(handover => {
          handoverChain.push(`${handover.toUserName}`);
        });
        formattedLoto["Handover Chain"] = handoverChain.join(" → ");
        
        // Create handover history summary with verification details
        const handoverSummary = loto.handoverHistory.map((handover, index) => {
          const status = handover.status || "unknown";
          const fromName = handover.fromUserName || "Unknown";
          const toName = handover.toUserName || "Unknown";
          const date = handover.handoverDate ? new Date(handover.handoverDate).toLocaleString() : "Unknown";
          const handoverType = handover.handoverType || "other";
          const createdBy = handover.createdByName || "Unknown";
          
          let summary = `${index + 1}. ${fromName} → ${toName} | ${date} | Type: ${handoverType.replace('_', ' ').toUpperCase()} | Created by: ${createdBy}`;
          if (handover.handoverNotes) {
            summary += ` | Notes: ${handover.handoverNotes}`;
          }
          
          // Add recipient decision details
          const recipientStatus = handover.recipientStatus || "pending";
          if (recipientStatus === "accepted") {
            summary += `\n  Recipient Decision: ✅ Accepted on ${handover.recipientDecisionDate ? new Date(handover.recipientDecisionDate).toLocaleString() : "Unknown"}`;
            if (handover.recipientDecisionNotes) {
              summary += ` | Decision Notes: ${handover.recipientDecisionNotes}`;
            }
          } else if (recipientStatus === "rejected") {
            summary += `\n  Recipient Decision: ❌ Rejected on ${handover.recipientDecisionDate ? new Date(handover.recipientDecisionDate).toLocaleString() : "Unknown"}`;
            if (handover.recipientDecisionNotes) {
              summary += ` | Rejection Notes: ${handover.recipientDecisionNotes}`;
            }
          } else {
            summary += `\n  Recipient Decision: ⏳ Pending`;
          }
          
          // Add handover verification details (distinct from initial LOTO verification)
          const verificationStatus = handover.verificationStatus || "pending";
          if (verificationStatus === "approved") {
            summary += `\n  Handover Verification: ✅ Approved by ${handover.verifiedByName || "Unknown"} at ${handover.verificationDate ? new Date(handover.verificationDate).toLocaleString() : "Unknown"}`;
            if (handover.verificationNotes) {
              summary += ` | Handover Verification Notes: ${handover.verificationNotes}`;
            }
          } else if (verificationStatus === "rejected") {
            summary += `\n  Handover Verification: ❌ Rejected by ${handover.verifiedByName || "Unknown"} at ${handover.verificationDate ? new Date(handover.verificationDate).toLocaleString() : "Unknown"}`;
            if (handover.rejectionReason) {
              summary += ` | Handover Rejection Reason: ${handover.rejectionReason}`;
            }
            if (handover.verificationNotes) {
              summary += ` | Handover Verification Notes: ${handover.verificationNotes}`;
            }
          } else {
            if (recipientStatus === "accepted") {
              summary += `\n  Handover Verification: ⏳ Pending Handover Verification`;
              if (handover.assignedVerifierName) {
                summary += ` | Assigned Handover Verifier: ${handover.assignedVerifierName}`;
              }
            } else {
              summary += `\n  Handover Verification: ⏸️ Waiting for Recipient Decision`;
            }
          }
          
          return summary;
        }).join("\n");
        
        formattedLoto["Detailed Handover History"] = handoverSummary;
      } else {
        formattedLoto["Total Handovers"] = 0;
        formattedLoto["Handover Chain"] = `${loto.isolator.firstName} ${loto.isolator.lastName}`;
        formattedLoto["Detailed Handover History"] = "No handovers recorded";
      }

      // Add energy types if requested
      if (exportOptions.includeEnergyTypes && loto.energyTypes && loto.energyTypes.length > 0) {
        formattedLoto["Energy Types"] = loto.energyTypes.map(energy => 
          `${energy.type} (${energy.isolationPoint})`
        ).join("; ");
      } else {
        formattedLoto["Energy Types"] = "None specified";
      }

      // Add notes if requested
      if (exportOptions.includeNotes) {
        formattedLoto["Handover Notes"] = loto.handoverNotes || "N/A";
        formattedLoto["Completion Notes"] = loto.completionNotes || "N/A";
      }

      // Add completion information
      if (loto.actualFinishTime) {
        formattedLoto["Actual Finish Time"] = new Date(loto.actualFinishTime).toLocaleTimeString();
        formattedLoto["Actual Finish Date"] = new Date(loto.actualFinishDate).toLocaleDateString();
      } else {
        formattedLoto["Actual Finish Time"] = "N/A";
        formattedLoto["Actual Finish Date"] = "N/A";
      }

      return formattedLoto;
    });
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    // Set column widths - simplified without redundant handover columns
    const columns = [
      { wch: 20 }, // Serial Number
      { wch: 12 }, // Date Created
      { wch: 12 }, // Time Created
      { wch: 8 },  // Shift
      { wch: 12 }, // Status
      { wch: 20 }, // Isolator Name
      { wch: 15 }, // Location
      { wch: 15 }, // Line
      { wch: 15 }, // Machine
      { wch: 20 }, // Isolated Part
      { wch: 20 }, // Reason
      { wch: 15 }, // PTW Number
      { wch: 15 }, // Expected Duration
      { wch: 20 }, // Authorized Supervisor
      { wch: 20 }, // Initial Verified By
      { wch: 20 }, // Initial Verified At
      { wch: 20 }, // Verification Type
      { wch: 20 }, // Current Handover To
      { wch: 8 },  // Total Handovers
      { wch: 50 }, // Handover Chain
      { wch: 80 }, // Detailed Handover History (wider for comprehensive data)
      { wch: 30 }, // Energy Types
      { wch: 20 }, // Handover Notes
      { wch: 20 }, // Completion Notes
      { wch: 15 }, // Actual Finish Time
      { wch: 15 }, // Actual Finish Date
    ];
    
    worksheet["!cols"] = columns;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, "LOTO Data");
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `LOTO_Export_${timestamp}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
  };

  const exportToCSV = (data) => {
    const csvContent = [
      // Headers
      Object.keys(data[0]).join(","),
      // Data rows
      ...data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        ).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `LOTO_Export_${timestamp}.csv`;
      link.setAttribute("download", filename);
      
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToExcelWithMultipleSheets = (lotoData, adminActionsData) => {
    const workbook = XLSX.utils.book_new();
    
    // Create LOTO sheet
    const lotoSheet = XLSX.utils.json_to_sheet(lotoData);
    XLSX.utils.book_append_sheet(workbook, lotoSheet, "LOTO Records");
    
    // Create Admin Actions sheet
    const adminActionsSheet = XLSX.utils.json_to_sheet(adminActionsData);
    XLSX.utils.book_append_sheet(workbook, adminActionsSheet, "Admin Actions");
    
    // Export
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `LOTO_Export_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const exportToCSVWithMultipleSheets = (lotoData, adminActionsData) => {
    // Create combined CSV with headers
    const lotoCSV = convertToCSV(lotoData);
    const adminActionsCSV = convertToCSV(adminActionsData);
    
    const combinedCSV = [
      "=== LOTO RECORDS ===",
      lotoCSV,
      "",
      "=== ADMIN ACTIONS ===",
      adminActionsCSV
    ].join("\n");

    const blob = new Blob([combinedCSV], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `LOTO_Export_${timestamp}.csv`;
      link.setAttribute("download", filename);
      
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatAdminActionsData = (adminActions) => {
    return adminActions.map((action) => ({
      "LOTO Serial Number": action.serialNumber,
      "Isolated Part": action.isolatedPart,
      "Action Type": action.actionType,
      "Action Description": action.actionDescription,
      "Performed By": action.performedBy,
      "Performed At": new Date(action.performedAt).toLocaleString(),
      "Notes": action.notes || "N/A",
      "Additional Data": JSON.stringify(action.additionalData || {}),
      "Isolator": action.lotoDetails.isolator,
      "Supervisor": action.lotoDetails.supervisor,
      "Location": action.lotoDetails.location,
      "Reason": action.lotoDetails.reason,
      "Energy Types": action.lotoDetails.energyTypes,
    }));
  };

  const fetchAdminActions = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let url = "https://loto-backend-643788243736.europe-west1.run.app/api/loto/admin-actions";
      const params = new URLSearchParams();

      // Add date filter if custom date range is selected
      if (exportOptions.dateRange === "custom" && customDateRange.startDate && customDateRange.endDate) {
        params.append("startDate", customDateRange.startDate);
        params.append("endDate", customDateRange.endDate);
      }

      // Add action type filter if specific status is selected
      if (exportOptions.status !== "all") {
        params.append("actionType", exportOptions.status);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await axios.get(url, config);
      return res.data.data || [];
    } catch (err) {
      console.error("Error fetching admin actions:", err);
      return [];
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Fetch data
      const fetchPromises = [
        fetchAllLOTOs(),
        exportOptions.includeUsers ? fetchAllUsers() : Promise.resolve([])
      ];

      // Add admin actions fetch if enabled and user is admin
      if (exportOptions.includeAdminActions && currentUser?.role === "admin") {
        fetchPromises.push(fetchAdminActions());
      } else {
        fetchPromises.push(Promise.resolve([]));
      }

      const [lotos, users, adminActions] = await Promise.all(fetchPromises);

      // Filter data
      const filteredLOTOs = filterLOTOs(lotos);

      if (filteredLOTOs.length === 0) {
        setError("No data found matching the selected criteria.");
        setLoading(false);
        return;
      }

      // Format data
      const formattedData = formatLOTOData(filteredLOTOs, users);
      const formattedAdminActions = exportOptions.includeAdminActions && currentUser?.role === "admin" 
        ? formatAdminActionsData(adminActions) 
        : [];

      // Export based on format
      if (exportOptions.format === "excel") {
        if (formattedAdminActions.length > 0) {
          exportToExcelWithMultipleSheets(formattedData, formattedAdminActions);
        } else {
          exportToExcel(formattedData);
        }
      } else {
        if (formattedAdminActions.length > 0) {
          exportToCSVWithMultipleSheets(formattedData, formattedAdminActions);
        } else {
          exportToCSV(formattedData);
        }
      }

      const adminActionsCount = formattedAdminActions.length;
      const successMessage = adminActionsCount > 0 
        ? `Successfully exported ${filteredLOTOs.length} LOTO records and ${adminActionsCount} admin actions to ${exportOptions.format.toUpperCase()} format.`
        : `Successfully exported ${filteredLOTOs.length} LOTO records to ${exportOptions.format.toUpperCase()} format.`;
      
      setSuccess(successMessage);
    } catch (err) {
      setError(err.message || "Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (key, value) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateChange = (key, value) => {
    setCustomDateRange(prev => ({
      ...prev,
      [key]: value
    }));
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
          <p>You need administrator privileges to access the data export feature.</p>
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
      {/* Modern Header Section */}
      <div className="data-export-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon">
              <svg className="header-svg" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1>Data Export</h1>
              <p>Extract LOTO data to Excel or CSV format</p>
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
            <p>{success}</p>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="export-options-section">
        <div className="section-header">
          <div className="section-icon">
            <svg className="section-svg" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="section-title">
            <h3>Export Options</h3>
            <p>Configure your data export preferences</p>
          </div>
        </div>

        <div className="options-grid">
          {/* Format Selection */}
          <div className="option-group">
            <h4 className="group-title">Export Format</h4>
            <div className="format-options">
              <label className="format-option">
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={exportOptions.format === "excel"}
                  onChange={(e) => handleOptionChange("format", e.target.value)}
                />
                <div className="option-content">
                  <div className="option-icon">
                    <svg className="option-svg" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="option-text">
                    <span className="option-name">Excel (.xlsx)</span>
                    <span className="option-description">Recommended format with formatting</span>
                  </div>
                </div>
              </label>
              <label className="format-option">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={exportOptions.format === "csv"}
                  onChange={(e) => handleOptionChange("format", e.target.value)}
                />
                <div className="option-content">
                  <div className="option-icon">
                    <svg className="option-svg" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="option-text">
                    <span className="option-name">CSV (.csv)</span>
                    <span className="option-description">Universal format for data analysis</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="option-group">
            <h4 className="group-title">Date Range</h4>
            <div className="date-options">
              <label className="date-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="all"
                  checked={exportOptions.dateRange === "all"}
                  onChange={(e) => handleOptionChange("dateRange", e.target.value)}
                />
                <span>All Records</span>
              </label>
              <label className="date-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="last30days"
                  checked={exportOptions.dateRange === "last30days"}
                  onChange={(e) => handleOptionChange("dateRange", e.target.value)}
                />
                <span>Last 30 Days</span>
              </label>
              <label className="date-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="last7days"
                  checked={exportOptions.dateRange === "last7days"}
                  onChange={(e) => handleOptionChange("dateRange", e.target.value)}
                />
                <span>Last 7 Days</span>
              </label>
              <label className="date-option">
                <input
                  type="radio"
                  name="dateRange"
                  value="custom"
                  checked={exportOptions.dateRange === "custom"}
                  onChange={(e) => handleOptionChange("dateRange", e.target.value)}
                />
                <span>Custom Range</span>
              </label>
            </div>
            
            {exportOptions.dateRange === "custom" && (
              <div className="custom-date-range">
                <div className="date-input-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={customDateRange.startDate}
                    onChange={(e) => handleDateChange("startDate", e.target.value)}
                    className="modern-input"
                  />
                </div>
                <div className="date-input-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={customDateRange.endDate}
                    onChange={(e) => handleDateChange("endDate", e.target.value)}
                    className="modern-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="option-group">
            <h4 className="group-title">Status Filter</h4>
            <div className="status-options">
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="all"
                  checked={exportOptions.status === "all"}
                  onChange={(e) => handleOptionChange("status", e.target.value)}
                />
                <span>All Statuses</span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={exportOptions.status === "pending"}
                  onChange={(e) => handleOptionChange("status", e.target.value)}
                />
                <span>Pending</span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={exportOptions.status === "active"}
                  onChange={(e) => handleOptionChange("status", e.target.value)}
                />
                <span>Active</span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={exportOptions.status === "completed"}
                  onChange={(e) => handleOptionChange("status", e.target.value)}
                />
                <span>Completed</span>
              </label>
            </div>
          </div>

          {/* Additional Options */}
          <div className="option-group">
            <h4 className="group-title">Additional Data</h4>
            <div className="checkbox-options">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={exportOptions.includeUsers}
                  onChange={(e) => handleOptionChange("includeUsers", e.target.checked)}
                />
                <span>Include User Details</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={exportOptions.includeEnergyTypes}
                  onChange={(e) => handleOptionChange("includeEnergyTypes", e.target.checked)}
                />
                <span>Include Energy Types</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={exportOptions.includeNotes}
                  onChange={(e) => handleOptionChange("includeNotes", e.target.checked)}
                />
                <span>Include Notes</span>
              </label>
              
              {currentUser?.role === "admin" && (
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeAdminActions}
                    onChange={(e) => handleOptionChange("includeAdminActions", e.target.checked)}
                  />
                  <span>Include Admin Actions</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="export-actions">
          <button
            className="export-btn primary"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-border-sm"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Export Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataExport;
