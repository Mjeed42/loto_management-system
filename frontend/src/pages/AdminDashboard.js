import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";

const AdminDashboard = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Error fetching dashboard data");
      setUsers([]);
      setLotos([]);
      setLoading(false);
    }
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
      });
      fetchDashboardData();
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
      fetchDashboardData();
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
      fetchDashboardData();
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
      fetchDashboardData();
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
      fetchDashboardData();
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
      fetchDashboardData();
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
      fetchDashboardData();
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
      fetchDashboardData();
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
      fetchDashboardData();
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

  // Ensure users and lotos are always arrays before mapping
  const safeUsers = Array.isArray(users) ? users : [];
  const safeLotos = Array.isArray(lotos) ? lotos : [];

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { text: "Admin", variant: "danger" },
      manager: { text: "Manager", variant: "primary" },
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
        <p className="mt-2">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <Icon name="settings" /> Admin Dashboard
        </h1>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Icon name="add" /> {showCreateForm ? "Cancel" : "Create User"}
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => setShowCreateLotoForm(!showCreateLotoForm)}
          >
            <Icon name="add" /> {showCreateLotoForm ? "Cancel" : "Create LOTO"}
          </Button>
          <Button variant="outline-secondary" onClick={fetchDashboardData}>
            <Icon name="refresh" /> Refresh
          </Button>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/dashboard")}
          >
            <Icon name="dashboard" /> Dashboard
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <Icon name="warning" className="me-2" /> {error}
        </div>
      )}

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
                      <option value="manager">Manager</option>
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

      {showCreateLotoForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <Icon name="add" /> Create New LOTO
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateLoto}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Shift</label>
                    <select
                      name="shift"
                      value={lotoFormData.shift}
                      onChange={onLotoChange}
                      className="form-control"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Expected Duration (hours)
                    </label>
                    <input
                      type="number"
                      name="expectedDuration"
                      value={lotoFormData.expectedDuration}
                      onChange={onLotoChange}
                      placeholder="Enter duration in hours"
                      step="0.5"
                      min="0.5"
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Location</label>
                <select
                  name="location"
                  value={lotoFormData.location}
                  onChange={onLotoChange}
                  className="form-control"
                >
                  <option value="Processing">Processing</option>
                  <option value="PKG">PKG</option>
                  <option value="Process">Process</option>
                  <option value="Utility">Utility</option>
                  <option value="WH-FG">WH-FG</option>
                  <option value="WH-RM">WH-RM</option>
                  <option value="Project">Project</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Isolated Part</label>
                <input
                  type="text"
                  name="isolatedPart"
                  value={lotoFormData.isolatedPart}
                  onChange={onLotoChange}
                  placeholder="Enter part description"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={lotoFormData.reason}
                  onChange={onLotoChange}
                  placeholder="Enter reason"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">PTW Number</label>
                <input
                  type="text"
                  name="ptwNumber"
                  value={lotoFormData.ptwNumber}
                  onChange={onLotoChange}
                  placeholder="Enter PTW number or N/A"
                  className="form-control"
                />
              </div>

              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">
                  <Icon name="save" /> Create LOTO
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowCreateLotoForm(false)}
                >
                  <Icon name="cancel" /> Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Management Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <Icon name="users" /> User Management
          </h5>
          <Button variant="outline-primary" onClick={fetchDashboardData}>
            <Icon name="refresh" /> Refresh Users
          </Button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Employee ID</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeUsers.length > 0 ? (
                  safeUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.isActive)}</td>
                      <td>{user.employeeId || "N/A"}</td>
                      <td>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              handleResetPassword(user._id, user.username)
                            }
                            title="Reset Password"
                            style={{ minWidth: "36px" }}
                          >
                            <Icon name="key" /> Reset
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
                            style={{ minWidth: "36px" }}
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
                              style={{ minWidth: "36px" }}
                            >
                              <Icon name="delete" /> Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <Icon name="info" /> No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LOTO Management Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <Icon name="list" /> LOTO Management
          </h5>
          <Button variant="outline-primary" onClick={fetchDashboardData}>
            <Icon name="refresh" /> Refresh LOTOs
          </Button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Date</th>
                  <th>Shift</th>
                  <th>Isolator</th>
                  <th>Part</th>
                  <th>Reason</th>
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
                      <td>{new Date(loto.date).toLocaleDateString()}</td>
                      <td>{loto.shift}</td>
                      <td>
                        {loto.isolator?.firstName} {loto.isolator?.lastName}
                      </td>
                      <td>{loto.isolatedPart}</td>
                      <td>{loto.reason}</td>
                      <td>{getLotoStatusBadge(loto.status)}</td>
                      <td>{loto.expectedDuration} hrs</td>
                      <td>
                        <div className="btn-group" role="group">
                          {loto.status === "pending" && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                handleVerifyLoto(loto._id, loto.serialNumber)
                              }
                              title="Verify LOTO"
                              style={{ minWidth: "36px" }}
                            >
                              <Icon name="check" /> Verify
                            </Button>
                          )}

                          {(loto.status === "active" ||
                            loto.status === "handover") && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  handleUpdateLoto(loto._id, loto.serialNumber)
                                }
                                title="Update LOTO"
                                style={{ minWidth: "36px" }}
                              >
                                <Icon name="edit" /> Update
                              </Button>
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
                                style={{ minWidth: "36px" }}
                              >
                                <Icon name="handover" /> Handover
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
                                style={{ minWidth: "36px" }}
                              >
                                <Icon name="check" /> Complete
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
                            style={{ minWidth: "36px" }}
                          >
                            <Icon name="delete" /> Delete
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

export default AdminDashboard;
