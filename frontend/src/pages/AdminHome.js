import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import RejectLOTOModal from "../components/RejectLOTOModal";
import ActionButton from "../components/ActionButton";
import StandardButton from "../components/StandardButton";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [lotos, setLotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateLotoForm, setShowCreateLotoForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    employeeId: "",
    role: "technician",
    lastLogin: null,
  });
  const [lotoFormData, setLotoFormData] = useState({
    shift: "A",
    location: "Processing",
    isolatedPart: "",
    reason: "",
    ptwNumber: "N/A",
    expectedDuration: "",
    supervisor: "",
  });
  const [userSearchTerm, setUserSearchTerm] = useState(""); // New search state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedLotoForRejection, setSelectedLotoForRejection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  // Memoized filtered users for performance
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return users;

    const term = userSearchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        (user.employeeId && user.employeeId.toLowerCase().includes(term))
    );
  }, [users, userSearchTerm]);

  const fetchHomeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch users
      const usersRes = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/admin/users",
        config
      );

      // Handle different possible response formats
      let usersData = [];
      if (usersRes.data.users) {
        usersData = usersRes.data.users;
      } else if (usersRes.data.data && usersRes.data.data.users) {
        usersData = usersRes.data.data.users;
      } else if (Array.isArray(usersRes.data.data)) {
        usersData = usersRes.data.data;
      }

      // Ensure it's always an array
      usersData = Array.isArray(usersData) ? usersData : [];

      setUsers(usersData);

      // Fetch LOTOs
      const lotosRes = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
        config
      );

      // Handle different possible response formats
      let lotosData = [];
      if (lotosRes.data.lotos) {
        lotosData = lotosRes.data.lotos;
      } else if (lotosRes.data.data && lotosRes.data.data.lotos) {
        lotosData = lotosRes.data.data.lotos;
      } else if (Array.isArray(lotosRes.data.data)) {
        lotosData = lotosRes.data.data;
      }

      // Ensure it's always an array
      lotosData = Array.isArray(lotosData) ? lotosData : [];

      setLotos(lotosData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Home data:", err);
      setError(err.response?.data?.message || "Error fetching Home data");
      setUsers([]);
      setLotos([]);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        "https://loto-backend-643788243736.europe-west1.run.app/api/admin/users",
        formData,
        config
      );

      alert("User created successfully!");
      setShowCreateForm(false);
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        employeeId: "",
        role: "technician",
        lastLogin: null,
      });
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  const handleCreateLoto = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.post(
        "https://loto-backend-643788243736.europe-west1.run.app/api/loto",
        lotoFormData,
        config
      );

      alert(
        `LOTO created successfully!\nSerial Number: ${res.data.data.serialNumber}`
      );
      setShowCreateLotoForm(false);
      setLotoFormData({
        shift: "A",
        location: "Processing",
        isolatedPart: "",
        reason: "",
        ptwNumber: "N/A",
        expectedDuration: "",
        supervisor: "",
      });
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating LOTO");
    }
  };

  const handleResetPassword = async (userId, username) => {
    const newPassword = prompt(`Enter new password for user ${username}:`);
    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/admin/users/${userId}/reset-password`,
        { newPassword },
        config
      );

      alert("Password reset successfully!");
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  const handleToggleStatus = async (userId, username, isActive) => {
    const action = isActive ? "disable" : "enable";
    if (!window.confirm(`Are you sure you want to ${action} user ${username}?`))
      return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/admin/users/${userId}/toggle-status`,
        {},
        config
      );

      alert(`User ${username} ${action}d successfully!`);
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || `Error ${action}ing user`);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user ${username}? This action cannot be undone.`
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
        `https://loto-backend-643788243736.europe-west1.run.app/api/admin/users/${userId}`,
        config
      );

      alert("User deleted successfully!");
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  const handleDeleteLoto = async (lotoId, serialNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to delete LOTO ${serialNumber}? This action cannot be undone.`
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
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${lotoId}`,
        config
      );

      alert("LOTO deleted successfully!");
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting LOTO");
    }
  };

  const handleVerifyLoto = async (lotoId, serialNumber) => {
    if (
      !window.confirm(`Are you sure you want to verify LOTO ${serialNumber}?`)
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${lotoId}/verify`,
        {},
        config
      );

      alert("LOTO verified successfully!");
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Error verifying LOTO");
    }
  };

  const handleRejectLoto = (loto) => {
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
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${selectedLotoForRejection._id}/reject`,
        rejectionData,
        config
      );

      alert("LOTO rejected successfully!");
      fetchHomeData();
      setRejectModalOpen(false);
      setSelectedLotoForRejection(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting LOTO");
    }
  };

  const handleRejectModalClose = () => {
    setRejectModalOpen(false);
    setSelectedLotoForRejection(null);
  };

  const handleCompleteLoto = async (lotoId, serialNumber) => {
    if (
      !window.confirm(`Are you sure you want to complete LOTO ${serialNumber}?`)
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${lotoId}/complete`,
        { actualFinishTime: new Date(), actualFinishDate: new Date() },
        config
      );

      alert("LOTO completed successfully!");
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Error completing LOTO");
    }
  };

  const handleHandoverLoto = async (lotoId, serialNumber) => {
    const handoverTo = prompt(
      `Enter technician ID to handover LOTO ${serialNumber} to:`
    );
    if (!handoverTo) return;

    const handoverNotes = prompt("Enter handover notes (optional):");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/loto/${lotoId}/handover`,
        { handoverTo, handoverNotes },
        config
      );

      alert("LOTO handed over successfully!");
      fetchHomeData();
    } catch (err) {
      alert(err.response?.data?.message || "Error handing over LOTO");
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onLotoChange = (e) => {
    setLotoFormData({ ...lotoFormData, [e.target.name]: e.target.value });
  };

  const onUserSearchChange = (e) => {
    setUserSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setUserSearchTerm("");
  };

  // Ensure users and lotos are always arrays before mapping
  const safeUsers = Array.isArray(users) ? users : [];
  const safeLotos = Array.isArray(lotos) ? lotos : [];

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { text: "Admin", variant: "danger" },
      supervisor: { text: "Supervisor", variant: "primary" },
      technician: { text: "Technician", variant: "success" },
    };

    const config = roleConfig[role] || { text: role, variant: "secondary" };

    return (
      <span className={`badge bg-${config.variant} badge-pill`}>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`badge bg-${isActive ? "success" : "danger"} badge-pill`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const getLotoStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: "Pending", variant: "warning" },
      active: { text: "Active", variant: "success" },
      completed: { text: "Completed", variant: "secondary" },
      pending_handover: { text: "Pending Handover", variant: "info" },
      handover: { text: "Handover", variant: "info" },
      rejected: { text: "Rejected", variant: "danger" },
    };

    const config = statusConfig[status] || {
      text: status,
      variant: "secondary",
    };

    return (
      <span className={`badge bg-${config.variant} badge-pill`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading Admin Page...</p>
      </div>
    );
  }

  return (
    <div className="cf-main" style={{ overflowX: 'hidden', maxWidth: '100%' }}>
      <div className="cf-header">
        <div className="cf-header-content">
          <div className="cf-header-inner">
            <div>
              <h1 className="cf-header-title">
                ⚙️ Admin Page
              </h1>
              <p className="cf-header-subtitle">Manage users and LOTO operations</p>
            </div>
            <div className="cf-header-actions">
              <ActionButton
                variant="secondary"
                onClick={() => setShowCreateForm(!showCreateForm)}
                icon={showCreateForm ? "cancel" : "add"}
              >
                {showCreateForm ? "Cancel" : "Create User"}
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={fetchHomeData}
                icon="refresh"
              >
                Refresh
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => navigate("/monitoring")}
                icon="chart"
              >
                Monitoring
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => navigate("/data-export")}
                icon="download"
              >
                Export
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={() => navigate("/Home")}
                icon="home"
              >
                Home
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="cf-alert cf-alert-danger cf-d-flex cf-align-items-center cf-mb-4">
          <span className="cf-me-2" style={{ fontSize: "1.5rem" }}>
            ⚠️
          </span>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}
      {/* Create User Form */}
      {showCreateForm && (
        <div className="cf-card cf-mb-4">
          <div className="cf-card-header">
            <h5 className="cf-card-title">
              ➕ Create New User
            </h5>
          </div>
          <div className="cf-card-body">
            <form onSubmit={handleCreateUser}>
              <div className="cf-grid cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-4 cf-mb-4">
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>

              <div className="cf-grid cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-4 cf-mb-4">
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder="Enter password"
                    required
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={onChange}
                    className="cf-form-select"
                  >
                    <option value="technician">Technician</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="cf-grid cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-4 cf-mb-4">
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="cf-mb-4">
                <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={onChange}
                  className="cf-form-select"
                  placeholder="Enter employee ID"
                />
              </div>

              <div className="cf-d-flex cf-gap-2">
                <StandardButton type="submit" variant="primary" icon="save">
                  Create User
                </StandardButton>
                <StandardButton
                  type="button"
                  variant="outline"
                  icon="cancel"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </StandardButton>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* User Management */}
      <div className="cf-card cf-mb-4">
        <div className="cf-card-header">
          <h5 className="cf-card-title">
            👥 User Management
          </h5>
        </div>
        <div className="cf-card-body">
          <div className="cf-d-flex cf-justify-content-between cf-align-items-center cf-mb-4">
            <div style={{ maxWidth: "300px" }}>
              <input
                type="text"
                className="cf-form-select"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={onUserSearchChange}
              />
              {userSearchTerm && (
                <StandardButton
                  variant="outline"
                  icon="cancel"
                  onClick={clearSearch}
                  className="cf-mt-2"
                >
                  Clear
                </StandardButton>
              )}
            </div>
            <ActionButton 
              variant="secondary"
              icon="refresh"
              onClick={fetchHomeData}
            >
              Refresh Users
            </ActionButton>
          </div>

          <div className="cf-table-container" style={{ overflowX: 'auto', width: '100%' }}>
            <table className="cf-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th className="cf-d-none cf-d-md-table-cell">Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Employee ID</th>
                  <th>Last Login</th>
                  <th className="cf-text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.username}</td>
                      <td className="cf-d-none cf-d-md-table-cell">{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.isActive)}</td>
                      <td>{user.employeeId || "N/A"}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td className="cf-text-center">
                        <div className="cf-d-flex cf-gap-2 cf-justify-content-center">
                          <button
                            className="cf-btn cf-btn-sm cf-btn-outline-secondary"
                            onClick={() =>
                              handleResetPassword(user._id, user.username)
                            }
                            title="Reset Password"
                          >
                            🔑 Reset
                          </button>
                          <button
                            className={`cf-btn cf-btn-sm ${user.isActive ? "cf-btn-outline-secondary" : "cf-btn-outline-secondary"}`}
                            onClick={() =>
                              handleToggleStatus(
                                user._id,
                                user.username,
                                user.isActive
                              )
                            }
                            title={
                              user.isActive ? "Disable User" : "Enable User"
                            }
                          >
                            {user.isActive ? "🚫" : "✅"}
                          </button>
                          {user.role !== "admin" && (
                            <button
                              className="cf-btn cf-btn-sm cf-btn-outline-secondary"
                              onClick={() =>
                                handleDeleteUser(user._id, user.username)
                              }
                              title="Delete User"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="cf-text-center cf-py-4">
                      {userSearchTerm ? (
                        <>
                          🔍 No users match your search
                        </>
                      ) : (
                        <>
                          ℹ️ No users found
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* LOTO Management */}
      <div className="cf-card">
        <div className="cf-card-header">
          <h5 className="cf-card-title">
            📋 LOTO Management
          </h5>
        </div>
        <div className="cf-card-body">
          <div className="cf-d-flex cf-justify-content-between cf-align-items-center cf-mb-4">
            <ActionButton 
              variant="secondary"
              icon="refresh"
              onClick={fetchHomeData}
            >
              Refresh LOTOs
            </ActionButton>
          </div>
          <div className="cf-table-container" style={{ overflowX: 'auto', width: '100%' }}>
            <table className="cf-table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Date</th>
                  <th>Shift</th>
                  <th className="cf-d-none cf-d-md-table-cell">Isolator</th>
                  <th>Part</th>
                  <th className="cf-d-none cf-d-lg-table-cell">Reason</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th className="cf-text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeLotos.length > 0 ? (
                  safeLotos.map((loto) => (
                    <tr key={loto._id}>
                      <td>
                        <strong>{loto.serialNumber}</strong>
                      </td>
                      <td>{formatDate(loto.date)}</td>
                      <td>{loto.shift}</td>
                      <td className="cf-d-none cf-d-md-table-cell">
                        {loto.isolator?.firstName} {loto.isolator?.lastName}
                      </td>
                      <td>{loto.isolatedPart}</td>
                      <td className="cf-d-none cf-d-lg-table-cell">{loto.reason}</td>
                      <td>{getLotoStatusBadge(loto.status)}</td>
                      <td>{loto.expectedDuration} hrs</td>
                      <td className="cf-text-center">
                        <div className="cf-d-flex cf-gap-2 cf-justify-content-center">
                          {loto.status === "pending" && (
                            <>
                              <button
                                className="cf-btn cf-btn-sm"
                                style={{ backgroundColor: '#10b981', color: 'white' }}
                                onClick={() =>
                                  handleVerifyLoto(loto._id, loto.serialNumber)
                                }
                                title="Verify LOTO"
                              >
                                ✅
                              </button>
                              <button
                                className="cf-btn cf-btn-sm"
                                style={{ backgroundColor: '#ef4444', color: 'white' }}
                                onClick={() =>
                                  handleRejectLoto(loto)
                                }
                                title="Reject LOTO"
                              >
                                ❌
                              </button>
                            </>
                          )}
                          {(loto.status === "active" ||
                            loto.status === "handover") && (
                            <>
                              <button
                                className="cf-btn cf-btn-sm"
                                style={{ backgroundColor: '#3b82f6', color: 'white' }}
                                onClick={() =>
                                  handleHandoverLoto(
                                    loto._id,
                                    loto.serialNumber
                                  )
                                }
                                title="Handover LOTO"
                              >
                                🤝
                              </button>
                              <button
                                className="cf-btn cf-btn-sm"
                                style={{ backgroundColor: '#10b981', color: 'white' }}
                                onClick={() =>
                                  handleCompleteLoto(
                                    loto._id,
                                    loto.serialNumber
                                  )
                                }
                                title="Complete LOTO"
                              >
                                ✅
                              </button>
                            </>
                          )}
                          <button
                            className="cf-btn cf-btn-sm"
                            style={{ backgroundColor: '#ef4444', color: 'white' }}
                            onClick={() =>
                              handleDeleteLoto(loto._id, loto.serialNumber)
                            }
                            title="Delete LOTO"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="cf-text-center cf-py-4">
                      ℹ️ No LOTOs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
    </div>
  );
};

export default AdminHome;
