import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScanType } from "html5-qrcode";
import Icon from "./Icon";
import StandardButton from "./StandardButton";
import { useTranslation } from "react-i18next";
import "./BarcodeScannerModal.css";

const BarcodeScannerModal = ({ isOpen, onClose, onScan, requiredMachines = [] }) => {
  const { t } = useTranslation();
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [scannedCodes, setScannedCodes] = useState(new Set());
  const scanningCompleted = useRef(false); // Track if all machines are scanned to stop processing
  const isProcessing = useRef(false); // Prevent concurrent scan processing
  const lastScanTime = useRef(0); // Track last scan timestamp for debouncing

  useEffect(() => {
    if (isOpen && !isScanning) {
      scanningCompleted.current = false; // Reset the completion flag when modal opens
      isProcessing.current = false; // Reset processing lock
      lastScanTime.current = 0; // Reset last scan time
      setScannedCodes(new Set()); // Clear scanned codes
      setError(""); // Clear errors
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setError("");
      console.log("🎥 Starting camera initialization...");
      
      // Check browser compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.");
      }
      
      const scannerId = "barcode-scanner";
      html5QrCodeRef.current = new Html5Qrcode(scannerId);

      // Simple config for maximum compatibility
      const config = {
        fps: 10, // Lower FPS for better compatibility
        qrbox: { width: 250, height: 150 }, // Standard scan area
        aspectRatio: 1.777778,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: false,
        defaultZoomValueIfSupported: 1.0,
        useBarCodeDetectorIfSupported: true
      };

      console.log("🎥 Camera config:", config);

      // Simple camera constraints for maximum compatibility
      const cameraConstraints = {
        facingMode: "environment"
      };

      console.log("🎥 Starting scanner with constraints:", cameraConstraints);

      // Try multiple camera initialization methods
      let startPromise;
      
      try {
        // Method 1: Try with camera constraints object
        startPromise = html5QrCodeRef.current.start(
          cameraConstraints,
          config,
          (decodedText, decodedResult) => {
            console.log("📱 Scan successful:", decodedText);
            handleScanSuccess(decodedText, decodedResult);
          },
          (errorMessage) => {
            // Log scan errors for debugging
            console.log("📱 Scan error (normal):", errorMessage);
          }
        );
      } catch (constraintErr) {
        console.log("🔄 Method 1 failed, trying method 2...");
        // Method 2: Try with just facing mode string
        startPromise = html5QrCodeRef.current.start(
          "environment",
          config,
          (decodedText, decodedResult) => {
            console.log("📱 Scan successful:", decodedText);
            handleScanSuccess(decodedText, decodedResult);
          },
          (errorMessage) => {
            console.log("📱 Scan error (normal):", errorMessage);
          }
        );
      }

      // Add 15-second timeout (increased for better compatibility)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Camera initialization timeout after 15 seconds"));
        }, 15000);
      });

      await Promise.race([startPromise, timeoutPromise]);

      console.log("✅ Camera started successfully!");
      setIsScanning(true);
    } catch (err) {
      console.error("❌ Error starting scanner:", err);
      console.error("❌ Error details:", {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      let errorMessage = "Failed to start camera.";
      
      if (err.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied. Please allow camera access and try again.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera found. Please check your device has a camera.";
      } else if (err.name === 'NotSupportedError') {
        errorMessage = "Camera not supported. Please try a different browser.";
      } else if (err.message.includes('Permission')) {
        errorMessage = "Camera permission required. Please allow camera access.";
      } else if (err.message.includes('NotReadableError')) {
        errorMessage = "Camera is being used by another application. Please close other camera apps.";
      } else if (err.message.includes('OverconstrainedError')) {
        errorMessage = "Camera constraints not supported. Trying with basic settings...";
        // Try with even simpler constraints
        try {
          await html5QrCodeRef.current.start(
            "environment", // Just the facing mode
            config,
            (decodedText, decodedResult) => {
              handleScanSuccess(decodedText, decodedResult);
            },
            (errorMessage) => {
              // Ignore scan errors
            }
          );
          console.log("✅ Camera started with basic constraints!");
          setIsScanning(true);
          return;
        } catch (retryErr) {
          console.error("❌ Retry failed:", retryErr);
          errorMessage = "Camera not available. Please check your device and browser compatibility.";
        }
      } else if (err.message.includes('timeout')) {
        errorMessage = "Camera initialization timed out. Please try again or check camera permissions.";
      } else if (err.message.includes('NotReadableError')) {
        errorMessage = "Camera is being used by another application. Please close other camera apps and try again.";
      } else if (err.message.includes('AbortError')) {
        errorMessage = "Camera access was aborted. Please allow camera permissions and try again.";
      } else if (err.message.includes('SecurityError')) {
        errorMessage = "Camera access blocked by browser security. Please check HTTPS and camera permissions.";
      } else {
        errorMessage = `Camera error: ${err.message}. Please check your device and browser compatibility.`;
      }
      
      setError(errorMessage);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleScanSuccess = async (decodedText, decodedResult) => {
    // CRITICAL: All checks must be synchronous to block iPhone's rapid scanning
    const now = Date.now();
    
    // FAST DEBOUNCE: Reject scans within 50ms of last scan (very fast for responsive UX)
    if (now - lastScanTime.current < 50) {
      console.log("Scan too fast, ignoring (debounce)");
      return;
    }
    
    // Stop processing if scanning is already completed
    if (scanningCompleted.current) {
      console.log("Scanning already completed, ignoring");
      return;
    }

    // Prevent concurrent processing - critical to avoid spam
    if (isProcessing.current) {
      console.log("Already processing, ignoring");
      return;
    }

    // Prevent duplicate scans of same code
    if (scannedCodes.has(decodedText)) {
      console.log("Code already scanned, ignoring");
      return;
    }

    // IMMEDIATELY update timestamp and lock processing (SYNCHRONOUS - before any async)
    lastScanTime.current = now;
    isProcessing.current = true;

    // Add to scanned codes to prevent immediate re-scan
    setScannedCodes(prev => new Set([...prev, decodedText]));
    
    // Call the onScan callback
    try {
      setError(""); // Clear previous errors
      const result = await onScan(decodedText);
      
      // Check if all machines are now scanned based on the return value
      if (result && result.allScanned) {
        // Mark scanning as completed and stop the scanner immediately
        scanningCompleted.current = true;
        await stopScanner();
        // Don't unlock processing - we're done
        return;
      }
      
      // On success, clear the scanned code after 1 second to allow faster re-scanning
      setTimeout(() => {
        setScannedCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(decodedText);
          return newSet;
        });
      }, 1000);
    } catch (err) {
      const errorMsg = err.message || "Failed to process scan";
      setError(errorMsg);
      
      // On error, keep the code blocked for shorter time (2 seconds) for faster retry
      setTimeout(() => {
        setScannedCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(decodedText);
          return newSet;
        });
        setError(""); // Clear error after cooldown
      }, 2000);
    } finally {
      // FAST unlock processing for responsive UX
      if (!scanningCompleted.current) {
        setTimeout(() => {
          isProcessing.current = false;
        }, 50); // Very fast delay for responsive scanning
      }
    }
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  const allScanned = requiredMachines.length > 0 && 
                     requiredMachines.every(m => m.isScanned);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content barcode-scanner-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header with Camera */}
        <div className="modal-header-with-camera">
          <div className="camera-container">
            <div id="barcode-scanner" ref={scannerRef}></div>
            {!isScanning && !error && (
              <div className="scanner-loading">
                <Icon name="loader" size="lg" className="spinner" />
                <p>{t('scanner.startingCamera')}</p>
              </div>
            )}
          </div>
          <button className="close-button" onClick={handleClose}>
            <Icon name="x" size="md" />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              <Icon name="alert-circle" size="sm" />
              {error}
              <div style={{ marginTop: '10px' }}>
                <StandardButton 
                  onClick={() => {
                    setError("");
                    startScanner();
                  }} 
                  variant="secondary" 
                  size="sm"
                >
                  <Icon name="refresh-cw" size="sm" />
                  Retry Camera
                </StandardButton>
              </div>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing.current && (
            <div className="alert alert-info">
              <Icon name="loader" size="sm" className="spinner" />
              Processing scan...
            </div>
          )}

          {/* Machines List */}
          {requiredMachines.length > 0 && (
            <div className="machines-list">
              <h3>
                <Icon name="list" size="sm" />
                {t('scanner.machinesToScan')} ({requiredMachines.filter(m => m.isScanned).length}/{requiredMachines.length})
              </h3>
              <ul className="machines-checklist">
                {requiredMachines.map((machine, index) => (
                  <li key={index} className={machine.isScanned ? "scanned" : ""}>
                    <Icon 
                      name={machine.isScanned ? "check-circle" : "circle"} 
                      size="sm" 
                    />
                    <span>{machine.name}</span>
                    {machine.serialNumber && (
                      <span className="serial-number">{machine.serialNumber}</span>
                    )}
                    {machine.isScanned && machine.scannedAt && (
                      <span className="scan-time">
                        Scanned at {new Date(machine.scannedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
                {allScanned && (
                  <div className="alert alert-success">
                    <Icon name="check-circle" size="sm" />
                    {t('scanner.allMachinesScanned')}
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <StandardButton onClick={handleClose} variant="secondary">
            {allScanned ? t('scanner.done') : t('scanner.cancel')}
          </StandardButton>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;

