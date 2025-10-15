import React, { useState, useEffect } from 'react';
import Button from './Button';
import Icon from './Icon';

const StatusChangeModal = ({ isOpen, onClose, onConfirm, lotoData, currentStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [additionalData, setAdditionalData] = useState({});
  const [supervisors, setSupervisors] = useState([]);
  const [fetchingSupervisors, setFetchingSupervisors] = useState(false);

  const statusOptions = [
    { value: 'pending_verification_new', label: 'Pending Verification (New)', description: 'Awaiting supervisor verification' },
    { value: 'active', label: 'Active', description: 'Maintenance in progress' },
    { value: 'pending_handover_verification', label: 'Pending Handover Verification', description: 'Waiting for handover verification' },
    { value: 'handed_over', label: 'Handed Over', description: 'LOTO successfully handed over to another user' },
    { value: 'completed', label: 'Completed', description: 'Work completed and LOTO closed' },
    { value: 'rejected', label: 'Rejected', description: 'LOTO rejected - requires modification' },
  ];

  // Fetch supervisors when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSupervisors();
    }
  }, [isOpen]);

  const fetchSupervisors = async () => {
    setFetchingSupervisors(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch all users (technicians and supervisors) for handover
      const res = await fetch(
        "https://loto-backend-643788243736.europe-west1.run.app/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("Fetched users data:", data);
      
      // Filter for technicians and supervisors only
      let users = [];
      if (data.success && Array.isArray(data.data)) {
        users = data.data.filter(user => 
          user.role === 'technician' || user.role === 'supervisor'
        );
      } else if (Array.isArray(data.data?.users)) {
        users = data.data.users.filter(user => 
          user.role === 'technician' || user.role === 'supervisor'
        );
      } else if (Array.isArray(data.users)) {
        users = data.users.filter(user => 
          user.role === 'technician' || user.role === 'supervisor'
        );
      }
      
      console.log("Filtered users for handover:", users);
      setSupervisors(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSupervisors([]);
    } finally {
      setFetchingSupervisors(false);
    }
  };

  // Get required fields based on selected status
  const getRequiredFields = (status) => {
    switch (status) {
      case 'active':
        return [
          { name: 'assignedTechnician', label: 'Assigned Technician', type: 'text', required: false },
          { name: 'workStartTime', label: 'Work Start Time', type: 'datetime-local', required: false },
          { name: 'estimatedCompletion', label: 'Estimated Completion', type: 'datetime-local', required: false }
        ];
      case 'completed':
        return [
          { name: 'completionTime', label: 'Completion Time', type: 'datetime-local', required: false },
          { name: 'completedBy', label: 'Completed By', type: 'text', required: false },
          { name: 'workSummary', label: 'Work Summary', type: 'textarea', required: false }
        ];
      case 'pending_handover_verification':
        return [
          { name: 'handoverTo', label: 'Handover To', type: 'select', required: true, options: supervisors },
          { name: 'handoverReason', label: 'Handover Reason', type: 'textarea', required: true }
        ];
      case 'handed_over':
        return [
          { name: 'handoverTo', label: 'Handover To', type: 'select', required: true, options: supervisors },
          { name: 'handoverReason', label: 'Handover Reason', type: 'textarea', required: true }
        ];
      case 'rejected':
        return [
          { name: 'rejectionReason', label: 'Rejection Reason', type: 'textarea', required: true },
          { name: 'rejectedFields', label: 'Fields Requiring Correction', type: 'checkbox-group', required: false }
        ];
      case 'pending_verification_new':
        return [];
      default:
        return [];
    }
  };

  const requiredFields = getRequiredFields(selectedStatus);

  const handleFieldChange = (fieldName, value) => {
    setAdditionalData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleConfirm = () => {
    if (!selectedStatus) {
      alert('Please select a new status.');
      return;
    }

    if (selectedStatus === currentStatus) {
      alert('Please select a different status from the current one.');
      return;
    }

    // Validate required fields
    const missingFields = requiredFields.filter(field => field.required && !additionalData[field.name]);
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    onConfirm({
      status: selectedStatus,
      notes: notes.trim(),
      additionalData: additionalData
    });
    
    // Reset form
    setSelectedStatus('');
    setNotes('');
    setAdditionalData({});
  };

  const handleClose = () => {
    setSelectedStatus('');
    setNotes('');
    setAdditionalData({});
    onClose();
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={additionalData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="form-control"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      case 'datetime-local':
        return (
          <input
            type="datetime-local"
            value={additionalData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="form-control"
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={additionalData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="form-control"
            rows="3"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      case 'select':
        return (
          <select
            value={additionalData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="form-control"
            required={field.required}
            disabled={fetchingSupervisors}
          >
            <option value="">
              {fetchingSupervisors ? 'Loading users...' : `Select ${field.label}`}
            </option>
            {!fetchingSupervisors && field.options && field.options.length > 0 ? (
              field.options.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.firstName} {option.lastName} ({option.role})
                </option>
              ))
            ) : !fetchingSupervisors ? (
              <option value="" disabled>No users available</option>
            ) : null}
          </select>
        );
      case 'checkbox-group':
        const fieldOptions = [
          { value: 'shift', label: 'Shift' },
          { value: 'location', label: 'Location' },
          { value: 'line', label: 'Line' },
          { value: 'machine', label: 'Machine' },
          { value: 'isolatedPart', label: 'Isolated Part' },
          { value: 'reason', label: 'Reason' },
          { value: 'ptwNumber', label: 'PTW Number' },
          { value: 'expectedDuration', label: 'Expected Duration' },
          { value: 'supervisor', label: 'Supervisor Assignment' },
          { value: 'energyTypes', label: 'Energy Types' },
        ];
        return (
          <div className="field-selection-grid">
            {fieldOptions.map((option) => (
              <div key={option.value} className="field-checkbox-item">
                <label className="field-checkbox-label">
                  <input
                    type="checkbox"
                    className="field-checkbox"
                    checked={(additionalData[field.name] || []).includes(option.value)}
                    onChange={(e) => {
                      const currentValues = additionalData[field.name] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter(v => v !== option.value);
                      handleFieldChange(field.name, newValues);
                    }}
                  />
                  <span className="field-checkbox-text">{option.label}</span>
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container status-change-modal">
        <div className="modal-header">
          <h3>Change LOTO Status</h3>
          <button className="modal-close" onClick={handleClose}>
            <Icon name="x" />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="status-info">
            <p><strong>LOTO:</strong> {lotoData?.serialNumber}</p>
            <p><strong>Isolated Part:</strong> {lotoData?.isolatedPart}</p>
            <p><strong>Current Status:</strong> 
              <span className={`status-badge status-${currentStatus}`}>
                {statusOptions.find(opt => opt.value === currentStatus)?.label || currentStatus}
              </span>
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="newStatus">
              New Status <span className="required">*</span>
            </label>
            <select
              id="newStatus"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select new status</option>
              {statusOptions
                .filter(option => option.value !== currentStatus)
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
            </select>
          </div>

          {/* Dynamic Required Fields */}
          {requiredFields.length > 0 && (
            <div className="required-fields-section">
              <h5>Required Information for {statusOptions.find(opt => opt.value === selectedStatus)?.label}</h5>
              {requiredFields.map((field) => (
                <div key={field.name} className="form-group">
                  <label htmlFor={field.name}>
                    {field.label} {field.required && <span className="required">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="statusNotes">
              Change Notes (Optional)
            </label>
            <textarea
              id="statusNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes explaining why the status is being changed..."
              rows="3"
              className="form-control"
            />
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            <Icon name="check" />
            Change Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;
