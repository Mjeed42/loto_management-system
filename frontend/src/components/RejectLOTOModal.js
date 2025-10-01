import React, { useState } from 'react';
import Button from './Button';
import Icon from './Icon';

const RejectLOTOModal = ({ isOpen, onClose, onConfirm, lotoData }) => {
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [rejectedFields, setRejectedFields] = useState([]);

  const fieldLabels = {
    shift: 'Shift',
    location: 'Location',
    line: 'Line',
    machine: 'Machine',
    isolatedPart: 'Isolated Part',
    reason: 'Reason',
    ptwNumber: 'PTW Number',
    expectedDuration: 'Expected Duration',
    supervisor: 'Supervisor Assignment',
    energyTypes: 'Energy Types'
  };

  const handleFieldToggle = (field) => {
    setRejectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleConfirm = () => {
    if (!rejectionNotes.trim()) {
      alert('Please provide rejection notes.');
      return;
    }
    
    if (rejectedFields.length === 0) {
      alert('Please select at least one field that needs to be corrected.');
      return;
    }

    onConfirm({
      rejectionNotes: rejectionNotes.trim(),
      rejectedFields: rejectedFields
    });
    
    // Reset form
    setRejectionNotes('');
    setRejectedFields([]);
  };

  const handleClose = () => {
    setRejectionNotes('');
    setRejectedFields([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container rejection-modal">
        <div className="modal-header">
          <h3>Reject LOTO</h3>
          <button className="modal-close" onClick={handleClose}>
            <Icon name="x" />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="rejection-info">
            <p><strong>LOTO:</strong> {lotoData?.serialNumber}</p>
            <p><strong>Isolated Part:</strong> {lotoData?.isolatedPart}</p>
          </div>

          <div className="form-group">
            <label htmlFor="rejectionNotes">
              Rejection Notes <span className="required">*</span>
            </label>
            <textarea
              id="rejectionNotes"
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              placeholder="Please explain why this LOTO is being rejected and what needs to be corrected..."
              rows="4"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>
              Fields that need correction <span className="required">*</span>
            </label>
            <p className="field-help-text">
              Select the specific fields that have issues and need to be corrected by the user.
            </p>
            <div className="field-selection-grid">
              {Object.entries(fieldLabels).map(([field, label]) => (
                <div key={field} className="field-checkbox-item">
                  <label className="field-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rejectedFields.includes(field)}
                      onChange={() => handleFieldToggle(field)}
                      className="field-checkbox"
                    />
                    <span className="field-checkbox-text">{label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            <Icon name="x" />
            Reject LOTO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RejectLOTOModal;
