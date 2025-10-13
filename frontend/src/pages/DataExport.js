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
        // === BASIC INFORMATION ===
        "Serial Number": loto.serialNumber,
        "Date Created": new Date(loto.date).toLocaleDateString(),
        "Time Created": new Date(loto.date).toLocaleTimeString(),
        "Shift": loto.shift,
        "Status": loto.status,
        "Isolator Name": loto.isolatorName,
        
        // === LOCATION DETAILS ===
        "Location": loto.location || "N/A",
        "Line": loto.line || "N/A",
        "Machine": loto.machine || "N/A",
        "Isolated Part": loto.isolatedPart || "N/A",
        
        // === WORK DETAILS ===
        "Reason": loto.reason || "N/A",
        "PTW Number": loto.ptwNumber || "N/A",
        "Expected Duration (hours)": loto.expectedDuration || "N/A",
        "Authorized Supervisor": loto.supervisorName || "None assigned",
      };

      // === INITIAL VERIFICATION (for new LOTO) ===
      if (loto.verifiedBy) {
        const verifier = users.find((user) => user._id === loto.verifiedBy._id);
        formattedLoto["Initial Verified By"] = verifier 
          ? `${verifier.firstName} ${verifier.lastName}` 
          : `${loto.verifiedBy.firstName} ${loto.verifiedBy.lastName}`;
        formattedLoto["Initial Verified At"] = new Date(loto.verifiedAt).toLocaleString();
      } else {
        formattedLoto["Initial Verified By"] = loto.status === "pending_verification_new" ? "Pending verification" : "Not verified";
        formattedLoto["Initial Verified At"] = "N/A";
      }

      // === CURRENT RESPONSIBILITY ===
      formattedLoto["Current Responsible Person"] = loto.currentResponsibleName || loto.isolatorName;

      // === HANDOVER HISTORY ===
      if (loto.handoverHistory && loto.handoverHistory.length > 0) {
        formattedLoto["Total Handovers"] = loto.handoverHistory.length;
        
        // Create handover chain
        const handoverChain = [loto.isolatorName];
        loto.handoverHistory.forEach(handover => {
          handoverChain.push(handover.toUserName);
        });
        formattedLoto["Responsibility Chain"] = handoverChain.join(" → ");
        
        // Create separate columns for each handover (up to 5 handovers)
        const maxHandovers = 5; // Support up to 5 handovers in separate columns
        
        for (let i = 0; i < maxHandovers; i++) {
          const handoverNum = i + 1;
          const handover = loto.handoverHistory[i];
          
          if (handover) {
            // Overall Status Summary (Quick View)
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
            
            formattedLoto[`Handover ${handoverNum} | Status`] = overallStatus;
            
            // Basic Transfer Information
            formattedLoto[`Handover ${handoverNum} | From`] = handover.fromUserName || "Unknown";
            formattedLoto[`Handover ${handoverNum} | To`] = handover.toUserName || "Unknown";
            formattedLoto[`Handover ${handoverNum} | Transfer Date`] = handover.handoverDate 
              ? new Date(handover.handoverDate).toLocaleString() 
              : "Unknown";
            formattedLoto[`Handover ${handoverNum} | Type`] = handover.handoverType 
              ? handover.handoverType.replace('_', ' ').toUpperCase() 
              : "OTHER";
            formattedLoto[`Handover ${handoverNum} | Initiated By`] = handover.createdByName || "Unknown";
            formattedLoto[`Handover ${handoverNum} | Transfer Notes`] = handover.handoverNotes || "—";
            
            // Recipient Decision Details
            formattedLoto[`Handover ${handoverNum} | Recipient Decision`] = 
              recipientStatus === "accepted" ? "✅ ACCEPTED" :
              recipientStatus === "rejected" ? "❌ REJECTED" :
              "⏳ PENDING";
            
            formattedLoto[`Handover ${handoverNum} | Recipient Decision Date`] = 
              handover.recipientDecisionDate 
                ? new Date(handover.recipientDecisionDate).toLocaleString()
                : "—";
            
            formattedLoto[`Handover ${handoverNum} | Recipient Notes`] = 
              handover.recipientDecisionNotes || "—";
            
            // Supervisor Verification Details
            formattedLoto[`Handover ${handoverNum} | Supervisor Verification`] = 
              verificationStatus === "approved" ? "✅ APPROVED" :
              verificationStatus === "rejected" ? "❌ REJECTED" :
              recipientStatus === "accepted" ? "⏳ PENDING" :
              "⏸️ ON HOLD";
            
            formattedLoto[`Handover ${handoverNum} | Verified By`] = handover.verifiedByName || "—";
            formattedLoto[`Handover ${handoverNum} | Verification Date`] = 
              handover.verificationDate 
                ? new Date(handover.verificationDate).toLocaleString()
                : "—";
            
            formattedLoto[`Handover ${handoverNum} | Supervisor Notes`] = handover.verificationNotes || "—";
            formattedLoto[`Handover ${handoverNum} | Rejection Reason`] = handover.rejectionReason || "—";
            formattedLoto[`Handover ${handoverNum} | Assigned Verifier`] = handover.assignedVerifierName || "—";
          } else {
            // Empty columns for handovers that don't exist
            formattedLoto[`Handover ${handoverNum} | Status`] = "—";
            formattedLoto[`Handover ${handoverNum} | From`] = "—";
            formattedLoto[`Handover ${handoverNum} | To`] = "—";
            formattedLoto[`Handover ${handoverNum} | Transfer Date`] = "—";
            formattedLoto[`Handover ${handoverNum} | Type`] = "—";
            formattedLoto[`Handover ${handoverNum} | Initiated By`] = "—";
            formattedLoto[`Handover ${handoverNum} | Transfer Notes`] = "—";
            formattedLoto[`Handover ${handoverNum} | Recipient Decision`] = "—";
            formattedLoto[`Handover ${handoverNum} | Recipient Decision Date`] = "—";
            formattedLoto[`Handover ${handoverNum} | Recipient Notes`] = "—";
            formattedLoto[`Handover ${handoverNum} | Supervisor Verification`] = "—";
            formattedLoto[`Handover ${handoverNum} | Verified By`] = "—";
            formattedLoto[`Handover ${handoverNum} | Verification Date`] = "—";
            formattedLoto[`Handover ${handoverNum} | Supervisor Notes`] = "—";
            formattedLoto[`Handover ${handoverNum} | Rejection Reason`] = "—";
            formattedLoto[`Handover ${handoverNum} | Assigned Verifier`] = "—";
          }
        }
        
        // If more than 5 handovers, add a note
        if (loto.handoverHistory.length > maxHandovers) {
          formattedLoto["Additional Handovers Note"] = 
            `⚠️ This LOTO has ${loto.handoverHistory.length} handovers. Only the first ${maxHandovers} are shown in separate columns. See full chain in "Responsibility Chain" column.`;
        } else {
          formattedLoto["Additional Handovers Note"] = "—";
        }
      } else {
        formattedLoto["Total Handovers"] = 0;
        formattedLoto["Responsibility Chain"] = loto.isolatorName;
        
        // Empty handover columns
        for (let i = 1; i <= 5; i++) {
          formattedLoto[`Handover ${i} | Status`] = "—";
          formattedLoto[`Handover ${i} | From`] = "—";
          formattedLoto[`Handover ${i} | To`] = "—";
          formattedLoto[`Handover ${i} | Transfer Date`] = "—";
          formattedLoto[`Handover ${i} | Type`] = "—";
          formattedLoto[`Handover ${i} | Initiated By`] = "—";
          formattedLoto[`Handover ${i} | Transfer Notes`] = "—";
          formattedLoto[`Handover ${i} | Recipient Decision`] = "—";
          formattedLoto[`Handover ${i} | Recipient Decision Date`] = "—";
          formattedLoto[`Handover ${i} | Recipient Notes`] = "—";
          formattedLoto[`Handover ${i} | Supervisor Verification`] = "—";
          formattedLoto[`Handover ${i} | Verified By`] = "—";
          formattedLoto[`Handover ${i} | Verification Date`] = "—";
          formattedLoto[`Handover ${i} | Supervisor Notes`] = "—";
          formattedLoto[`Handover ${i} | Rejection Reason`] = "—";
          formattedLoto[`Handover ${i} | Assigned Verifier`] = "—";
        }
        formattedLoto["Additional Handovers Note"] = "No handovers - Original isolator still responsible";
      }

      // === ENERGY TYPES ===
      if (exportOptions.includeEnergyTypes && loto.energyTypes && loto.energyTypes.length > 0) {
        formattedLoto["Energy Types Count"] = loto.energyTypes.length;
        formattedLoto["Energy Types Detail"] = loto.energyTypes.map((energy, idx) => 
          `${idx + 1}. ${energy.type} - Isolation Point: ${energy.isolationPoint}`
        ).join("\n");
      } else {
        formattedLoto["Energy Types Count"] = 0;
        formattedLoto["Energy Types Detail"] = "None specified";
      }

      // === NOTES ===
      if (exportOptions.includeNotes) {
        formattedLoto["Handover Notes"] = loto.handoverNotes || "N/A";
        formattedLoto["Completion Notes"] = loto.completionNotes || "N/A";
      }

      // === COMPLETION INFORMATION ===
      if (loto.status === "completed") {
        formattedLoto["Completed By"] = loto.completedByName || "Unknown";
        formattedLoto["Completed At"] = loto.completedAt ? new Date(loto.completedAt).toLocaleString() : "N/A";
        formattedLoto["Actual Finish Date"] = loto.actualFinishDate ? new Date(loto.actualFinishDate).toLocaleDateString() : "N/A";
        formattedLoto["Actual Finish Time"] = loto.actualFinishTime ? new Date(loto.actualFinishTime).toLocaleTimeString() : "N/A";
      } else {
        formattedLoto["Completed By"] = "Not completed";
        formattedLoto["Completed At"] = "N/A";
        formattedLoto["Actual Finish Date"] = "N/A";
        formattedLoto["Actual Finish Time"] = "N/A";
      }

      // === REJECTION INFORMATION ===
      if (loto.status === "rejected") {
        formattedLoto["Rejected By"] = loto.rejectedBy ? `${loto.rejectedBy.firstName} ${loto.rejectedBy.lastName}` : "Unknown";
        formattedLoto["Rejected At"] = loto.rejectedAt ? new Date(loto.rejectedAt).toLocaleString() : "N/A";
        formattedLoto["Rejection Notes"] = loto.rejectionNotes || "N/A";
        formattedLoto["Rejected Fields"] = loto.rejectedFields && loto.rejectedFields.length > 0 
          ? loto.rejectedFields.join(", ") 
          : "N/A";
      }

      return formattedLoto;
    });
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    // Set column widths to match new multi-column structure
    const columns = [
      // Basic Information
      { wch: 20 }, // Serial Number
      { wch: 12 }, // Date Created
      { wch: 12 }, // Time Created
      { wch: 8 },  // Shift
      { wch: 15 }, // Status
      { wch: 20 }, // Isolator Name
      
      // Location Details
      { wch: 20 }, // Location
      { wch: 15 }, // Line
      { wch: 20 }, // Machine
      { wch: 25 }, // Isolated Part
      
      // Work Details
      { wch: 25 }, // Reason
      { wch: 15 }, // PTW Number
      { wch: 12 }, // Expected Duration
      { wch: 20 }, // Authorized Supervisor
      
      // Verification
      { wch: 20 }, // Initial Verified By
      { wch: 20 }, // Initial Verified At
      
      // Current Responsibility
      { wch: 25 }, // Current Responsible Person
      
      // Handover Summary
      { wch: 10 }, // Total Handovers
      { wch: 60 }, // Responsibility Chain
      
      // Handover 1 (16 columns per handover - now includes Status as first column)
      { wch: 25 }, // Status (Overall)
      { wch: 20 }, // From
      { wch: 20 }, // To
      { wch: 22 }, // Transfer Date
      { wch: 20 }, // Type
      { wch: 20 }, // Initiated By
      { wch: 35 }, // Transfer Notes
      { wch: 18 }, // Recipient Decision
      { wch: 22 }, // Recipient Decision Date
      { wch: 35 }, // Recipient Notes
      { wch: 25 }, // Supervisor Verification
      { wch: 20 }, // Verified By
      { wch: 22 }, // Verification Date
      { wch: 35 }, // Supervisor Notes
      { wch: 35 }, // Rejection Reason
      { wch: 20 }, // Assigned Verifier
      
      // Handover 2 (16 columns)
      { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, 
      { wch: 20 }, { wch: 35 }, { wch: 18 }, { wch: 22 }, { wch: 35 }, 
      { wch: 25 }, { wch: 20 }, { wch: 22 }, { wch: 35 }, { wch: 35 }, { wch: 20 },
      
      // Handover 3 (16 columns)
      { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, 
      { wch: 20 }, { wch: 35 }, { wch: 18 }, { wch: 22 }, { wch: 35 }, 
      { wch: 25 }, { wch: 20 }, { wch: 22 }, { wch: 35 }, { wch: 35 }, { wch: 20 },
      
      // Handover 4 (16 columns)
      { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, 
      { wch: 20 }, { wch: 35 }, { wch: 18 }, { wch: 22 }, { wch: 35 }, 
      { wch: 25 }, { wch: 20 }, { wch: 22 }, { wch: 35 }, { wch: 35 }, { wch: 20 },
      
      // Handover 5 (16 columns)
      { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, 
      { wch: 20 }, { wch: 35 }, { wch: 18 }, { wch: 22 }, { wch: 35 }, 
      { wch: 25 }, { wch: 20 }, { wch: 22 }, { wch: 35 }, { wch: 35 }, { wch: 20 },
      
      // Additional Handovers Note
      { wch: 50 }, // Additional Handovers Note
      
      // Energy Types
      { wch: 10 }, // Energy Types Count
      { wch: 50 }, // Energy Types Detail
      
      // Notes
      { wch: 30 }, // Handover Notes
      { wch: 30 }, // Completion Notes
      
      // Completion Information
      { wch: 25 }, // Completed By
      { wch: 20 }, // Completed At
      { wch: 15 }, // Actual Finish Date
      { wch: 15 }, // Actual Finish Time
      
      // Rejection Information (if applicable)
      { wch: 20 }, // Rejected By
      { wch: 20 }, // Rejected At
      { wch: 30 }, // Rejection Notes
      { wch: 25 }, // Rejected Fields
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

  const formatHandoverDetailsTable = (lotos) => {
    // Create a flat table of all handovers across all LOTOs
    const handoverDetails = [];
    
    lotos.forEach(loto => {
      if (loto.handoverHistory && loto.handoverHistory.length > 0) {
        loto.handoverHistory.forEach((handover, index) => {
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
          
          handoverDetails.push({
            // Link to main LOTO
            "LOTO Serial Number": loto.serialNumber,
            "LOTO Status": loto.status,
            "LOTO Location": loto.location || "N/A",
            
            // Handover Sequence
            "Handover Number": index + 1,
            "Overall Status": overallStatus,
            
            // Transfer Information
            "From (Name)": handover.fromUserName || "Unknown",
            "To (Name)": handover.toUserName || "Unknown",
            "Transfer Date": handover.handoverDate 
              ? new Date(handover.handoverDate).toLocaleString() 
              : "Unknown",
            "Handover Type": handover.handoverType 
              ? handover.handoverType.replace('_', ' ').toUpperCase() 
              : "OTHER",
            "Initiated By": handover.createdByName || "Unknown",
            "Transfer Notes": handover.handoverNotes || "—",
            
            // Recipient Decision
            "Recipient Decision": recipientStatus === "accepted" ? "✅ ACCEPTED" :
                                recipientStatus === "rejected" ? "❌ REJECTED" :
                                "⏳ PENDING",
            "Recipient Decision Date": handover.recipientDecisionDate 
              ? new Date(handover.recipientDecisionDate).toLocaleString()
              : "—",
            "Recipient Notes": handover.recipientDecisionNotes || "—",
            
            // Supervisor Verification
            "Supervisor Verification": verificationStatus === "approved" ? "✅ APPROVED" :
                                      verificationStatus === "rejected" ? "❌ REJECTED" :
                                      recipientStatus === "accepted" ? "⏳ PENDING" :
                                      "⏸️ ON HOLD",
            "Verified By": handover.verifiedByName || "—",
            "Verification Date": handover.verificationDate 
              ? new Date(handover.verificationDate).toLocaleString()
              : "—",
            "Supervisor Notes": handover.verificationNotes || "—",
            "Rejection Reason": handover.rejectionReason || "—",
            "Assigned Verifier": handover.assignedVerifierName || "—",
          });
        });
      }
    });
    
    return handoverDetails;
  };

  const exportToExcelWithMultipleSheets = (lotoData, adminActionsData, rawLotos) => {
    const workbook = XLSX.utils.book_new();
    
    // Create LOTO Summary sheet (without individual handover columns)
    const lotoSheet = XLSX.utils.json_to_sheet(lotoData);
    XLSX.utils.book_append_sheet(workbook, lotoSheet, "LOTO Summary");
    
    // Create Handover Details sheet (nested table)
    const handoverDetails = formatHandoverDetailsTable(rawLotos);
    if (handoverDetails.length > 0) {
      const handoverSheet = XLSX.utils.json_to_sheet(handoverDetails);
      
      // Set column widths for handover details
      const handoverColumns = [
        { wch: 20 }, // LOTO Serial Number
        { wch: 15 }, // LOTO Status
        { wch: 20 }, // LOTO Location
        { wch: 10 }, // Handover Number
        { wch: 25 }, // Overall Status
        { wch: 25 }, // From
        { wch: 25 }, // To
        { wch: 22 }, // Transfer Date
        { wch: 25 }, // Type
        { wch: 25 }, // Initiated By
        { wch: 40 }, // Transfer Notes
        { wch: 18 }, // Recipient Decision
        { wch: 22 }, // Recipient Decision Date
        { wch: 40 }, // Recipient Notes
        { wch: 25 }, // Supervisor Verification
        { wch: 25 }, // Verified By
        { wch: 22 }, // Verification Date
        { wch: 40 }, // Supervisor Notes
        { wch: 40 }, // Rejection Reason
        { wch: 25 }, // Assigned Verifier
      ];
      handoverSheet["!cols"] = handoverColumns;
      
      XLSX.utils.book_append_sheet(workbook, handoverSheet, "Handover Details");
    }
    
    // Create Admin Actions sheet if provided
    if (adminActionsData && adminActionsData.length > 0) {
      const adminActionsSheet = XLSX.utils.json_to_sheet(adminActionsData);
      XLSX.utils.book_append_sheet(workbook, adminActionsSheet, "Admin Actions");
    }
    
    // Export
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `LOTO_Export_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))
          ? `"${value.replace(/"/g, '""')}"` 
          : value
      ).join(",")
    );
    
    return [headers, ...rows].join("\n");
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
          exportToExcelWithMultipleSheets(formattedData, formattedAdminActions, filteredLOTOs);
        } else {
          // Always use multi-sheet export for Excel to include Handover Details
          exportToExcelWithMultipleSheets(formattedData, [], filteredLOTOs);
        }
      } else {
        if (formattedAdminActions.length > 0) {
          exportToCSVWithMultipleSheets(formattedData, formattedAdminActions);
        } else {
          exportToCSV(formattedData);
        }
      }

      // Count total handovers for success message
      const totalHandovers = filteredLOTOs.reduce((sum, loto) => 
        sum + (loto.handoverHistory?.length || 0), 0
      );
      
      const adminActionsCount = formattedAdminActions.length;
      
      let successMessage = "";
      if (exportOptions.format === "excel") {
        successMessage = `✅ Successfully exported to Excel with multiple sheets:\n`;
        successMessage += `  📄 LOTO Summary: ${filteredLOTOs.length} records\n`;
        successMessage += `  📄 Handover Details: ${totalHandovers} handover records\n`;
        if (adminActionsCount > 0) {
          successMessage += `  📄 Admin Actions: ${adminActionsCount} actions`;
        }
      } else {
        successMessage = adminActionsCount > 0 
          ? `Successfully exported ${filteredLOTOs.length} LOTO records and ${adminActionsCount} admin actions to CSV format.`
          : `Successfully exported ${filteredLOTOs.length} LOTO records to CSV format.`;
      }
      
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
