import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import Icon from './Icon';

const HandoverModal = ({ isOpen, onClose, onConfirm, lotoData, currentUser }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [handoverNotes, setHandoverNotes] = useState('');
  const [handoverType, setHandoverType] = useState('other');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handoverTypes = [
    { value: 'shift_change', label: 'Shift Change', description: 'End of shift handover' },
    { value: 'break_coverage', label: 'Break Coverage', description: 'Temporary coverage during break' },
    { value: 'maintenance_handover', label: 'Maintenance Handover', description: 'Handover for maintenance work' },
    { value: 'emergency', label: 'Emergency', description: 'Emergency situation handover' },
    { value: 'other', label: 'Other', description: 'Other reason' },
  ];

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/users/technicians",
        config
      );

      console.log("Debug - Full response:", res.data);
      
      // Make sure we're accessing the data correctly (same as HandoverLOTO.js)
      const technicians =
        res.data.data?.technicians || res.data.technicians || [];
      
      console.log("Debug - Extracted technicians:", technicians);
      
      // Filter out current user
      const filteredUsers = technicians.filter(user => 
        user._id !== currentUser?.id
      );
      
      console.log("Debug - Filtered users:", filteredUsers);
      
      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching technicians:", error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const onUserSelect = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setSelectedUser(userId);
      setSelectedUserName(`${user.firstName} ${user.lastName}`);
      setSearchTerm('');
    }
  };

  const handleConfirm = () => {
    if (!selectedUser) {
      alert('Please select a user to handover to.');
      return;
    }

    if (selectedUser === currentUser?.id) {
      alert('Cannot handover to yourself.');
      return;
    }

    onConfirm({
      toUser: selectedUser,
      handoverNotes: handoverNotes.trim(),
      handoverType: handoverType
    });
    
    // Reset form
    setSelectedUser('');
    setHandoverNotes('');
    setHandoverType('other');
  };

  const handleClose = () => {
    setSelectedUser('');
    setSelectedUserName('');
    setHandoverNotes('');
    setHandoverType('other');
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container handover-modal">
        <div className="modal-header">
          <h3>Create Handover</h3>
          <button className="modal-close" onClick={handleClose}>
            <Icon name="x" />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="handover-info">
            <p><strong>LOTO:</strong> {lotoData?.serialNumber}</p>
            <p><strong>Isolated Part:</strong> {lotoData?.isolatedPart}</p>
            <p><strong>Current Responsible:</strong> {lotoData?.currentResponsibleName || `${lotoData?.isolator?.firstName} ${lotoData?.isolator?.lastName}`}</p>
          </div>

          <div className="form-group">
            <label htmlFor="handoverType">
              Handover Type <span className="required">*</span>
            </label>
            <select
              id="handoverType"
              value={handoverType}
              onChange={(e) => setHandoverType(e.target.value)}
              className="form-control"
              required
            >
              {handoverTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="toUser">
              Handover To <span className="required">*</span>
            </label>
            {loading ? (
              <div className="loading-text">Loading technicians...</div>
            ) : (
              <>
                {/* Searchable Dropdown - Same as HandoverLOTO.js */}
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    position: "relative",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search technicians..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "none",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />

                  {/* Dropdown List */}
                  {searchTerm && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderTop: "none",
                        borderRadius: "0 0 4px 4px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user._id}
                            onClick={() => {
                              onUserSelect(user._id);
                            }}
                            style={{
                              padding: "10px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#f5f5f5")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "#fff")
                            }
                          >
                            {user.firstName} {user.lastName} ({user.username})
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "10px", color: "#666" }}>
                          No technicians found
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected User Display */}
                  {selectedUser && (
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderTop: "1px solid #eee",
                        fontSize: "14px",
                        color: "#495057",
                      }}
                    >
                      Selected: {selectedUserName}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="handoverNotes">
              Handover Notes
            </label>
            <textarea
              id="handoverNotes"
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              placeholder="Add notes about the handover (optional)..."
              rows="4"
              className="form-control"
            />
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={loading}>
            <Icon name="check" />
            Create Handover
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HandoverModal;
