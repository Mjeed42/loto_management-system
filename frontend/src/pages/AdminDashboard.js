import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    employeeId: "",
    role: "technician",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "Fetching users with token:",
        token ? "Token exists" : "No token"
      );

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/admin/users",
        config
      );
      console.log("Users API response:", res.data);

      // Handle different possible response formats
      let usersData = [];
      if (res.data.users) {
        usersData = res.data.users;
      } else if (res.data.data && res.data.data.users) {
        usersData = res.data.data.users;
      } else if (Array.isArray(res.data.data)) {
        usersData = res.data.data;
      }

      // Ensure it's always an array
      usersData = Array.isArray(usersData) ? usersData : [];

      setUsers(usersData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || "Error fetching users");
      setUsers([]);
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
      fetchUsers();
    } catch (err) {
      console.error("Create user error:", err);
      alert(err.response?.data?.message || "Error creating user");
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

      console.log("Sending reset password request for user:", userId);
      const response = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/admin/users/${userId}/reset-password`,
        { newPassword },
        config
      );

      console.log("Password reset response:", response);
      alert("Password reset successfully!");
    } catch (err) {
      console.error("Password reset error:", err);
      console.error("Error response:", err.response);
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

      console.log("Sending toggle status request for user:", userId);
      const response = await axios.put(
        `https://loto-backend-643788243736.europe-west1.run.app/api/admin/users/${userId}/toggle-status`,
        {},
        config
      );

      console.log("Toggle status response:", response);
      alert(`User ${username} ${action}d successfully!`);
      fetchUsers();
    } catch (err) {
      console.error("Toggle status error:", err);
      console.error("Error response:", err.response);
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

      console.log("Sending delete request for user:", userId);
      const response = await axios.delete(
        `https://loto-backend-643788243736.europe-west1.run.app/api/admin/users/${userId}`,
        config
      );

      console.log("Delete user response:", response);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      console.error("Error response:", err.response);
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ensure users is always an array before mapping
  const safeUsers = Array.isArray(users) ? users : [];

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { text: "Admin", variant: "danger" },
      manager: { text: "Manager", variant: "primary" },
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Cancel" : "Create User"}
          </button>
          <button className="btn btn-outline-secondary" onClick={fetchUsers}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">Error: {error}</div>}

      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Create New User</h5>
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
                      <option value="manager">Manager</option>
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
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">User Management</h5>
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
                      <td>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              handleResetPassword(user._id, user.username)
                            }
                            title="Reset Password"
                            style={{ minWidth: "36px" }}
                          >
                            🔑
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${
                              user.isActive
                                ? "btn-outline-warning"
                                : "btn-outline-success"
                            }`}
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
                          </button>
                          {user.role !== "admin" && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                handleDeleteUser(user._id, user.username)
                              }
                              title="Delete User"
                              style={{ minWidth: "36px" }}
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
                    <td colSpan="7" className="text-center py-4">
                      No users found
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
