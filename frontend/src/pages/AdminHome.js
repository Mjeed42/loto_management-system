import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

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
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 className="d-flex align-items-center gap-2">
          <Icon name="settings" /> Admin Page
        </h1>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Icon name="add" /> {showCreateForm ? "Cancel" : "Create User"}
          </Button>

          <Button variant="outline-secondary" onClick={fetchHomeData}>
            <Icon name="refresh" /> Refresh
          </Button>
          <Button variant="outline-success" onClick={() => navigate("/data-export")}>
            <Icon name="download" /> Data Export
          </Button>
          <Button variant="outline-primary" onClick={() => navigate("/Home")}>
            <Icon name="Home" /> Home
          </Button>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger">
          <Icon name="warning" className="me-2" /> {error}
        </div>
      )}
      {/* Create User Form */}
      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <Icon name="add" /> Create New User
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateUser}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={onChange}
                      className="form-control"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      className="form-control"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      className="form-control"
                      placeholder="Enter password"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={onChange}
                      className="form-control"
                    >
                      <option value="technician">Technician</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={onChange}
                      className="form-control"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={onChange}
                      className="form-control"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Enter employee ID"
                />
              </div>

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">
                  <Icon name="save" /> Create User
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  <Icon name="cancel" /> Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* User Management */}
      <div className="card mb-4">
        <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <Icon name="users" /> User Management
          </h5>
          <div className="toolbar d-flex flex-wrap gap-2 justify-content-center">
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={userSearchTerm}
                onChange={onUserSearchChange}
              />
              {userSearchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={clearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            <Button variant="outline-primary" onClick={fetchHomeData}>
              <Icon name="refresh" /> Refresh Users
            </Button>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-wrapper">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th className="d-none d-md-table-cell">Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Employee ID</th>
                  <th>Last Login</th>
                  <th>Actions</th>
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
                      <td className="d-none d-md-table-cell">{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.isActive)}</td>
                      <td>{user.employeeId || "N/A"}</td>
                      <td>{formatDate(user.lastLogin)}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              handleResetPassword(user._id, user.username)
                            }
                            title="Reset Password"
                          >
                            <Icon name="key" /> Reset Password
                          </Button>
                          <Button
                            variant={
                              user.isActive
                                ? "outline-warning"
                                : "outline-success"
                            }
                            size="sm"
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
                          </Button>
                          {user.role !== "admin" && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleDeleteUser(user._id, user.username)
                              }
                              title="Delete User"
                            >
                              <Icon name="delete" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      {userSearchTerm ? (
                        <>
                          <Icon name="search" /> No users match your search
                        </>
                      ) : (
                        <>
                          <Icon name="info" /> No users found
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
      <div className="card">
        <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <Icon name="list" /> LOTO Management
          </h5>
          <Button variant="outline-primary" onClick={fetchHomeData}>
            <Icon name="refresh" /> Refresh LOTOs
          </Button>
        </div>
        <div className="card-body p-0">
          <div className="table-wrapper">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Date</th>
                  <th>Shift</th>
                  <th className="d-none d-md-table-cell">Isolator</th>
                  <th>Part</th>
                  <th className="d-none d-lg-table-cell">Reason</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Actions</th>
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
                      <td className="d-none d-md-table-cell">
                        {loto.isolator?.firstName} {loto.isolator?.lastName}
                      </td>
                      <td>{loto.isolatedPart}</td>
                      <td className="d-none d-lg-table-cell">{loto.reason}</td>
                      <td>{getLotoStatusBadge(loto.status)}</td>
                      <td>{loto.expectedDuration} hrs</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {loto.status === "pending" && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                handleVerifyLoto(loto._id, loto.serialNumber)
                              }
                              title="Verify LOTO"
                            >
                              <Icon name="check" />
                            </Button>
                          )}
                          {(loto.status === "active" ||
                            loto.status === "handover") && (
                            <>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() =>
                                  handleHandoverLoto(
                                    loto._id,
                                    loto.serialNumber
                                  )
                                }
                                title="Handover LOTO"
                              >
                                <Icon name="handover" />
                              </Button>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  handleCompleteLoto(
                                    loto._id,
                                    loto.serialNumber
                                  )
                                }
                                title="Complete LOTO"
                              >
                                <Icon name="check" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleDeleteLoto(loto._id, loto.serialNumber)
                            }
                            title="Delete LOTO"
                          >
                            <Icon name="delete" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <Icon name="info" /> No LOTOs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
