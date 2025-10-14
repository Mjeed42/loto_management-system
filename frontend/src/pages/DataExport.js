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
    // First, find the maximum number of handovers across all LOTOs (DYNAMIC)
    const maxHandoversInData = lotos.reduce((max, loto) => {
      const handoverCount = loto.handoverHistory?.length || 0;
      return Math.max(max, handoverCount);
    }, 0);
    
    // Use the actual maximum, with a reasonable minimum of 3 for consistency
    // This makes the export DYNAMIC - it automatically adjusts to your data!
    const dynamicMaxHandovers = Math.max(maxHandoversInData, 3);
    
    console.log(`📊 Export Info: Found maximum of ${maxHandoversInData} handovers in dataset. Creating ${dynamicMaxHandovers} handover history column sets.`);
    
    return lotos.map((loto) => {
      const formattedLoto = {
        // === BASIC INFORMATION ===
        "Serial Number": loto.serialNumber,
        "Date Created": new Date(loto.date).toLocaleDateString(),
        "Time Created": new Date(loto.date).toLocaleTimeString(),
        "Full DateTime Created": new Date(loto.date).toLocaleString(),
        "Shift": loto.shift,
        "Status": loto.status,
        "Isolator Name": loto.isolatorName,
        "Isolator ID": loto.isolator?._id || loto.isolator || "N/A",
        
        // === TIMESTAMPS (System Fields) ===
        "Record Created At": loto.createdAt ? new Date(loto.createdAt).toLocaleString() : "N/A",
        "Last Updated At": loto.updatedAt ? new Date(loto.updatedAt).toLocaleString() : "N/A",
        
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
        "Supervisor ID": loto.supervisor?._id || loto.supervisor || "N/A",
        
        // === WORK TRACKING ===
        "Assigned Technician": loto.assignedTechnician || "N/A",
        "Work Start Time": loto.workStartTime ? new Date(loto.workStartTime).toLocaleString() : "N/A",
        "Estimated Completion": loto.estimatedCompletion ? new Date(loto.estimatedCompletion).toLocaleString() : "N/A",
        "Work Summary": loto.workSummary || "N/A",
        
        // === SNAPSHOT INFORMATION ===
        "Is Snapshot": loto.isSnapshot ? "Yes" : "No",
        "Snapshot Reason": loto.snapshotReason || "N/A",
        "Snapshot Created At": loto.snapshotCreatedAt ? new Date(loto.snapshotCreatedAt).toLocaleString() : "N/A",
        "Snapshot Created For": loto.snapshotCreatedForName || "N/A",
        "Original LOTO ID": loto.originalLotoId || "N/A",
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
      
      // === HANDOVER SUMMARY (Basic Info Only - Details at End) ===
      if (loto.handoverHistory && loto.handoverHistory.length > 0) {
        formattedLoto["Total Handovers"] = loto.handoverHistory.length;
        
        // Create handover chain
        const handoverChain = [loto.isolatorName];
        loto.handoverHistory.forEach(handover => {
          handoverChain.push(handover.toUserName);
        });
        formattedLoto["Responsibility Chain"] = handoverChain.join(" → ");
      } else {
        formattedLoto["Total Handovers"] = 0;
        formattedLoto["Responsibility Chain"] = loto.isolatorName;
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
        formattedLoto["Completed By"] = loto.completedByName || loto.completedBy || "Unknown";
        formattedLoto["Completed At"] = loto.completedAt ? new Date(loto.completedAt).toLocaleString() : "N/A";
        formattedLoto["Completion Time"] = loto.completionTime ? new Date(loto.completionTime).toLocaleString() : "N/A";
        formattedLoto["Actual Finish Date"] = loto.actualFinishDate ? new Date(loto.actualFinishDate).toLocaleDateString() : "N/A";
        formattedLoto["Actual Finish Time"] = loto.actualFinishTime ? new Date(loto.actualFinishTime).toLocaleTimeString() : "N/A";
      } else {
        formattedLoto["Completed By"] = "Not completed";
        formattedLoto["Completed At"] = "N/A";
        formattedLoto["Completion Time"] = "N/A";
        formattedLoto["Actual Finish Date"] = "N/A";
        formattedLoto["Actual Finish Time"] = "N/A";
      }

      // === CURRENT REJECTION INFORMATION ===
      if (loto.status === "rejected") {
        formattedLoto["Current Rejected By"] = loto.rejectedBy ? `${loto.rejectedBy.firstName} ${loto.rejectedBy.lastName}` : "Unknown";
        formattedLoto["Current Rejected At"] = loto.rejectedAt ? new Date(loto.rejectedAt).toLocaleString() : "N/A";
        formattedLoto["Current Rejection Notes"] = loto.rejectionNotes || "N/A";
        formattedLoto["Current Rejected Fields"] = loto.rejectedFields && loto.rejectedFields.length > 0 
          ? loto.rejectedFields.join(", ") 
          : "N/A";
      } else {
        formattedLoto["Current Rejected By"] = "N/A";
        formattedLoto["Current Rejected At"] = "N/A";
        formattedLoto["Current Rejection Notes"] = "N/A";
        formattedLoto["Current Rejected Fields"] = "N/A";
      }
      
      // === REJECTION HISTORY (Complete History) ===
      if (loto.rejectionHistory && loto.rejectionHistory.length > 0) {
        formattedLoto["Total Rejections in History"] = loto.rejectionHistory.length;
        
        // Format full rejection history
        const rejectionHistoryDetails = loto.rejectionHistory.map((rejection, idx) => {
          return `[${idx + 1}] Rejected by: ${rejection.rejectedByName || "Unknown"} | ` +
                 `Date: ${rejection.rejectedAt ? new Date(rejection.rejectedAt).toLocaleString() : "Unknown"} | ` +
                 `Notes: ${rejection.rejectionNotes || "None"} | ` +
                 `Fields: ${rejection.rejectedFields && rejection.rejectedFields.length > 0 ? rejection.rejectedFields.join(", ") : "N/A"} | ` +
                 `Resolved: ${rejection.resolvedAt ? new Date(rejection.resolvedAt).toLocaleString() : "Not yet"}`;
        }).join("\n");
        
        formattedLoto["Rejection History Details"] = rejectionHistoryDetails;
      } else {
        formattedLoto["Total Rejections in History"] = 0;
        formattedLoto["Rejection History Details"] = "No rejection history";
      }
      
      // === HANDOVER-TO INFORMATION ===
      formattedLoto["Handover To User"] = loto.handoverTo || "N/A";
      formattedLoto["Handover Reason"] = loto.handoverReason || "N/A";
      
      // === STATUS HISTORY (Complete History) ===
      if (loto.statusHistory && loto.statusHistory.length > 0) {
        formattedLoto["Total Status Changes"] = loto.statusHistory.length;
        
        // Format full status history
        const statusHistoryDetails = loto.statusHistory.map((statusChange, idx) => {
          return `[${idx + 1}] Changed by: ${statusChange.changedByName || "Unknown"} | ` +
                 `Date: ${statusChange.changedAt ? new Date(statusChange.changedAt).toLocaleString() : "Unknown"} | ` +
                 `From: ${statusChange.oldStatus} → To: ${statusChange.newStatus} | ` +
                 `Notes: ${statusChange.notes || "None"}` +
                 (statusChange.additionalData ? ` | Additional Data: ${JSON.stringify(statusChange.additionalData)}` : "");
        }).join("\n");
        
        formattedLoto["Status History Details"] = statusHistoryDetails;
      } else {
        formattedLoto["Total Status Changes"] = 0;
        formattedLoto["Status History Details"] = "No status change history";
      }

      // ==========================================
      // === HANDOVER HISTORY (DETAILED - AT END) ===
      // ==========================================
      if (loto.handoverHistory && loto.handoverHistory.length > 0) {
        // Create columns for all handovers up to the dynamic maximum
        for (let i = 0; i < dynamicMaxHandovers; i++) {
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
            
            formattedLoto[`History ${handoverNum} - Overall Status`] = overallStatus;
            formattedLoto[`History ${handoverNum} - From`] = handover.fromUserName || "Unknown";
            formattedLoto[`History ${handoverNum} - To`] = handover.toUserName || "Unknown";
            formattedLoto[`History ${handoverNum} - Transfer Date`] = handover.handoverDate 
              ? new Date(handover.handoverDate).toLocaleString() 
              : "Unknown";
            formattedLoto[`History ${handoverNum} - Type`] = handover.handoverType 
              ? handover.handoverType.replace('_', ' ').toUpperCase() 
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
            // Empty columns for handovers that don't exist
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
        
        // Add info note
        formattedLoto["Handover History Note"] = loto.handoverHistory.length > 0 
          ? `All ${loto.handoverHistory.length} handover(s) shown in History columns. Max in dataset: ${dynamicMaxHandovers}` 
          : "—";
      } else {
        // No handovers - add empty columns for consistency
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
        formattedLoto["Handover History Note"] = "No handovers - Original isolator still responsible";
      }

      return formattedLoto;
    });
  };

  const exportToExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    
    // Auto-size columns - Excel will determine optimal widths
    // Note: Column widths are set to auto to accommodate the reorganized structure
    const maxColWidth = 100;
    const minColWidth = 10;
    
    // Calculate column widths based on content
    const colWidths = [];
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]);
      headers.forEach((header, colIndex) => {
        let maxWidth = header.length;
        data.forEach(row => {
          const cellValue = String(row[header] || '');
          maxWidth = Math.max(maxWidth, cellValue.length);
        });
        colWidths.push({ wch: Math.min(Math.max(maxWidth, minColWidth), maxColWidth) });
      });
    }
    
    worksheet["!cols"] = colWidths;
    
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
      
      // Calculate dynamic handover columns
      const maxHandoversInExport = filteredLOTOs.reduce((max, loto) => 
        Math.max(max, loto.handoverHistory?.length || 0), 0
      );
      const dynamicHandoverSets = Math.max(maxHandoversInExport, 3);
      
      const adminActionsCount = formattedAdminActions.length;
      
      let successMessage = "";
      if (exportOptions.format === "excel") {
        successMessage = `✅ Successfully exported to Excel with multiple sheets:\n`;
        successMessage += `  📄 LOTO Summary: ${filteredLOTOs.length} records\n`;
        successMessage += `  📄 Handover Details: ${totalHandovers} handover records\n`;
        successMessage += `  📊 Dynamic Columns: ${dynamicHandoverSets} handover history sets (16 fields each)\n`;
        if (adminActionsCount > 0) {
          successMessage += `  📄 Admin Actions: ${adminActionsCount} actions`;
        }
      } else {
        successMessage = `✅ Successfully exported ${filteredLOTOs.length} LOTO records to CSV format.\n`;
        successMessage += `📊 Created ${dynamicHandoverSets} dynamic handover history column sets based on your data.`;
        if (adminActionsCount > 0) {
          successMessage += `\n📄 Includes ${adminActionsCount} admin actions.`;
        }
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
                  value="pending_verification_new"
                  checked={exportOptions.status === "pending_verification_new"}
                  onChange={(e) => handleOptionChange("status", e.target.value)}
                />
                <span>Pending Verification</span>
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
                  value="pending_handover_verification"
                  checked={exportOptions.status === "pending_handover_verification"}
                  onChange={(e) => handleOptionChange("status", e.target.value)}
                />
                <span>Pending Handover</span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="handed_over"
                  checked={exportOptions.status === "handed_over"}
                  onChange={(e) => handleOptionChange("status", e.target.value)}
                />
                <span>Handed Over</span>
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
              <label className="status-option">
                <input
                  type="radio"
                  name="status"
                  value="rejected"
                  checked={exportOptions.status === "rejected"}
                  onChange={(e) => handleOptionChange("status", e.target.value)}
                />
                <span>Rejected</span>
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
