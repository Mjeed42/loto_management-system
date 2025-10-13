import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "../components/BackButton";
import Icon from "../components/Icon";
import StandardButton from "../components/StandardButton";
import ActionButton from "../components/ActionButton";
import "../styles/pages/LocationManagement.css";

const LocationManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [expandedLocations, setExpandedLocations] = useState(new Set());
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "location",
    typeLabel: "",
    section: "",
    parent: null,
    description: "",
    locationName: "",
    lineName: "",
    machineName: "",
  });

  // Track context for what we're adding
  const [addContext, setAddContext] = useState(null); // { parentType: 'location|line', parent: locationObject }
  
  // Loading states for operations
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [creationProgress, setCreationProgress] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  // Build hierarchy from flat list
  const buildHierarchy = (flatList) => {
    const map = {};
    const roots = [];

    // Create a map of all locations by ID
    flatList.forEach((loc) => {
      map[loc._id] = { ...loc, children: [] };
    });

    // Build the hierarchy
    flatList.forEach((loc) => {
      if (loc.parent) {
        // This is a child, add to parent's children array
        if (map[loc.parent]) {
          map[loc.parent].children.push(map[loc._id]);
        }
      } else {
        // This is a root location
        roots.push(map[loc._id]);
      }
    });

    return roots;
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Always include inactive locations in management view
      const url = "https://loto-backend-643788243736.europe-west1.run.app/api/locations?includeInactive=true";

      const res = await axios.get(url, config);

      if (res.data.success) {
        // Backend now returns flat list, so we need to build hierarchy on frontend
        const flatLocations = res.data.data || [];
        const hierarchy = buildHierarchy(flatLocations);
        setLocations(hierarchy);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Prevent multiple submissions
    if (isCreating || isUpdating) return;

    try {
      if (showEditModal) {
        setIsUpdating(true);
      } else {
        setIsCreating(true);
      }
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (showEditModal && selectedLocation) {
        // Edit mode - update existing location
        const submitData = {
          name: formData.name,
          code: formData.code,
          type: formData.type,
          typeLabel: formData.typeLabel,
          section: formData.section,
          parent: formData.parent,
        };
        
        await axios.put(
          `https://loto-backend-643788243736.europe-west1.run.app/api/locations/${selectedLocation._id}`,
          submitData,
          config
        );
        setSuccess("Location updated successfully");
      } else {
        // Add mode - create new location(s) based on form fields
        const { locationName, lineName, machineName } = formData;
        
        if (!locationName) {
          setError("Location Name is required");
          return;
        }

        // Step 1: Find or create location
        let location = locations.find(loc => loc.name.toLowerCase() === locationName.trim().toLowerCase());
        
        if (!location) {
          // Create new location
          const locRes = await axios.post(
            "https://loto-backend-643788243736.europe-west1.run.app/api/locations",
            {
              name: locationName.trim(),
              code: locationName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '-'),
              type: "location",
              parent: null,
            },
            config
          );
          location = locRes.data.data;
        }

        // Step 2: Find or create line (if provided)
        if (lineName && lineName.trim()) {
          // Refresh locations to get updated children
          const locationsRes = await axios.get(
            "https://loto-backend-643788243736.europe-west1.run.app/api/locations",
            config
          );
          const allLocs = locationsRes.data.data || [];
          const updatedLocation = allLocs.find(l => l._id === location._id);
          
          let line = allLocs.find(
            l => l.parent === location._id && l.name.toLowerCase() === lineName.trim().toLowerCase()
          );

          if (!line) {
            // Create new line
            const lineRes = await axios.post(
              "https://loto-backend-643788243736.europe-west1.run.app/api/locations",
              {
                name: lineName.trim(),
                code: lineName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '-'),
                type: "line",
                parent: location._id,
              },
              config
            );
            line = lineRes.data.data;
          }

          // Step 3: Create machine(s) (if provided)
          if (machineName && machineName.trim()) {
            // Split by newlines to support multiple machines
            const machineNames = machineName
              .split('\n')
              .map(name => name.trim())
              .filter(name => name.length > 0);

            let createdCount = 0;
            for (const mName of machineNames) {
              setCreationProgress(`Creating machine ${createdCount + 1}/${machineNames.length}: ${mName}`);
              await axios.post(
                "https://loto-backend-643788243736.europe-west1.run.app/api/locations",
                {
                  name: mName,
                  code: mName.toUpperCase().replace(/[^A-Z0-9]/g, '-'),
                  type: "machine",
                  parent: line._id,
                },
                config
              );
              createdCount++;
            }
            
            if (createdCount === 1) {
              setSuccess(`Machine "${machineNames[0]}" created under ${locationName} → ${lineName}`);
            } else {
              setSuccess(`${createdCount} machines created under ${locationName} → ${lineName}`);
            }
          } else {
            setSuccess(`Line "${lineName}" created under ${locationName}`);
          }
        } else {
          setSuccess(`Location "${locationName}" created`);
        }
      }

      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setIsCreating(false);
      setIsUpdating(false);
      setCreationProgress("");
    }
  };

  const handleDelete = async () => {
    if (!selectedLocation || isDeleting) return;

    // Check if location has children and require name confirmation
    const hasChildren = selectedLocation.children && selectedLocation.children.length > 0;
    if (hasChildren && deleteConfirmName !== selectedLocation.name) {
      setError("Please type the exact name to confirm deletion");
      return;
    }

    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Add cascade parameter if location has children
      const url = hasChildren
        ? `https://loto-backend-643788243736.europe-west1.run.app/api/locations/${selectedLocation._id}?cascade=true`
        : `https://loto-backend-643788243736.europe-west1.run.app/api/locations/${selectedLocation._id}`;

      await axios.delete(url, config);

      const deletedItems = hasChildren ? "Location and all its children deleted" : "Location deleted";
      setSuccess(`${deletedItems} successfully`);
      setShowDeleteConfirm(false);
      setSelectedLocation(null);
      setDeleteConfirmName("");
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete location");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleVisibility = async (location, newIsActive) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Optimistically update the local state immediately
      setLocations(prevLocations => {
        const updateLocationInTree = (locations) => {
          return locations.map(loc => {
            if (loc._id === location._id) {
              return { ...loc, isActive: newIsActive };
            }
            if (loc.children) {
              return { ...loc, children: updateLocationInTree(loc.children) };
            }
            return loc;
          });
        };
        return updateLocationInTree(prevLocations);
      });

      // Make the API call
      await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/locations/${location._id}`,
        {
          name: location.name,
          code: location.code,
          type: location.type,
          parent: location.parent,
          isActive: newIsActive,
        },
        config
      );

      // Show success message
      const itemType = location.type.charAt(0).toUpperCase() + location.type.slice(1);
      setSuccess(`${itemType} "${location.name}" ${newIsActive ? 'shown' : 'hidden'} successfully`);
      
      // Clear any previous errors
      setError("");
      
    } catch (err) {
      // Revert the optimistic update on error
      await fetchLocations();
      setError(err.response?.data?.message || "Failed to update location visibility");
    }
  };

  const openAddModal = (parentLocation = null) => {
    resetForm();
    
    if (parentLocation) {
      // Set context based on parent type
      setAddContext({
        parentType: parentLocation.type,
        parent: parentLocation
      });
      
      // Pre-fill location name if adding to a location
      if (parentLocation.type === "location") {
        setFormData(prev => ({
          ...prev,
          locationName: parentLocation.name
        }));
      } else if (parentLocation.type === "line") {
        // Find parent location of this line
        const parentLoc = findLocationParent(parentLocation._id);
        if (parentLoc) {
          setFormData(prev => ({
            ...prev,
            locationName: parentLoc.name,
            lineName: parentLocation.name
          }));
        }
      }
    } else {
      setAddContext(null);
    }
    
    setShowAddModal(true);
  };

  const openEditModal = (location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      code: location.code || "",
      type: location.type,
      typeLabel: location.typeLabel || "",
      section: location.section || "",
      parent: location.parent || null,
      description: location.description || "",
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (location) => {
    setSelectedLocation(location);
    setDeleteConfirmName("");
    setError("");
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      type: "location",
      typeLabel: "",
      parent: null,
      description: "",
      locationName: "",
      lineName: "",
      machineName: "",
    });
    setSelectedLocation(null);
    setAddContext(null);
    setCreationProgress("");
  };

  const findLocationParent = (childId) => {
    for (const loc of locations) {
      if (loc.children && loc.children.some(child => child._id === childId)) {
        return loc;
      }
      // Check nested children (lines)
      for (const child of loc.children || []) {
        if (child.children && child.children.some(grandchild => grandchild._id === childId)) {
          return loc;
        }
      }
    }
    return null;
  };

  const getChildType = (parentType) => {
    const typeMap = {
      location: "line",
      line: "machine",
    };
    return typeMap[parentType] || "machine";
  };

  const toggleExpand = (locationId) => {
    setExpandedLocations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(locationId)) {
        newSet.delete(locationId);
      } else {
        newSet.add(locationId);
      }
      return newSet;
    });
  };

  // Group locations by section and render
  const renderLocationsBySections = (locationList) => {
    // Group root locations by section
    const sections = {};
    const unsectioned = [];

    locationList.forEach(location => {
      if (location.section) {
        if (!sections[location.section]) {
          sections[location.section] = [];
        }
        sections[location.section].push(location);
      } else {
        unsectioned.push(location);
      }
    });

    const sectionNames = Object.keys(sections).sort();

    return (
      <>
        {/* Render sections */}
        {sectionNames.map(sectionName => (
          <div key={sectionName} className="location-section">
            <div className="section-header-bar">
              <Icon name="folder" size="sm" />
              <h3>{sectionName}</h3>
              <span className="section-count">{sections[sectionName].length} location{sections[sectionName].length !== 1 ? 's' : ''}</span>
            </div>
            <div className="section-content">
              {renderLocationTree(sections[sectionName])}
            </div>
          </div>
        ))}

        {/* Render unsectioned locations */}
        {unsectioned.length > 0 && (
          <div className="location-section">
            {sectionNames.length > 0 && (
              <div className="section-header-bar">
                <Icon name="folder" size="sm" />
                <h3>Other Locations</h3>
                <span className="section-count">{unsectioned.length} location{unsectioned.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="section-content">
              {renderLocationTree(unsectioned)}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderLocationTree = (locationList, level = 0) => {
    return locationList.map((location) => {
      const hasChildren = location.children && location.children.length > 0;
      const isExpanded = expandedLocations.has(location._id);
      

      return (
        <div 
          key={location._id} 
          className={`location-item ${!location.isActive ? 'inactive-item' : ''}`} 
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="location-header">
            <div className="location-info">
              {hasChildren && (
                <button
                  className="expand-button"
                  onClick={() => toggleExpand(location._id)}
                >
                  <Icon name={isExpanded ? "chevron-down" : "chevron-right"} size="sm" />
                </button>
              )}
              {!hasChildren && <span className="spacer" />}
              
              <div className="location-details">
                <span className="location-name">
                  {location.name}
                </span>
                <div className="location-badges">
                  <span className={`location-type type-${location.type}`}>
                    {location.typeLabel || location.type}
                  </span>
                  <span className={`visibility-status ${location.isActive ? 'active' : 'inactive'}`}>
                    {location.isActive ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>

            <div className="location-actions">
              {location.type !== "machine" && (
                <ActionButton
                  onClick={() => openAddModal(location)}
                  variant="secondary"
                  icon="add"
                  title={`Add child ${getChildType(location.type)}`}
                  disabled={isCreating || isUpdating || isDeleting}
                />
              )}
              {location.type !== "location" && (
                <ActionButton
                  onClick={() => openEditModal(location)}
                  variant="secondary"
                  icon="edit"
                  title="Edit name"
                  disabled={isCreating || isUpdating || isDeleting}
                />
              )}
              <ActionButton
                onClick={() => toggleVisibility(location, !location.isActive)}
                variant={location.isActive ? "warning" : "success"}
                icon={location.isActive ? "eye-off" : "eye"}
                title={location.isActive ? `Hide ${location.name}` : `Show ${location.name}`}
                disabled={isCreating || isUpdating || isDeleting}
              />
              <ActionButton
                onClick={() => openDeleteConfirm(location)}
                variant="danger"
                icon="delete"
                title="Delete"
                disabled={isCreating || isUpdating || isDeleting}
              />
            </div>
          </div>

          {hasChildren && isExpanded && (
            <div className="location-children">
              {renderLocationTree(location.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="location-management-page">
        <div className="loading-container">
          <Icon name="loader" size="lg" className="spinner" />
          <p>Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="location-management-page">
      <BackButton />
      
      <div className="page-header">
        <div className="header-content">
          <Icon name="map-pin" size="lg" />
          <div>
            <h1>Location Management</h1>
            <small className="help-text">
              To add items to the hierarchy, click the + button next to their parent.
            </small>
          </div>
        </div>
        <StandardButton
          onClick={() => openAddModal()}
          variant="primary"
          icon="add"
          disabled={isCreating || isUpdating || isDeleting}
        >
          Add Root Location
        </StandardButton>
      </div>

      {error && (
        <div className="alert alert-error">
          <Icon name="alert-circle" size="sm" />
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <Icon name="check-circle" size="sm" />
          {success}
        </div>
      )}

      {/* Loading overlay for operations */}
      {(isCreating || isUpdating || isDeleting) && (
        <div className="loading-overlay">
          <div className="loading-content">
            <Icon name="loader" size="lg" className="spinner" />
            <p>
              {isCreating && (creationProgress || "Creating location...")}
              {isUpdating && "Updating location..."}
              {isDeleting && "Deleting location..."}
            </p>
          </div>
        </div>
      )}

      <div className="locations-container">
        <div className="locations-header">
          <h2>Locations Hierarchy</h2>
          <p className="help-text">
            Manage your locations, lines, and machines. Click the arrows to expand/collapse.
            Use the eye buttons to hide/show items. Hidden items won't appear in CreateLOTO but will always be visible here for management.
          </p>
        </div>

        {locations.length === 0 ? (
          <div className="empty-state">
            <Icon name="map-pin" size="xl" />
            <p>No locations found. Add your first location to get started.</p>
          </div>
        ) : (
          <div className="locations-tree">
            {renderLocationsBySections(locations)}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay" onClick={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          resetForm();
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <Icon name={showEditModal ? "edit" : "plus"} size="md" />
                {showEditModal ? `Edit ${selectedLocation?.type === 'line' ? 'Line' : 'Machine'} Name` : "Add New Location"}
              </h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                <Icon name="x" size="md" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Context-aware form */}
              {!showEditModal && (
                <>
                  {/* Show context info */}
                  {addContext && (
                    <div className="form-info" style={{ 
                      padding: '12px', 
                      background: '#f0f7ff', 
                      borderRadius: '8px', 
                      marginBottom: '16px',
                      border: '1px solid #b3d9ff'
                    }}>
                      <small style={{ color: '#0066cc', fontWeight: '500' }}>
                        {addContext.parentType === 'location' && 
                          `Adding to Location: ${addContext.parent.name}`}
                        {addContext.parentType === 'line' && 
                          `Adding to Line: ${addContext.parent.name}`}
                      </small>
                    </div>
                  )}

                  {/* Location Name - Always show, read-only if context exists */}
                  <div className="form-group">
                    <label>Location Name *</label>
                    <input
                      type="text"
                      value={formData.locationName || ""}
                      onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                      placeholder="e.g., PKG, Process, Utility"
                      readOnly={addContext !== null}
                      style={addContext ? { backgroundColor: '#f5f5f5' } : {}}
                    />
                  </div>

                  {/* Line Name - Show if no context OR adding to location */}
                  {(!addContext || addContext.parentType === 'location') && (
                    <div className="form-group">
                      <label>
                        Line Name {addContext?.parentType === 'location' ? '*' : ''}
                      </label>
                      <input
                        type="text"
                        value={formData.lineName || ""}
                        onChange={(e) => setFormData({ ...formData, lineName: e.target.value })}
                        placeholder="e.g., A, B, C"
                        required={addContext?.parentType === 'location'}
                        readOnly={addContext?.parentType === 'line'}
                        style={addContext?.parentType === 'line' ? { backgroundColor: '#f5f5f5' } : {}}
                      />
                      {addContext?.parentType === 'location' && (
                        <small className="help-text">
                          You can add multiple machines below (optional)
                        </small>
                      )}
                    </div>
                  )}

                  {/* Machine Names - Show if line name is filled */}
                  {(formData.lineName || addContext?.parentType === 'line') && (
                    <div className="form-group">
                      <label>
                        Machine Name(s) {addContext?.parentType === 'line' ? '*' : ''}
                      </label>
                      <textarea
                        value={formData.machineName || ""}
                        onChange={(e) => setFormData({ ...formData, machineName: e.target.value })}
                        placeholder="Enter machine names (one per line):&#10;DA01&#10;DA02&#10;DA03"
                        rows="5"
                        required={addContext?.parentType === 'line'}
                        style={{ 
                          fontFamily: 'monospace',
                          resize: 'vertical'
                        }}
                      />
                      <small className="help-text">
                        Enter one machine name per line. You can add multiple machines at once.
                      </small>
                    </div>
                  )}
                </>
              )}

              {/* Edit mode - show existing name */}
              {showEditModal && (
                <>
                  <div style={{ 
                    background: '#f0f9ff', 
                    border: '1px solid #0ea5e9', 
                    borderRadius: '8px', 
                    padding: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <small style={{ color: '#0369a1', fontSize: '0.875rem' }}>
                      <strong>Note:</strong> Editing the name will update it everywhere, including in CreateLOTO dropdowns.
                    </small>
                  </div>
                  
                  <div className="form-group">
                    <label>New Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setFormData({ 
                          ...formData, 
                          name: newName,
                          code: newName.toUpperCase().replace(/[^A-Z0-9]/g, '-')
                        });
                      }}
                      required
                      placeholder={`Enter new ${selectedLocation?.type} name`}
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label>Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                      placeholder="Auto-generated, but you can customize it"
                      style={{ fontFamily: 'monospace' }}
                    />
                    <small className="help-text">
                      This code is used in the system and should be unique.
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Custom Type Label (Optional)</label>
                    <input
                      type="text"
                      value={formData.typeLabel}
                      onChange={(e) => setFormData({ ...formData, typeLabel: e.target.value })}
                      placeholder={`e.g., "Department", "Section", "Equipment" (leave empty for default "${selectedLocation?.type}")`}
                    />
                    <small className="help-text">
                      Change how this level appears (e.g., "Department" instead of "line"). Leave empty to use default "{selectedLocation?.type}".
                    </small>
                  </div>

                  {/* Section field - only for root locations */}
                  {selectedLocation?.type === 'location' && (
                    <div className="form-group">
                      <label>Section/Category (Optional)</label>
                      <input
                        type="text"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        placeholder="e.g., Production Lines, Utilities, Warehouses"
                      />
                      <small className="help-text">
                        Group similar locations together for better organization. Leave empty for no grouping.
                      </small>
                    </div>
                  )}
                </>
              )}

              <div className="modal-actions">
                <StandardButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  disabled={isCreating || isUpdating}
                >
                  Cancel
                </StandardButton>
                <StandardButton 
                  type="submit" 
                  variant="primary"
                  disabled={isCreating || isUpdating}
                >
                  {isCreating && "Creating..."}
                  {isUpdating && "Updating..."}
                  {!isCreating && !isUpdating && (showEditModal ? "Update" : "Create")}
                </StandardButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedLocation && (
        <div className="modal-overlay" onClick={() => {
          setShowDeleteConfirm(false);
          setDeleteConfirmName("");
        }}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <Icon name="alert-triangle" size="md" />
                Confirm Delete
              </h2>
            </div>

            <div className="modal-body">
              {selectedLocation.children && selectedLocation.children.length > 0 ? (
                <>
                  <p style={{ marginBottom: '1rem' }}>
                    <strong>⚠️ Warning:</strong> You are about to delete <strong>{selectedLocation.name}</strong> which has <strong>{selectedLocation.children.length} {selectedLocation.children.length === 1 ? 'child' : 'children'}</strong>.
                  </p>
                  <div style={{ 
                    background: '#fef2f2', 
                    border: '2px solid #fca5a5', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ color: '#991b1b', fontWeight: 600, marginBottom: '0.5rem' }}>
                      This will permanently delete:
                    </p>
                    <ul style={{ color: '#991b1b', marginLeft: '1.5rem', marginBottom: '0.5rem' }}>
                      <li><strong>{selectedLocation.name}</strong> ({selectedLocation.type})</li>
                      <li>All <strong>{selectedLocation.children.length}</strong> child items under it</li>
                      <li>Any nested children within those items</li>
                    </ul>
                    <p style={{ color: '#991b1b', fontSize: '0.875rem', fontWeight: 600 }}>
                      ⚠️ This action cannot be undone!
                    </p>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                      Type <span style={{ color: '#dc2626', fontFamily: 'monospace', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>{selectedLocation.name}</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmName}
                      onChange={(e) => setDeleteConfirmName(e.target.value)}
                      placeholder={`Type "${selectedLocation.name}" to confirm`}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '2px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontFamily: 'monospace'
                      }}
                    />
                    {deleteConfirmName && deleteConfirmName !== selectedLocation.name && (
                      <small style={{ color: '#dc2626', display: 'block', marginTop: '0.25rem' }}>
                        Name doesn't match. Please type exactly: {selectedLocation.name}
                      </small>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Are you sure you want to delete <strong>{selectedLocation.name}</strong>?
                  </p>
                  <p className="warning-text">
                    This action cannot be undone.
                  </p>
                </>
              )}
            </div>

            <div className="modal-actions">
              <StandardButton
                variant="secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmName("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </StandardButton>
              <StandardButton
                variant="danger"
                onClick={handleDelete}
                disabled={
                  isDeleting || 
                  (selectedLocation.children && selectedLocation.children.length > 0 && deleteConfirmName !== selectedLocation.name)
                }
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </StandardButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManagement;

