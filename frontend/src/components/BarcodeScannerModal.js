import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Icon from "./Icon";
import StandardButton from "./StandardButton";
import "./BarcodeScannerModal.css";

const BarcodeScannerModal = ({ isOpen, onClose, onScan, requiredMachines = [] }) => {
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [scannedCodes, setScannedCodes] = useState(new Set());

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    try {
      setError("");
      const scannerId = "barcode-scanner";
      html5QrCodeRef.current = new Html5Qrcode(scannerId);

      const config = {
        fps: 10,
        qrbox: { width: 300, height: 200 },
        aspectRatio: 1.777778,
      };

      // Start the scanner (html5-qrcode supports Code 128 by default)
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          handleScanSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          // Ignore scan errors (they happen frequently during scanning)
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setError("Failed to start camera. Please check camera permissions.");
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
    // Prevent duplicate scans
    if (scannedCodes.has(decodedText)) {
      return;
    }

    // Add to scanned codes to prevent immediate re-scan
    setScannedCodes(prev => new Set([...prev, decodedText]));
    
    // Call the onScan callback
    try {
      setError(""); // Clear previous errors
      await onScan(decodedText);
      
      // On success, clear the scanned code after 2 seconds to allow re-scanning
      setTimeout(() => {
        setScannedCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(decodedText);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      const errorMsg = err.message || "Failed to process scan";
      setError(errorMsg);
      
      // On error, keep the code blocked for longer (5 seconds) to prevent spam
      setTimeout(() => {
        setScannedCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(decodedText);
          return newSet;
        });
        setError(""); // Clear error after cooldown
      }, 5000);
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
        <div className="modal-header">
          <h2>
            <Icon name="camera" size="md" />
            Scan Machine Barcode
          </h2>
          <button className="close-button" onClick={handleClose}>
            <Icon name="x" size="md" />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="alert alert-error">
              <Icon name="alert-circle" size="sm" />
              {error}
            </div>
          )}

          <div className="scanner-container">
            <div id="barcode-scanner" ref={scannerRef}></div>
            {!isScanning && !error && (
              <div className="scanner-loading">
                <Icon name="loader" size="lg" className="spinner" />
                <p>Starting camera...</p>
              </div>
            )}
          </div>

          <div className="scanner-instructions">
            <h3>
              <Icon name="info" size="sm" />
              Instructions
            </h3>
            <ul>
              <li>Point your camera at the <strong>correct machine's barcode</strong></li>
              <li>Keep the barcode within the scan area</li>
              <li>Make sure the barcode is well-lit and in focus</li>
              <li>The scan will happen automatically when detected</li>
            </ul>
            {requiredMachines.length > 0 && (
              <div style={{ 
                marginTop: '12px', 
                padding: '10px', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b',
                borderRadius: '6px'
              }}>
                <strong style={{ color: '#92400e' }}>⚠️ Scan Required:</strong>
                <div style={{ color: '#92400e', marginTop: '4px' }}>
                  {requiredMachines.map((m, i) => (
                    <div key={i}>• {m.name} {m.serialNumber ? `(SN: ${m.serialNumber})` : ''}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {requiredMachines.length > 0 && (
            <div className="machines-list">
              <h3>
                <Icon name="list" size="sm" />
                Machines to Scan
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
                  All machines scanned successfully!
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <StandardButton onClick={handleClose} variant="secondary">
            {allScanned ? "Done" : "Cancel"}
          </StandardButton>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;

