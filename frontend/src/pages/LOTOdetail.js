import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Icon from "../components/Icon";
import BackButton from "../components/BackButton";
import RejectLOTOModal from "../components/RejectLOTOModal";
import StatusChangeModal from "../components/StatusChangeModal";
import HandoverModal from "../components/HandoverModal";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import { API_ENDPOINTS } from "../config/api";

const LOTOdetail = () => {
  const { t } = useTranslation();
  const [loto, setLoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLotoForRejection, setSelectedLotoForRejection] =
    useState(null);
  const [statusChangeModalOpen, setStatusChangeModalOpen] = useState(false);
  const [selectedLotoForStatusChange, setSelectedLotoForStatusChange] =
    useState(null);
  const [handoverModalOpen, setHandoverModalOpen] = useState(false);
  const [selectedLotoForHandover, setSelectedLotoForHandover] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [handoverHistory, setHandoverHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);
  const allScannedAlertShown = useRef(false); // Track if success alert was already shown
  const scanProcessing = useRef(false); // Prevent concurrent scan processing
  const lastScanTime = useRef(0); // Track last scan timestamp for aggressive debouncing on iPhone
  const alertTimeoutRef = useRef(null); // Track alert timeout to prevent duplicates
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLOTO();
    fetchCurrentUser();
    fetchHandoverHistory();
    
    // Cleanup: Clear any pending alert timeouts on unmount
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "/api/auth/me",
        config
      );
      setCurrentUser(res.data.user);
    } catch (err) {
      console.log("Error fetching current user:", err);
    }
  };

  const fetchLOTO = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `/api/loto/${id}`,
        config
      );

      setLoto(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || t("lotoDetails.errorFetchingLoto")
      );
      setLoading(false);
    }
  };

  const fetchHandoverHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `/api/loto/${id}/handover-history`,
        config
      );

      setHandoverHistory(res.data.data.handoverHistory || []);
    } catch (err) {
      console.error("Error fetching handover history:", err);
      setHandoverHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchScanStatus = async () => {
    try {
      setScanLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        API_ENDPOINTS.LOTO_SCAN_STATUS(id),
        config
      );

      setScanStatus(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching scan status:", err);
      return null;
    } finally {
      setScanLoading(false);
    }
  };

  const handleScan = async (serialNumber) => {
    const now = Date.now();
    
    // AGGRESSIVE DEBOUNCE: Reject scans within 600ms (iPhone protection)
    if (now - lastScanTime.current < 600) {
      console.log("Scan too fast (parent), ignoring duplicate");
      return { allScanned: false }; // Return safe default
    }
    
    // Prevent concurrent processing - critical to avoid duplicate API calls and alerts
    if (scanProcessing.current) {
      console.log("Scan already in progress, ignoring duplicate");
      return { allScanned: false }; // Return safe default
    }

    // IMMEDIATELY set timestamp and lock (SYNCHRONOUS)
    lastScanTime.current = now;
    scanProcessing.current = true;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        API_ENDPOINTS.LOTO_SCAN_MACHINE(id),
        { serialNumber },
        config
      );

      // Refresh scan status
      await fetchScanStatus();

      // Return the scan result so modal knows if all machines are scanned
      const allScanned = res.data.data.allScanned;
      
      // If all machines are scanned, close the modal and show success message (only once)
      if (allScanned && !allScannedAlertShown.current) {
        // IMMEDIATELY set flag to prevent race conditions (CRITICAL!)
        allScannedAlertShown.current = true;
        
        // Clear any existing alert timeout
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
          alertTimeoutRef.current = null;
        }
        
        // Schedule alert and modal close (only one will execute)
        alertTimeoutRef.current = setTimeout(() => {
          setScannerModalOpen(false);
          alert("✅ All machines scanned successfully! You can now verify the LOTO.");
          alertTimeoutRef.current = null;
        }, 500);
      }
      
      return { allScanned }; // Return result to modal
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to scan machine";
      // Don't show alert here - let the modal display the error
      throw new Error(errorMsg);
    } finally {
      // Unlock processing after a small delay to prevent rapid re-scanning
      setTimeout(() => {
        scanProcessing.current = false;
      }, 600);
    }
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };

    // Get status display name
    const getStatusDisplay = (status) => {
      const statusMap = {
        pending_verification_new: "Pending Verification (New)",
        active: "Active",
        pending_handover_verification: "Pending Handover Verification",
        handed_over: "Handed Over",
        completed: "Completed",
        rejected: "Rejected",
        rejected_handover_snapshot: "Rejected Handover Snapshot",
        handed_over_snapshot: "Handed Over Snapshot",
      };
      return statusMap[status] || status;
    };

    // Create clean A4 print document with ONLY LOTO data
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>LOTO Details - ${loto?.serialNumber || "N/A"}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            @media print {
              @page {
                margin: 0;
              }
              body {
                margin: 0;
                -webkit-print-color-adjust: exact;
              }
              .document {
                margin: 0;
                padding: 15mm;
              }
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Arial', sans-serif;
              font-size: 10px;
              line-height: 1.2;
              color: #000;
              background: white;
            }
            .document {
              max-width: 100%;
              margin: 0 auto;
            }
            .header {
              margin-bottom: 15px;
              padding: 10px;
              border: 2px solid #000;
              background: #f9f9f9;
            }
            .header h1 {
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 8px;
              text-align: center;
            }
            .header-info {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 8px;
              font-size: 9px;
            }
            .header-item {
              text-align: center;
            }
            .header-label {
              font-weight: bold;
              display: block;
              margin-bottom: 2px;
            }
            .header-value {
              font-size: 10px;
              font-weight: bold;
            }
            .header-status {
              font-size: 8px;
              padding: 2px 4px;
              border-radius: 2px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .content-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-bottom: 5px;
            }
            .section {
              margin-bottom: 6px;
            }
            .section-title {
              font-size: 11px;
              font-weight: bold;
              background: #f0f0f0;
              padding: 4px 6px;
              border: 1px solid #000;
              margin-bottom: 1.5px;
              text-transform: uppercase;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1.5px;
            }
            .info-table td {
              padding: 3px 4px;
              border: 1px solid #ccc;
              vertical-align: top;
              font-size: 9px;
            }
            .info-table .label {
              font-weight: bold;
              width: 40%;
              background: #f9f9f9;
            }
            .info-table .value {
              width: 60%;
            }
            .status-badge {
              display: inline-block;
              padding: 1px 3px;
              border-radius: 2px;
              font-size: 8px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending_verification_new { background: #fff3cd; color: #856404; }
            .status-active { background: #d4edda; color: #155724; }
            .status-pending_handover_verification { background: #cce5ff; color: #004085; }
            .status-handed_over { background: #e2e3f0; color: #383d41; }
            .status-completed { background: #d4edda; color: #155724; }
            .status-rejected { background: #f8d7da; color: #721c24; }
            .status-rejected_handover_snapshot { background: #f5c6cb; color: #721c24; }
            .status-handed_over_snapshot { background: #e2e3f0; color: #383d41; }
            .time-badge {
              display: inline-block;
              padding: 1px 2px;
              border-radius: 1px;
              font-size: 7px;
              font-weight: bold;
              margin-left: 3px;
            }
            .backdated-badge { background: #ffc107; color: #000; }
            .actual-badge { background: #28a745; color: #fff; }
            .footer {
              margin-top: 15px;
              padding-top: 8px;
              border-top: 1px solid #000;
              text-align: center;
              font-size: 8px;
              color: #666;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="document">
            <!-- Header -->
            <div class="header">
              <h1>LOTO DETAILS</h1>
              <div class="header-info">
                <div class="header-item">
                  <span class="header-label">Serial Number</span>
                  <span class="header-value">${
                    loto?.serialNumber || "N/A"
                  }</span>
                </div>
                <div class="header-item">
                  <span class="header-label">Status</span>
                  <span class="header-value">
                    <span class="header-status status-${
                      loto?.status || ""
                    }">${getStatusDisplay(loto?.status)}</span>
                  </span>
                </div>
                <div class="header-item">
                  <span class="header-label">Shift</span>
                  <span class="header-value">${loto?.shift || "N/A"}</span>
                </div>
              </div>
              <div class="header-info" style="margin-top: 8px;">
                <div class="header-item">
                  <span class="header-label">Location</span>
                  <span class="header-value">${loto?.location || "N/A"}</span>
                </div>
                <div class="header-item">
                  <span class="header-label">Isolator</span>
                  <span class="header-value">${
                    loto?.isolatorName || "N/A"
                  }</span>
                </div>
                <div class="header-item">
                  <span class="header-label">Current Responsible</span>
                  <span class="header-value">${
                    loto?.currentResponsibleName ||
                    (loto?.isolator
                      ? `${loto.isolator.firstName} ${loto.isolator.lastName}`
                      : "N/A")
                  }</span>
                </div>
              </div>
              <div style="text-align: center; margin-top: 8px; font-size: 8px; color: #666;">
                Printed on: ${new Date().toLocaleString()}
              </div>
            </div>

            <!-- Two Column Layout -->
            <div class="content-grid">
              <!-- Left Column -->
              <div>
                <!-- Basic Information -->
                <div class="section">
                  <div class="section-title">Basic Information</div>
                  <table class="info-table">
                    <tr>
                      <td class="label">Serial Number</td>
                      <td class="value">${loto?.serialNumber || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Status</td>
                      <td class="value">
                        <span class="status-badge status-${
                          loto?.status || ""
                        }">${getStatusDisplay(loto?.status)}</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="label">Shift</td>
                      <td class="value">${loto?.shift || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Isolator</td>
                      <td class="value">${loto?.isolatorName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Current Responsible</td>
                      <td class="value">${
                        loto?.currentResponsibleName ||
                        (loto?.isolator
                          ? `${loto.isolator.firstName} ${loto.isolator.lastName}`
                          : "N/A")
                      }</td>
                    </tr>
                    ${
                      loto?.customCreatedAt
                        ? `
                    <tr>
                      <td class="label">LOTO Date & Time</td>
                      <td class="value">
                        ${formatDate(loto?.date)}
                        <span class="time-badge backdated-badge">BACKDATED</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="label">System Created At</td>
                      <td class="value">
                        ${formatDate(loto?.createdAt)}
                        <span class="time-badge actual-badge">ACTUAL</span>
                      </td>
                    </tr>
                    `
                        : `
                    <tr>
                      <td class="label">Created At</td>
                      <td class="value">${formatDate(loto?.date)}</td>
                    </tr>
                    `
                    }
                  </table>
                </div>

                <!-- Location Information -->
                <div class="section">
                  <div class="section-title">Location Information</div>
                  <table class="info-table">
                    <tr>
                      <td class="label">Location</td>
                      <td class="value">${loto?.location || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Line</td>
                      <td class="value">${loto?.line || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Machine</td>
                      <td class="value">${loto?.machine || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Isolated Part</td>
                      <td class="value">${loto?.isolatedPart || "N/A"}</td>
                    </tr>
                  </table>
                </div>

                <!-- Work Details -->
                <div class="section">
                  <div class="section-title">Work Details</div>
                  <table class="info-table">
                    <tr>
                      <td class="label">Reason</td>
                      <td class="value">${loto?.reason || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">PTW Number</td>
                      <td class="value">${loto?.ptwNumber || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Expected Duration</td>
                      <td class="value">${loto?.expectedDuration || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Supervisor Assignment</td>
                      <td class="value">${loto?.supervisorName || "N/A"}</td>
                    </tr>
                  </table>
                </div>
              </div>

              <!-- Right Column -->
              <div>

                <!-- Energy Types -->
                ${
                  loto?.energyTypes && loto.energyTypes.length > 0
                    ? `
                <div class="section">
                  <div class="section-title">Energy Types & Isolation Points</div>
                  <table class="info-table">
                    ${loto.energyTypes
                      .map(
                        (energy, index) => `
                    <tr>
                      <td class="label">Energy Type ${index + 1}</td>
                      <td class="value">${energy.type || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Isolation Point ${index + 1}</td>
                      <td class="value">${energy.isolationPoint || "N/A"}</td>
                    </tr>
                    `
                      )
                      .join("")}
                  </table>
                </div>
                `
                    : ""
                }

                <!-- Verification Information -->
                ${
                  loto?.verifiedBy
                    ? `
                <div class="section">
                  <div class="section-title">Verification Information</div>
                  <table class="info-table">
                    <tr>
                      <td class="label">Verified By</td>
                      <td class="value">${
                        loto?.verifiedBy
                          ? `${loto.verifiedBy.firstName} ${loto.verifiedBy.lastName}`
                          : "N/A"
                      }</td>
                    </tr>
                    <tr>
                      <td class="label">Verified At</td>
                      <td class="value">${formatDate(loto.verifiedAt)}</td>
                    </tr>
                  </table>
                </div>
                `
                    : ""
                }

                <!-- Completion Information -->
                ${
                  loto?.completedAt
                    ? `
                <div class="section">
                  <div class="section-title">Completion Information</div>
                  <table class="info-table">
                    <tr>
                      <td class="label">Completed By</td>
                      <td class="value">${loto?.completedByName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Work Finished At</td>
                      <td class="value">
                        ${formatDate(loto?.completedAt)}
                        ${
                          loto?.customCompletedAt
                            ? '<span class="time-badge backdated-badge">BACKDATED</span>'
                            : ""
                        }
                      </td>
                    </tr>
                    ${
                      loto?.actualFinishTime
                        ? `
                    <tr>
                      <td class="label">Actual Finish Time</td>
                      <td class="value">
                        ${formatDate(loto?.actualFinishTime)}
                        <span class="time-badge actual-badge">ACTUAL</span>
                      </td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      loto?.completionNotes
                        ? `
                    <tr>
                      <td class="label">Completion Notes</td>
                      <td class="value">${loto.completionNotes}</td>
                    </tr>
                    `
                        : ""
                    }
                  </table>
                </div>
                `
                    : ""
                }

              </div>
            </div>

            <!-- Handover History - Two Column Layout -->
            ${
              handoverHistory && handoverHistory.length > 0
                ? `
            <div class="section" style="margin-top: 5px;">
              <div class="section-title">Handover History</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <!-- Left Column -->
                <div>
                  ${handoverHistory
                    .slice(0, Math.ceil(handoverHistory.length / 2))
                    .map(
                      (handover, index) => `
                  <div style="margin-bottom: 8px; border: 1px solid #ccc; padding: 8px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">Transfer #${
                      index + 1
                    }</div>
                    <table class="info-table">
                      <tr>
                        <td class="label">From</td>
                        <td class="value">${handover.fromUserName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td class="label">To</td>
                        <td class="value">${handover.toUserName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td class="label">Date & Time</td>
                        <td class="value">${formatDate(
                          handover.handoverDate
                        )}</td>
                      </tr>
                      <tr>
                        <td class="label">Type</td>
                        <td class="value">${
                          handover.handoverType
                            ? handover.handoverType
                                .replace("_", " ")
                                .toUpperCase()
                            : "N/A"
                        }</td>
                      </tr>
                      ${
                        handover.handoverNotes
                          ? `
                      <tr>
                        <td class="label">Notes</td>
                        <td class="value">${handover.handoverNotes}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        handover.createdByName
                          ? `
                      <tr>
                        <td class="label">Created By</td>
                        <td class="value">${handover.createdByName}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        handover.recipientStatus === "accepted" &&
                        handover.recipientDecisionDate
                          ? `
                      <tr>
                        <td class="label">Accepted On</td>
                        <td class="value">${formatDate(
                          handover.recipientDecisionDate
                        )}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        handover.verificationStatus === "approved" &&
                        handover.verifiedByName
                          ? `
                      <tr>
                        <td class="label">Approved By</td>
                        <td class="value">${handover.verifiedByName}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        handover.verificationStatus === "approved" &&
                        handover.verificationDate
                          ? `
                      <tr>
                        <td class="label">Approved On</td>
                        <td class="value">${formatDate(
                          handover.verificationDate
                        )}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </div>
                  `
                    )
                    .join("")}
                </div>
                
                <!-- Right Column -->
                <div>
                  ${handoverHistory
                    .slice(Math.ceil(handoverHistory.length / 2))
                    .map(
                      (handover, index) => `
                  <div style="margin-bottom: 8px; border: 1px solid #ccc; padding: 8px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">Transfer #${
                      Math.ceil(handoverHistory.length / 2) + index + 1
                    }</div>
                    <table class="info-table">
                      <tr>
                        <td class="label">From</td>
                        <td class="value">${handover.fromUserName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td class="label">To</td>
                        <td class="value">${handover.toUserName || "N/A"}</td>
                      </tr>
                      <tr>
                        <td class="label">Date & Time</td>
                        <td class="value">${formatDate(
                          handover.handoverDate
                        )}</td>
                      </tr>
                      <tr>
                        <td class="label">Type</td>
                        <td class="value">${
                          handover.handoverType
                            ? handover.handoverType
                                .replace("_", " ")
                                .toUpperCase()
                            : "N/A"
                        }</td>
                      </tr>
                      ${
                        handover.handoverNotes
                          ? `
                      <tr>
                        <td class="label">Notes</td>
                        <td class="value">${handover.handoverNotes}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        handover.createdByName
                          ? `
                      <tr>
                        <td class="label">Created By</td>
                        <td class="value">${handover.createdByName}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        handover.recipientStatus === "accepted" &&
                        handover.recipientDecisionDate
                          ? `
                      <tr>
                        <td class="label">Accepted On</td>
                        <td class="value">${formatDate(
                          handover.recipientDecisionDate
                        )}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        handover.verificationStatus === "approved" &&
                        handover.verifiedByName
                          ? `
                      <tr>
                        <td class="label">Approved By</td>
                        <td class="value">${handover.verifiedByName}</td>
                      </tr>
                      `
                          : ""
                      }
                      ${
                        handover.verificationStatus === "approved" &&
                        handover.verificationDate
                          ? `
                      <tr>
                        <td class="label">Approved On</td>
                        <td class="value">${formatDate(
                          handover.verificationDate
                        )}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
            `
                : ""
            }

            <!-- Footer -->
            <div class="footer">
              <p>This document was generated from the LOTO Management System</p>
              <p>Document ID: ${
                loto?.serialNumber || "N/A"
              } | Generated: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete LOTO ${loto.serialNumber}? This action cannot be undone.`
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `/api/loto/${id}`,
        config
      );

      alert("LOTO deleted successfully!");
      navigate("/loto-list");
    } catch (err) {
      console.error("Delete LOTO error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t("lotoDetails.errorDeletingLoto");
      alert(`${t("lotoDetails.deleteFailed")}: ${errorMessage}`);
    }
  };

  const handleVerify = async () => {
    // First check if machine scanning is required
    const status = await fetchScanStatus();
    
    if (status && status.requiredMachines && status.requiredMachines.length > 0) {
      // Machine has a serial number, check if scanning is required
      if (!status.allScanned) {
        // Clear any pending alert timeout
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
          alertTimeoutRef.current = null;
        }
        
        // Reset ALL flags for this new scanning session
        allScannedAlertShown.current = false;
        scanProcessing.current = false;
        lastScanTime.current = 0;
        // Show scanner modal
        setScannerModalOpen(true);
        return;
      }
    }

    // If no scanning required or all machines scanned, proceed with verification
    if (!window.confirm("Are you sure you want to verify this LOTO?")) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `/api/loto/${id}/verify`,
        {},
        config
      );

      setLoto(res.data.data);
      alert("LOTO verified successfully!");
      fetchLOTO();
    } catch (err) {
      if (err.response?.data?.requiresScan) {
        // Clear any pending alert timeout
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
          alertTimeoutRef.current = null;
        }
        
        // Backend says scanning is required - reset ALL flags
        allScannedAlertShown.current = false;
        scanProcessing.current = false;
        lastScanTime.current = 0;
        setScannerModalOpen(true);
        return;
      }
      alert(err.response?.data?.message || t("lotoDetails.errorVerifyingLoto"));
    }
  };

  const handleUpdate = () => navigate(`/loto/${id}/update`);
  const handleComplete = () => navigate(`/loto/${id}/complete`);

  const handleReject = (loto) => {
    setSelectedLotoForRejection(loto);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (rejectionData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `/api/loto/${selectedLotoForRejection._id}/reject`,
        rejectionData,
        config
      );

      if (res.data.success) {
        alert(t("lotoDetails.lotoRejectedSuccessfully"));
        setRejectModalOpen(false);
        setSelectedLotoForRejection(null);
        // Refresh the LOTO data
        fetchLOTO();
      }
    } catch (err) {
      alert(err.response?.data?.message || t("lotoDetails.errorRejectingLoto"));
    }
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
    setSelectedLotoForRejection(null);
  };

  const handleStatusChange = (loto) => {
    setSelectedLotoForStatusChange(loto);
    setStatusChangeModalOpen(true);
  };

  const handleStatusChangeConfirm = async (statusData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `/api/loto/${selectedLotoForStatusChange._id}/status`,
        statusData,
        config
      );

      if (res.data.success) {
        alert(`LOTO status changed successfully: ${res.data.message}`);
        setStatusChangeModalOpen(false);
        setSelectedLotoForStatusChange(null);
        // Refresh the LOTO data
        fetchLOTO();
      }
    } catch (err) {
      alert(
        err.response?.data?.message || t("lotoDetails.errorChangingStatus")
      );
    }
  };

  const handleStatusChangeModalClose = () => {
    setStatusChangeModalOpen(false);
    setSelectedLotoForStatusChange(null);
  };

  const handleHandover = (loto) => {
    setSelectedLotoForHandover(loto);
    setHandoverModalOpen(true);
  };

  const handleHandoverConfirm = async (handoverData) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        `/api/loto/${id}/handover`,
        handoverData,
        config
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchLOTO();
        fetchHandoverHistory();
        setHandoverModalOpen(false);
        setSelectedLotoForHandover(null);
      }
    } catch (err) {
      console.error("Error creating handover:", err);
      alert(
        err.response?.data?.message || t("lotoDetails.errorCreatingHandover")
      );
    }
  };

  const handleHandoverModalClose = () => {
    setHandoverModalOpen(false);
    setSelectedLotoForHandover(null);
  };

  const handleRecipientDecision = async (handoverIndex, action) => {
    try {
      const decisionNotes = prompt(
        `Enter notes for ${action}ing the handover:`
      );

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.put(
        `/api/loto/${loto._id}/handover/${handoverIndex}/recipient-decision`,
        {
          action,
          decisionNotes,
        },
        config
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchLOTO(); // Refresh the LOTO data
      }
    } catch (err) {
      console.error("Error making recipient decision:", err);
      alert(
        err.response?.data?.message || t("lotoDetails.errorMakingDecision")
      );
    }
  };

  const handleVerifyHandover = async (handoverIndex, action) => {
    try {
      const verificationNotes = prompt(
        `Enter verification notes for ${action}:`
      );
      const rejectionReason =
        action === "reject" ? prompt("Enter rejection reason:") : "";

      if (action === "reject" && !rejectionReason) {
        alert(t("lotoDetails.rejectionReasonRequired"));
        return;
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.put(
        `/api/loto/${loto._id}/handover/${handoverIndex}/verify`,
        {
          action,
          verificationNotes,
          rejectionReason,
        },
        config
      );

      if (res.data.success) {
        alert(res.data.message);
        fetchLOTO(); // Refresh the LOTO data
      }
    } catch (err) {
      console.error("Error verifying handover:", err);
      alert(
        err.response?.data?.message || t("lotoDetails.errorVerifyingHandover")
      );
    }
  };

  const handleApproveHandover = async () => {
    try {
      // Get the latest handover index (last one in the array)
      if (!handoverHistory || handoverHistory.length === 0) {
        alert(t("lotoDetails.noHandoverFoundToApprove"));
        return;
      }

      const handoverIndex = handoverHistory.length - 1;
      await handleVerifyHandover(handoverIndex, "approve");
    } catch (err) {
      console.error("Error approving handover:", err);
      alert(t("lotoDetails.errorApprovingHandover"));
    }
  };

  const handleRejectHandover = async () => {
    try {
      // Get the latest handover index (last one in the array)
      if (!handoverHistory || handoverHistory.length === 0) {
        alert(t("lotoDetails.noHandoverFoundToReject"));
        return;
      }

      const handoverIndex = handoverHistory.length - 1;
      await handleVerifyHandover(handoverIndex, "reject");
    } catch (err) {
      console.error("Error rejecting handover:", err);
      alert(t("lotoDetails.errorRejectingHandover"));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">{t("lotoDetails.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center mb-4">
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

  // 👇 Build full location path — handle missing fields gracefully
  // 👇 Build full location path — with fallback message if incomplete
  const locationPathParts = [];

  if (loto.location) locationPathParts.push(loto.location);
  if (loto.line) locationPathParts.push(loto.line);
  if (loto.machine) locationPathParts.push(loto.machine);

  let locationPath = locationPathParts.join(" > ");

  // 👇 If only location is present, hint that more could be added
  if (locationPath && !loto.line && !loto.machine) {
    locationPath += " (add line/machine for full path)";
  }

  locationPath = locationPath || "N/A";

  // 👇 Status Badge with Emoji — styled like CreateLOTO
  const getStatusBadge = (status) => {
    const config = {
      pending_verification_new: {
        text: t("lotoDetails.pendingVerificationNew"),
        variant: "warning",
      },
      active: { text: t("lotoDetails.active"), variant: "success" },
      pending_handover_verification: {
        text: t("lotoDetails.pendingHandoverVerification"),
        variant: "info",
      },
      handed_over: { text: t("lotoDetails.handedOver"), variant: "primary" },
      completed: { text: t("lotoDetails.completed"), variant: "secondary" },
      rejected: { text: t("lotoDetails.rejected"), variant: "danger" },
    }[status] || { text: status, variant: "secondary" };

    return (
      <span
        className={`badge bg-${config.variant} fs-6 px-3 py-2 rounded-pill`}
      >
        {config.text}
      </span>
    );
  };

  const isHandoverRecipient =
    currentUser && loto.handoverTo && loto.handoverTo._id === currentUser.id;
  const isIsolator =
    currentUser && loto.isolator && loto.isolator._id === currentUser.id;

  // CRITICAL: Check if user is the CURRENT RESPONSIBLE (after handovers)
  // This ensures only the current responsible person can perform actions
  const isCurrentResponsible = (() => {
    if (!currentUser) return false;

    // Primary check: by ID if available
    if (loto.currentResponsible && loto.currentResponsible._id) {
      return loto.currentResponsible._id === currentUser.id;
    }

    // Fallback check: by name if ID is missing (backend issue)
    if (
      loto.currentResponsibleName &&
      currentUser.firstName &&
      currentUser.lastName
    ) {
      const currentUserName =
        `${currentUser.firstName} ${currentUser.lastName}`.trim();
      const responsibleName = loto.currentResponsibleName.trim();
      return currentUserName.toLowerCase() === responsibleName.toLowerCase();
    }

    // Final fallback: if no handover history, check if user is the isolator
    if (!loto.handoverHistory || loto.handoverHistory.length === 0) {
      return isIsolator;
    }

    return false;
  })();

  const canVerify = (() => {
    if (!currentUser) return false;

    // Admins can always verify
    if (currentUser.role === "admin") return true;

    // For supervisors, check if they are the assigned supervisor
    if (currentUser.role === "supervisor") {
      // Primary check: by ID if supervisor is populated
      if (loto.supervisor && loto.supervisor._id) {
        return loto.supervisor._id === currentUser.id;
      }

      // Fallback check: by name if ID is not populated (backend issue)
      if (
        loto.supervisorName &&
        currentUser.firstName &&
        currentUser.lastName
      ) {
        const currentUserName =
          `${currentUser.firstName} ${currentUser.lastName}`.trim();
        const supervisorName = loto.supervisorName.trim();
        return currentUserName.toLowerCase() === supervisorName.toLowerCase();
      }
    }

    return false;
  })();

  const isAdmin = currentUser && currentUser.role === "admin";
  const isTechnician = currentUser && currentUser.role === "technician";
  const isSupervisor = currentUser && currentUser.role === "supervisor";

  // Debug logging
  console.log("🔍 LOTOdetail Permission Debug:", {
    currentUser: currentUser
      ? {
          id: currentUser.id,
          role: currentUser.role,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
        }
      : null,
    loto: {
      status: loto.status,
      currentResponsibleName: loto.currentResponsibleName,
      currentResponsible_id: loto.currentResponsible?._id,
      isolator: loto.isolator
        ? `${loto.isolator.firstName} ${loto.isolator.lastName}`
        : null,
      supervisorName: loto.supervisorName,
      supervisor_id: loto.supervisor?._id,
    },
    permissions: {
      isCurrentResponsible,
      isIsolator,
      isAdmin,
      isTechnician,
      isSupervisor,
      canVerify,
    },
    buttonConditions: {
      activeButtons:
        loto.status === "active" && isCurrentResponsible && !isAdmin,
      verifyButtons: loto.status === "pending_verification_new" && canVerify,
      rejectedEditButton:
        loto.status === "rejected" && isCurrentResponsible && !isAdmin,
      pendingUpdateButton:
        loto.status === "pending_verification_new" && isCurrentResponsible,
    },
  });

  return (
    <div className="loto-details-container animate-fade-in">
      <BackButton to="/loto-list" label={t("lotoDetails.backToMyLotos")} />

      {/* Modern Header Section */}
      <div className="loto-details-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon">
              <svg className="header-svg" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="brand-text">
              <h1>{t("lotoDetails.title")}</h1>
              <p>
                {t("lotoDetails.serialNumberLabel")}: {loto.serialNumber}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="action-btn secondary" onClick={handlePrint}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t("lotoDetails.print")}</span>
            </button>
            <button className="action-btn secondary" onClick={fetchLOTO}>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M1 4v6h6M23 20v-6h-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t("lotoDetails.refresh")}</span>
            </button>
            <button
              className="action-btn secondary"
              onClick={() => navigate("/loto-list")}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t("lotoDetails.backToList")}</span>
            </button>
            <button
              className="action-btn primary"
              onClick={() =>
                navigate(
                  currentUser?.role === "technician"
                    ? "/technician-home"
                    : "/Home"
                )
              }
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{t("lotoDetails.home")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Error Display */}
      {error && (
        <div className="modern-error-alert">
          <div className="error-icon">
            <svg className="error-svg" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="15"
                y1="9"
                x2="9"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="9"
                x2="15"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="error-content">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Modern Content Layout */}
      <div className="loto-details-content">
        {/* Main Information Section */}
        <div className="main-info-section">
          <div className="info-header">
            <div className="info-icon">
              <svg className="info-svg" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="info-title">
              <h3>{t("lotoDetails.lotoInformation")}</h3>
              <p>{t("lotoDetails.completeDetailsAndStatus")}</p>
            </div>
            <div className="status-badge-container">
              {getStatusBadge(loto.status)}
            </div>
          </div>

          <div className="info-grid">
            {/* Basic Information */}
            <div className="info-group">
              <h4 className="group-title">
                {t("lotoDetails.basicInformation")}
              </h4>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-label">
                    {t("lotoDetails.serialNumber")}
                  </span>
                  <span className="info-value">{loto.serialNumber}</span>
                </div>
                <div
                  className={`info-item ${
                    loto.customCreatedAt ? "custom-time-highlight" : ""
                  }`}
                >
                  <span className="info-label">
                    {loto.customCreatedAt
                      ? t("lotoDetails.lotoDateTime")
                      : t("lotoDetails.createdAt")}
                    {loto.customCreatedAt && (
                      <span
                        className="custom-time-badge"
                        title="This LOTO was created with a custom timestamp"
                      >
                        🕒 Backdated
                      </span>
                    )}
                  </span>
                  <span className="info-value">
                    {new Date(loto.date).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                {loto.customCreatedAt && loto.createdAt && (
                  <div className="info-item">
                    <span className="info-label">
                      {t("lotoDetails.actualCreatedAt")}
                      <span
                        style={{
                          backgroundColor: "#059669",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          marginLeft: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        title="Actual system creation time"
                      >
                        ✓ Actual
                      </span>
                    </span>
                    <span className="info-value">
                      {new Date(loto.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">{t("lotoDetails.shift")}</span>
                  <span className="info-value">{loto.shift}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    {t("lotoDetails.isolator")}
                  </span>
                  <span className="info-value">{loto.isolatorName}</span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="info-group">
              <h4 className="group-title">
                {t("lotoDetails.locationDetails")}
              </h4>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-label">
                    {t("lotoDetails.location")}
                  </span>
                  <span className="info-value location-path">
                    {locationPath}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    {t("lotoDetails.isolatedPart")}
                  </span>
                  <span className="info-value">{loto.isolatedPart}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">{t("lotoDetails.reason")}</span>
                  <span className="info-value">{loto.reason}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    {t("lotoDetails.ptwNumber")}
                  </span>
                  <span className="info-value">{loto.ptwNumber}</span>
                </div>
              </div>
            </div>

            {/* Duration & Supervisor */}
            <div className="info-group">
              <h4 className="group-title">{t("lotoDetails.workDetails")}</h4>
              <div className="info-items">
                <div className="info-item">
                  <span className="info-label">
                    {t("lotoDetails.expectedDuration")}
                  </span>
                  <span className="info-value">
                    {loto.expectedDuration} hours
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    {t("lotoDetails.supervisorAssignment")}
                  </span>
                  <span
                    className={`info-value ${
                      loto.supervisorName
                        ? "supervisor-assigned"
                        : "no-supervisor"
                    }`}
                  >
                    {loto.supervisorName || t("lotoDetails.noneAssigned")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Types Section */}
          <div className="energy-types-section">
            <h4 className="section-title">{t("lotoDetails.energyTypes")}</h4>
            {loto.energyTypes && loto.energyTypes.length > 0 ? (
              <div className="energy-types-grid">
                {loto.energyTypes.map((energy, index) => (
                  <div key={index} className="energy-type-card">
                    <div className="energy-type-header">
                      <span className="energy-type-name">{energy.type}</span>
                    </div>
                    <div className="energy-type-content">
                      <span className="isolation-point">
                        {energy.isolationPoint}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-energy-types">
                <span>{t("lotoDetails.noEnergyTypesSpecified")}</span>
              </div>
            )}
          </div>

          {/* Additional Information Sections */}
          <div className="additional-info-sections">
            {/* Verified By */}
            {loto.verifiedBy && (
              <div className="info-section verified-section">
                <div className="section-icon">
                  <svg className="section-svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="section-content">
                  <h5>{t("lotoDetails.verifiedBy")}</h5>
                  <div className="verification-details">
                    <span className="verifier-name">
                      {loto.verifiedBy.firstName} {loto.verifiedBy.lastName}
                    </span>
                    <span className="verification-time">
                      {new Date(loto.verifiedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Handover Notes */}
            {loto.handoverNotes && (
              <div className="info-section handover-section">
                <div className="section-icon">
                  <svg className="section-svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="section-content">
                  <h5>{t("lotoDetails.handoverNotes")}</h5>
                  <p className="notes-text">{loto.handoverNotes}</p>
                </div>
              </div>
            )}

            {/* Completion Notes */}
            {loto.completionNotes && (
              <div className="info-section completion-section">
                <div className="section-icon">
                  <svg className="section-svg" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 11.08V12a10 10 0 11-5.93-9.14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22,4 12,14.01 9,11.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="section-content">
                  <h5>{t("lotoDetails.completionNotes")}</h5>
                  <p className="notes-text">{loto.completionNotes}</p>
                </div>
              </div>
            )}

            {/* Handover History Section */}
            <div className="info-section handover-history-section">
              <div className="section-content">
                <div className="section-header">
                  <h5>{t("lotoDetails.handoverHistory")}</h5>
                  <p>{t("lotoDetails.completeChainOfResponsibility")}</p>
                </div>

                {historyLoading ? (
                  <div className="loading-text">
                    {t("lotoDetails.loadingHandoverHistory")}
                  </div>
                ) : handoverHistory && handoverHistory.length > 0 ? (
                  <div className="handover-history-content">
                    {/* Handover Chain */}
                    <div className="handover-chain">
                      <h6>{t("lotoDetails.responsibilityChain")}:</h6>
                      <div className="chain-display">
                        {(() => {
                          const chain = [
                            `${loto.isolator.firstName} ${loto.isolator.lastName}`,
                          ];
                          handoverHistory.forEach((handover) => {
                            chain.push(`${handover.toUserName}`);
                          });
                          return chain.join(" → ");
                        })()}
                      </div>
                    </div>

                    {/* Current Responsible */}
                    <div className="current-responsible">
                      <h6>{t("lotoDetails.currentResponsible")}:</h6>
                      <span className="responsible-name">
                        {loto.currentResponsibleName ||
                          `${loto.isolator.firstName} ${loto.isolator.lastName}`}
                      </span>
                    </div>

                    {/* Detailed History */}
                    <div className="detailed-history">
                      <h6>{t("lotoDetailsHistory.detailedHistory")}:</h6>
                      <div className="history-list">
                        {handoverHistory.map((handover, index) => (
                          <div key={index} className="history-item">
                            <div className="history-main">
                              <span className="from-user">
                                {handover.fromUserName}
                              </span>
                              <span className="arrow">→</span>
                              <span className="to-user">
                                {handover.toUserName}
                              </span>
                            </div>
                            <div className="history-details">
                              <span className="handover-date">
                                {new Date(
                                  handover.handoverDate
                                ).toLocaleString()}
                              </span>
                              <span className="handover-type">
                                {handover.handoverType
                                  ?.replace("_", " ")
                                  .toUpperCase()}
                              </span>
                              <span className="created-by">
                                {t("lotoDetailsHistory.createdBy")}:{" "}
                                {handover.createdByName}
                              </span>
                            </div>
                            {handover.handoverNotes && (
                              <div className="handover-notes">
                                <strong>
                                  {t("lotoDetailsHistory.notes")}:
                                </strong>{" "}
                                {handover.handoverNotes}
                              </div>
                            )}

                            {/* Recipient Decision Status */}
                            <div className="recipient-decision-section">
                              <div className="recipient-status">
                                <strong>
                                  {t("lotoDetailsHistory.recipientDecision")}:
                                </strong>
                                <span
                                  className={`recipient-badge ${
                                    handover.recipientStatus || "pending"
                                  }`}
                                >
                                  {handover.recipientStatus === "accepted"
                                    ? `✅ ${t("lotoDetailsHistory.accepted")}`
                                    : handover.recipientStatus === "rejected"
                                    ? `❌ ${t("lotoDetailsHistory.rejected")}`
                                    : `⏳ ${t(
                                        "lotoDetailsHistory.pendingDecision"
                                      )}`}
                                </span>
                              </div>

                              {handover.recipientStatus === "accepted" &&
                                handover.recipientDecisionDate && (
                                  <div className="recipient-details">
                                    <span className="recipient-decision-info">
                                      {t("lotoDetailsHistory.acceptedOn")}{" "}
                                      {new Date(
                                        handover.recipientDecisionDate
                                      ).toLocaleString()}
                                    </span>
                                    {handover.recipientDecisionNotes && (
                                      <div className="recipient-decision-notes">
                                        <strong>
                                          {t(
                                            "lotoDetailsHistory.decisionNotes"
                                          )}
                                          :
                                        </strong>{" "}
                                        {handover.recipientDecisionNotes}
                                      </div>
                                    )}
                                  </div>
                                )}

                              {handover.recipientStatus === "rejected" &&
                                handover.recipientDecisionDate && (
                                  <div className="recipient-details">
                                    <span className="recipient-decision-info">
                                      {t("lotoDetailsHistory.rejectedOn")}{" "}
                                      {new Date(
                                        handover.recipientDecisionDate
                                      ).toLocaleString()}
                                    </span>
                                    {handover.recipientDecisionNotes && (
                                      <div className="recipient-decision-notes">
                                        <strong>
                                          {t(
                                            "lotoDetailsHistory.rejectionNotes"
                                          )}
                                          :
                                        </strong>{" "}
                                        {handover.recipientDecisionNotes}
                                      </div>
                                    )}
                                  </div>
                                )}

                              {/* Recipient Decision Buttons */}
                              {handover.recipientStatus === "pending" &&
                                currentUser?.id === handover.toUser && (
                                  <div className="recipient-actions">
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() =>
                                        handleRecipientDecision(index, "accept")
                                      }
                                    >
                                      ✅ {t("lotoDetails.approve")}
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        handleRecipientDecision(index, "reject")
                                      }
                                    >
                                      ❌ {t("lotoDetails.reject")}
                                    </button>
                                  </div>
                                )}
                            </div>

                            {/* Verification Status */}
                            <div className="verification-section">
                              <div className="verification-status">
                                <strong>
                                  {t(
                                    "lotoDetailsHistory.supervisorVerification"
                                  )}
                                  :
                                </strong>
                                <span
                                  className={`verification-badge ${
                                    handover.verificationStatus || "pending"
                                  }`}
                                >
                                  {handover.verificationStatus === "approved"
                                    ? `✅ ${t("lotoDetailsHistory.approved")}`
                                    : handover.verificationStatus === "rejected"
                                    ? `❌ ${t("lotoDetailsHistory.rejected")}`
                                    : handover.recipientStatus === "accepted"
                                    ? `⏳ ${t(
                                        "lotoDetailsHistory.pendingVerification"
                                      )}`
                                    : `⏸️ ${t(
                                        "lotoDetailsHistory.waitingForRecipientDecision"
                                      )}`}
                                </span>
                              </div>

                              {handover.verificationStatus === "approved" &&
                                handover.verifiedByName && (
                                  <div className="verification-details">
                                    <span className="verified-by">
                                      {t("lotoDetailsHistory.approvedBy")}{" "}
                                      {handover.verifiedByName}{" "}
                                      {t("lotoDetailsHistory.approvedAt")}{" "}
                                      {new Date(
                                        handover.verificationDate
                                      ).toLocaleString()}
                                    </span>
                                    {handover.verificationNotes && (
                                      <div className="verification-notes">
                                        <strong>
                                          {t(
                                            "lotoDetailsHistory.verificationNotes"
                                          )}
                                          :
                                        </strong>{" "}
                                        {handover.verificationNotes}
                                      </div>
                                    )}
                                  </div>
                                )}

                              {handover.verificationStatus === "rejected" &&
                                handover.verifiedByName && (
                                  <div className="verification-details">
                                    <span className="verified-by">
                                      {t("lotoDetailsHistory.rejectedBy")}{" "}
                                      {handover.verifiedByName}{" "}
                                      {t("lotoDetailsHistory.rejectedAt")}{" "}
                                      {new Date(
                                        handover.verificationDate
                                      ).toLocaleString()}
                                    </span>
                                    {handover.rejectionReason && (
                                      <div className="rejection-reason">
                                        <strong>
                                          {t(
                                            "lotoDetailsHistory.rejectionReason"
                                          )}
                                          :
                                        </strong>{" "}
                                        {handover.rejectionReason}
                                      </div>
                                    )}
                                    {handover.verificationNotes && (
                                      <div className="verification-notes">
                                        <strong>
                                          {t(
                                            "lotoDetailsHistory.verificationNotes"
                                          )}
                                          :
                                        </strong>{" "}
                                        {handover.verificationNotes}
                                      </div>
                                    )}
                                  </div>
                                )}

                              {/* Verification Action Buttons */}
                              {handover.recipientStatus === "accepted" &&
                                (!handover.verificationStatus ||
                                  handover.verificationStatus === "pending") &&
                                (currentUser?.role === "supervisor" ||
                                  currentUser?.role === "admin") && (
                                  <div className="verification-actions">
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() =>
                                        handleVerifyHandover(index, "approve")
                                      }
                                    >
                                      ✅ Approve
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() =>
                                        handleVerifyHandover(index, "reject")
                                      }
                                    >
                                      ❌ Reject
                                    </button>
                                  </div>
                                )}

                              {/* Assigned Verifier for Pending Handovers */}
                              {(!handover.verificationStatus ||
                                handover.verificationStatus === "pending") &&
                                handover.assignedVerifierName && (
                                  <div className="assigned-verifier">
                                    <strong>
                                      {t("lotoDetailsHistory.assignedVerifier")}
                                      :
                                    </strong>{" "}
                                    {handover.assignedVerifierName}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-history">
                    <p>{t("lotoDetails.noHandoverHistoryAvailable")}</p>
                    <div className="current-responsible">
                      <h6>{t("lotoDetails.currentResponsible")}:</h6>
                      <span className="responsible-name">
                        {`${loto.isolator.firstName} ${loto.isolator.lastName}`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Completion Information */}
            {loto.completedAt && (
              <div className="info-section finish-section">
                <div className="section-icon">
                  <svg className="section-svg" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <polyline
                      points="12,6 12,12 16,14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="section-content">
                  <h5>Completion Information</h5>
                  <div className="finish-details">
                    <div className="finish-info-row">
                      <strong>Work Actually Finished At (User Entry):</strong>
                      <span className="finish-time">
                        {new Date(loto.completedAt).toLocaleString()}
                      </span>
                    </div>
                    {loto.actualFinishTime && (
                      <div
                        className="finish-info-row"
                        style={{
                          marginTop: "8px",
                          fontSize: "0.9em",
                          opacity: "0.8",
                        }}
                      >
                        <strong>Complete Button Clicked At (System):</strong>
                        <span>
                          {new Date(loto.actualFinishTime).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  {loto.completedByName && (
                    <div
                      className="completed-by-details"
                      style={{ marginTop: "12px" }}
                    >
                      <strong>{t("lotoDetails.completedBy")}:</strong>{" "}
                      {loto.completedByName}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Actions Section */}
        <div className="actions-section">
          <div className="actions-header">
            <div className="actions-icon">
              <svg className="actions-svg" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="actions-title">
              <h3>{t("lotoDetails.actions")}</h3>
              <p>{t("lotoDetails.availableOperations")}</p>
            </div>
          </div>

          <div className="actions-content">
            {/* Handover Recipient Decision - Prominent Section */}
            {loto.status === "pending_handover_verification" &&
              loto.handoverHistory &&
              loto.handoverHistory.length > 0 &&
              loto.handoverHistory[loto.handoverHistory.length - 1]
                .recipientStatus === "pending" &&
              currentUser?.id ===
                loto.handoverHistory[loto.handoverHistory.length - 1]
                  .toUser && (
                <div className="action-group handover-recipient-group">
                  <div className="action-header">
                    <h5>{t("lotoDetails.handoverDecisionRequired")}</h5>
                    <p>{t("lotoDetails.handoverDecisionDesc")}</p>
                    <div className="handover-details">
                      <strong>{t("lotoDetails.from")}:</strong>{" "}
                      {
                        loto.handoverHistory[loto.handoverHistory.length - 1]
                          .fromUserName
                      }
                      <br />
                      <strong>{t("lotoDetails.date")}:</strong>{" "}
                      {new Date(
                        loto.handoverHistory[
                          loto.handoverHistory.length - 1
                        ].handoverDate
                      ).toLocaleString()}
                      <br />
                      {loto.handoverHistory[loto.handoverHistory.length - 1]
                        .handoverNotes && (
                        <>
                          <strong>{t("lotoDetails.notes")}:</strong>{" "}
                          {
                            loto.handoverHistory[
                              loto.handoverHistory.length - 1
                            ].handoverNotes
                          }
                        </>
                      )}
                    </div>
                  </div>
                  <div className="action-button-container">
                    <button
                      className="action-button success"
                      onClick={() =>
                        handleRecipientDecision(
                          loto.handoverHistory.length - 1,
                          "accept"
                        )
                      }
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.approve")}</span>
                    </button>
                    <button
                      className="action-button danger"
                      onClick={() =>
                        handleRecipientDecision(
                          loto.handoverHistory.length - 1,
                          "reject"
                        )
                      }
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <line
                          x1="18"
                          y1="6"
                          x2="6"
                          y2="18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="6"
                          y1="6"
                          x2="18"
                          y2="18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.reject")}</span>
                    </button>
                  </div>
                </div>
              )}

            {/* Verification */}
            {loto.status === "pending_verification_new" && canVerify && (
              <div className="action-group verification-group">
                <div className="action-header">
                  <h5>{t("lotoDetails.verificationRequired")}</h5>
                  <p>{t("lotoDetails.verificationDesc")}</p>
                </div>
                <div className="action-button-container">
                  <button
                    className="action-button success "
                    onClick={handleVerify}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.verify")}</span>
                  </button>
                  <button
                    className="action-button danger"
                    onClick={() => handleReject(loto)}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <line
                        x1="18"
                        y1="6"
                        x2="6"
                        y2="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.reject")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Current User Actions for Handover Verification */}
            {loto.status === "pending_handover_verification" && currentUser && (
              <div className="action-group current-user-group">
                <div className="action-header">
                  <h5>{t("lotoDetails.availableActions")}</h5>
                  <p>{t("lotoDetails.availableActionsDesc")}</p>
                </div>
                <div className="action-button-container">
                  <button
                    className="action-button primary"
                    onClick={() => navigate(`/loto/${id}/update`)}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.edit")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Handover Verification */}
            {loto.status === "pending_handover_verification" && canVerify && (
              <div className="action-group handover-verification-group">
                <div className="action-header">
                  <h5>{t("lotoDetails.handoverVerificationRequired")}</h5>
                  <p>{t("lotoDetails.handoverVerificationDesc")}</p>
                </div>
                <div className="action-button-container">
                  <button
                    className="action-button success"
                    onClick={handleApproveHandover}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.approve")}</span>
                  </button>
                  <button
                    className="action-button danger"
                    onClick={handleRejectHandover}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <line
                        x1="18"
                        y1="6"
                        x2="6"
                        y2="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.reject")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Admin Full Control - Comprehensive Actions */}
            {isAdmin && (
              <div className="action-group admin-group">
                <div className="action-header">
                  <h5>🔧 {t("lotoDetails.adminActions")}</h5>
                  <p>{t("lotoDetails.fullAdministrativeControl")}</p>
                </div>
                <div className="action-button-container">
                  {/* Edit Button - Always available for admins */}
                  {loto.status !== "completed" && (
                    <button
                      className="action-button primary"
                      onClick={handleUpdate}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.edit")}</span>
                    </button>
                  )}

                  {/* Verify Button - For pending verification */}
                  {loto.status === "pending_verification_new" && (
                    <button
                      className="action-button success"
                      onClick={handleVerify}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.verify")}</span>
                    </button>
                  )}

                  {/* Reject Button - For pending statuses */}
                  {(loto.status === "pending_verification_new" ||
                    loto.status.includes("pending")) &&
                    loto.status !== "completed" && (
                      <button
                        className="action-button danger"
                        onClick={() => handleReject(loto)}
                      >
                        <svg
                          className="btn-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <line
                            x1="18"
                            y1="6"
                            x2="6"
                            y2="18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <line
                            x1="6"
                            y1="6"
                            x2="18"
                            y2="18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span>{t("lotoDetails.reject")}</span>
                      </button>
                    )}

                  {/* Approve Handover - For pending handover verification */}
                  {loto.status === "pending_handover_verification" && (
                    <button
                      className="action-button success"
                      onClick={handleApproveHandover}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>
                        {t("lotoDetails.approve")} {t("lotoDetails.handover")}
                      </span>
                    </button>
                  )}

                  {/* Reject Handover - For pending handover verification */}
                  {loto.status === "pending_handover_verification" && (
                    <button
                      className="action-button danger"
                      onClick={handleRejectHandover}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <line
                          x1="18"
                          y1="6"
                          x2="6"
                          y2="18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="6"
                          y1="6"
                          x2="18"
                          y2="18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>
                        {t("lotoDetails.reject")} {t("lotoDetails.handover")}
                      </span>
                    </button>
                  )}

                  {/* Handover Button - For active and non-completed LOTOs */}
                  {loto.status !== "completed" && (
                    <button
                      className="action-button info"
                      onClick={() => handleHandover(loto)}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.handover")}</span>
                    </button>
                  )}

                  {/* Complete Button - For active LOTOs */}
                  {(loto.status === "active" ||
                    loto.status === "handed_over") && (
                    <button
                      className="action-button success"
                      onClick={handleComplete}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M22 11.08V12a10 10 0 11-5.93-9.14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="22,4 12,14.01 9,11.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.complete")}</span>
                    </button>
                  )}

                  {/* Status Change Button - Always Available for Admins */}
                  <button
                    className="action-button primary"
                    onClick={() => handleStatusChange(loto)}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.statusChange")}</span>
                  </button>

                  {/* Delete Button - Always Available for Admins */}
                  <button
                    className="action-button danger"
                    onClick={handleDelete}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <polyline
                        points="3,6 5,6 21,6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.delete")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Edit Rejected LOTO */}
            {loto.status === "rejected" && isCurrentResponsible && !isAdmin && (
              <div className="action-group edit-group">
                <div className="action-header">
                  <h5>{t("lotoDetails.editRequired")}</h5>
                  <p>{t("lotoDetails.editRequiredDesc")}</p>
                </div>
                <div className="action-button-container">
                  <button
                    className="action-button warning"
                    onClick={handleUpdate}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.edit")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Current Responsible User Actions */}
            {loto.status === "active" && isCurrentResponsible && !isAdmin && (
              <div className="action-group technician-group">
                <div className="action-header">
                  <h5>🔧 {t("lotoDetails.currentResponsibleActions")}</h5>
                  <p>{t("lotoDetails.actionsForCurrentResponsible")}</p>
                </div>
                <div className="action-buttons">
                  <button
                    className="action-button info"
                    onClick={() => handleHandover(loto)}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.handover")}</span>
                  </button>
                  <button
                    className="action-button success"
                    onClick={handleComplete}
                  >
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 11.08V12a10 10 0 11-5.93-9.14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="22,4 12,14.01 9,11.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{t("lotoDetails.complete")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Update Button for Current Responsible (Pending) */}
            {loto.status === "pending_verification_new" &&
              isCurrentResponsible && (
                <div className="action-group update-group">
                  <div className="action-header">
                    <h5>{t("lotoDetails.updateRequired")}</h5>
                    <p>{t("lotoDetails.updateRequiredDesc")}</p>
                  </div>
                  <div className="action-button-container">
                    <button
                      className="action-button primary "
                      onClick={handleUpdate}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.updateDetails")}</span>
                    </button>
                  </div>
                </div>
              )}

            {/* Supervisor/Admin Full Actions */}
            {loto.status === "active" &&
              isCurrentResponsible &&
              (isSupervisor || currentUser?.role === "admin") && (
                <div className="action-group supervisor-group">
                  <div className="action-header">
                    <h5>
                      {currentUser?.role === "admin"
                        ? t("lotoDetails.adminActions")
                        : t("lotoDetails.supervisorActions")}
                    </h5>
                    <p>{t("lotoDetails.fullAdministrativeOperations")}</p>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="action-button primary"
                      onClick={handleUpdate}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.edit")}</span>
                    </button>
                    <button
                      className="action-button info"
                      onClick={() => handleHandover(loto)}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.handover")}</span>
                    </button>
                    <button
                      className="action-button success"
                      onClick={handleComplete}
                    >
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M22 11.08V12a10 10 0 11-5.93-9.14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="22,4 12,14.01 9,11.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{t("lotoDetails.complete")}</span>
                    </button>
                  </div>
                </div>
              )}

            {/* Status Information */}
            <div className="status-info-section">
              <div className="status-header">
                <h5>{t("lotoDetails.currentStatus")}</h5>
                <div className="status-badge-large">
                  {getStatusBadge(loto.status)}
                </div>
              </div>
              <div className="status-description">
                {loto.status === "pending_verification_new" &&
                  t("lotoDetails.awaitingSupervisorVerification")}
                {loto.status === "pending_handover_verification" &&
                  t("lotoDetails.waitingForHandoverVerification")}
                {loto.status === "active" &&
                  t("lotoDetails.maintenanceInProgress")}
                {loto.status === "completed" &&
                  t("lotoDetails.workCompletedAndLotoClosed")}
                {loto.status === "rejected" &&
                  t("lotoDetails.lotoRejectedRequiresModification")}
              </div>
            </div>

            {/* Rejection Information */}
            {loto.status === "rejected" && (
              <div className="action-group rejection-group">
                <div className="action-header">
                  <h5>{t("lotoDetails.rejectionDetails")}</h5>
                  <p>{t("lotoDetails.rejectionDetailsDesc")}</p>
                </div>
                <div className="rejection-details">
                  <div className="rejection-info">
                    <div className="rejection-field">
                      <label>{t("lotoDetails.rejectedBy")}:</label>
                      <span>
                        {loto.rejectedBy
                          ? `${loto.rejectedBy.firstName} ${loto.rejectedBy.lastName}`
                          : t("lotoDetails.unknown")}
                      </span>
                    </div>
                    <div className="rejection-field">
                      <label>{t("lotoDetails.rejectedAt")}:</label>
                      <span>
                        {loto.rejectedAt
                          ? new Date(loto.rejectedAt).toLocaleString()
                          : t("lotoDetails.unknown")}
                      </span>
                    </div>
                    <div className="rejection-field">
                      <label>{t("lotoDetails.rejectionNotes")}:</label>
                      <div className="rejection-notes">
                        {loto.rejectionNotes ||
                          t("lotoDetails.noNotesProvided")}
                      </div>
                    </div>
                    {loto.rejectedFields && loto.rejectedFields.length > 0 && (
                      <div className="rejection-field">
                        <label>
                          {t("lotoDetails.fieldsRequiringCorrection")}:
                        </label>
                        <div className="rejected-fields-list">
                          {loto.rejectedFields.map((field, index) => (
                            <span key={index} className="rejected-field-badge">
                              {field === "shift" && t("lotoDetails.shift")}
                              {field === "location" &&
                                t("lotoDetails.location")}
                              {field === "line" && t("lotoDetails.line")}
                              {field === "machine" && t("lotoDetails.machine")}
                              {field === "isolatedPart" &&
                                t("lotoDetails.isolatedPart")}
                              {field === "reason" && t("lotoDetails.reason")}
                              {field === "ptwNumber" &&
                                t("lotoDetails.ptwNumber")}
                              {field === "expectedDuration" &&
                                t("lotoDetails.expectedDuration")}
                              {field === "supervisor" &&
                                t("lotoDetails.supervisorAssignment")}
                              {field === "energyTypes" &&
                                t("lotoDetails.energyTypes")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <RejectLOTOModal
        isOpen={rejectModalOpen}
        onClose={handleRejectModalClose}
        onConfirm={handleRejectConfirm}
        lotoData={selectedLotoForRejection}
      />

      {/* Status Change Modal */}
      <StatusChangeModal
        isOpen={statusChangeModalOpen}
        onClose={handleStatusChangeModalClose}
        onConfirm={handleStatusChangeConfirm}
        lotoData={selectedLotoForStatusChange}
        currentStatus={loto?.status}
      />

      {/* Handover Modal */}
      <HandoverModal
        isOpen={handoverModalOpen}
        onClose={handleHandoverModalClose}
        onConfirm={handleHandoverConfirm}
        lotoData={selectedLotoForHandover}
        currentUser={currentUser}
      />

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        onScan={handleScan}
        requiredMachines={scanStatus?.requiredMachines || []}
      />
    </div>
  );
};

export default LOTOdetail;
