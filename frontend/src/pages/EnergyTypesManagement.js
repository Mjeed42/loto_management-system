import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import ActionButton from "../components/ActionButton";
import StandardButton from "../components/StandardButton";
import "../styles/pages/EnergyTypesManagement.css";

const EnergyTypesManagement = () => {
  const navigate = useNavigate();
  const [energyTypes, setEnergyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEnergyType, setSelectedEnergyType] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    category: "other",
    hazardLevel: "medium",
  });

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = [
    { value: "electrical", label: "Electrical" },
    { value: "mechanical", label: "Mechanical" },
    { value: "thermal", label: "Thermal" },
    { value: "chemical", label: "Chemical" },
    { value: "hydraulic", label: "Hydraulic" },
    { value: "pneumatic", label: "Pneumatic" },
    { value: "other", label: "Other" },
  ];

  const hazardLevels = [
    { value: "low", label: "Low", color: "green" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "high", label: "High", color: "orange" },
    { value: "critical", label: "Critical", color: "red" },
  ];

  useEffect(() => {
    fetchEnergyTypes();
  }, []);

  const fetchEnergyTypes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/energy-types?includeInactive=true",
        config
      );

      setEnergyTypes(res.data.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching energy types:", err);
      setError(err.response?.data?.message || "Error fetching energy types");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      symbol: "",
      description: "",
      category: "other",
      hazardLevel: "medium",
    });
    setError("");
    setShowAddModal(true);
  };

  const openEditModal = (energyType) => {
    setSelectedEnergyType(energyType);
    setFormData({
      name: energyType.name,
      symbol: energyType.symbol,
      description: energyType.description || "",
      category: energyType.category,
      hazardLevel: energyType.hazardLevel,
    });
    setError("");
    setShowEditModal(true);
  };

  const openDeleteModal = (energyType) => {
    setSelectedEnergyType(energyType);
    setError("");
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      symbol: "",
      description: "",
      category: "other",
      hazardLevel: "medium",
    });
    setSelectedEnergyType(null);
    setError("");
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.symbol.trim()) {
      setError("Name and symbol are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (showAddModal) {
        setIsCreating(true);
        await axios.post(
          "https://loto-backend-643788243736.europe-west1.run.app/api/energy-types",
          formData,
          config
        );
        setSuccess("Energy type created successfully");
      } else if (showEditModal) {
        setIsUpdating(true);
        await axios.put(
          `https://loto-backend-643788243736.europe-west1.run.app/api/energy-types/${selectedEnergyType._id}`,
          formData,
          config
        );
        setSuccess("Energy type updated successfully");
      }

      await fetchEnergyTypes();
      closeModal();
    } catch (err) {
      console.error("Error saving energy type:", err);
      setError(err.response?.data?.message || "Error saving energy type");
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `https://loto-backend-643788243736.europe-west1.run.app/api/energy-types/${selectedEnergyType._id}`,
        config
      );

      setSuccess("Energy type deleted successfully");
      await fetchEnergyTypes();
      closeModal();
    } catch (err) {
      console.error("Error deleting energy type:", err);
      setError(err.response?.data?.message || "Error deleting energy type");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleVisibility = async (energyType) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/energy-types/${energyType._id}/toggle-visibility`,
        {},
        config
      );

      const action = energyType.isActive ? "hidden" : "shown";
      setSuccess(`Energy type ${action} successfully`);
      
      // Update local state optimistically
      setEnergyTypes(prev => 
        prev.map(et => 
          et._id === energyType._id 
            ? { ...et, isActive: !et.isActive }
            : et
        )
      );
    } catch (err) {
      console.error("Error toggling visibility:", err);
      setError(err.response?.data?.message || "Error updating visibility");
    }
  };

  const getHazardColor = (level) => {
    const hazard = hazardLevels.find(h => h.value === level);
    return hazard ? hazard.color : "gray";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      electrical: "⚡",
      mechanical: "⚙️",
      thermal: "🔥",
      chemical: "🧪",
      hydraulic: "💧",
      pneumatic: "💨",
      other: "📦",
    };
    return icons[category] || "📦";
  };

  if (loading) {
    return (
      <div className="energy-types-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading energy types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="energy-types-container">
      <BackButton to="/admin-home" label="Back to Admin" />
      
      <div className="energy-types-header">
        <div className="header-content">
          <h1>Energy Types Management</h1>
          <p className="help-text">
            Manage energy types that can be isolated during LOTO procedures. 
            Hidden energy types won't appear in CreateLOTO forms.
          </p>
        </div>
        <StandardButton
          variant="primary"
          onClick={openAddModal}
          disabled={isCreating || isUpdating || isDeleting}
        >
          Add New Energy Type
        </StandardButton>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message" onClick={() => setSuccess("")}>
          {success}
        </div>
      )}

      <div className="energy-types-list">
        {energyTypes.length === 0 ? (
          <div className="empty-state">
            <p>No energy types found. Create your first energy type to get started.</p>
          </div>
        ) : (
          energyTypes.map((energyType) => (
            <div
              key={energyType._id}
              className={`energy-type-card ${!energyType.isActive ? 'inactive' : ''}`}
            >
              <div className="energy-type-info">
                <div className="energy-type-header">
                  <div className="energy-type-symbol">
                    {energyType.symbol}
                  </div>
                  <div className="energy-type-details">
                    <h3 className="energy-type-name">{energyType.name}</h3>
                    <div className="energy-type-badges">
                      <span className={`category-badge category-${energyType.category}`}>
                        {getCategoryIcon(energyType.category)} {categories.find(c => c.value === energyType.category)?.label}
                      </span>
                      <span className={`hazard-badge hazard-${getHazardColor(energyType.hazardLevel)}`}>
                        {hazardLevels.find(h => h.value === energyType.hazardLevel)?.label} Risk
                      </span>
                      <span className={`status-badge ${energyType.isActive ? 'active' : 'inactive'}`}>
                        {energyType.isActive ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                </div>
                {energyType.description && (
                  <p className="energy-type-description">{energyType.description}</p>
                )}
              </div>
              
              <div className="energy-type-actions">
                <ActionButton
                  variant="secondary"
                  icon="edit"
                  onClick={() => openEditModal(energyType)}
                  disabled={isCreating || isUpdating || isDeleting}
                  title={`Edit ${energyType.name}`}
                />
                <ActionButton
                  variant={energyType.isActive ? "warning" : "success"}
                  icon={energyType.isActive ? "eye-off" : "eye"}
                  onClick={() => toggleVisibility(energyType)}
                  disabled={isCreating || isUpdating || isDeleting}
                  title={energyType.isActive ? `Hide ${energyType.name}` : `Show ${energyType.name}`}
                />
                <ActionButton
                  variant="danger"
                  icon="trash"
                  onClick={() => openDeleteModal(energyType)}
                  disabled={isCreating || isUpdating || isDeleting}
                  title={`Delete ${energyType.name}`}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Energy Type</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Electrical, Hydraulic Pressure"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Symbol *</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="e.g., ⚡, 💧, 🔥"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Hazard Level</label>
                <select
                  value={formData.hazardLevel}
                  onChange={(e) => setFormData({ ...formData, hazardLevel: e.target.value })}
                >
                  {hazardLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} Risk
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this energy type..."
                  rows={3}
                />
              </div>
              
              <div className="modal-actions">
                <StandardButton type="button" onClick={closeModal} disabled={isCreating}>
                  Cancel
                </StandardButton>
                <StandardButton type="submit" variant="primary" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Energy Type"}
                </StandardButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Energy Type</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Symbol *</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Hazard Level</label>
                <select
                  value={formData.hazardLevel}
                  onChange={(e) => setFormData({ ...formData, hazardLevel: e.target.value })}
                >
                  {hazardLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} Risk
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="modal-actions">
                <StandardButton type="button" onClick={closeModal} disabled={isUpdating}>
                  Cancel
                </StandardButton>
                <StandardButton type="submit" variant="primary" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Energy Type"}
                </StandardButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Delete Energy Type</h2>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="delete-content">
              <p>Are you sure you want to delete this energy type?</p>
              <div className="delete-item">
                <strong>{selectedEnergyType?.symbol} {selectedEnergyType?.name}</strong>
              </div>
              <p className="warning-text">
                This action cannot be undone. This energy type will be removed from all LOTO forms.
              </p>
            </div>
            <div className="modal-actions">
              <StandardButton type="button" onClick={closeModal} disabled={isDeleting}>
                Cancel
              </StandardButton>
              <StandardButton type="button" variant="danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Energy Type"}
              </StandardButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyTypesManagement;








