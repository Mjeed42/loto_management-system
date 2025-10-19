import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ActionButton from "../components/ActionButton";
import StandardButton from "../components/StandardButton";

const AdminHome = () => {
  const { t, i18n } = useTranslation();
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
    lastLogin: null,
  });
  const [userSearchTerm, setUserSearchTerm] = useState(""); // New search state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
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

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [userSearchTerm]);

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
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError(err.response?.data?.message || "Error fetching admin data");
      setUsers([]);
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


  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onUserSearchChange = (e) => {
    setUserSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setUserSearchTerm("");
  };

  // Ensure users are always arrays before mapping
  const safeUsers = Array.isArray(users) ? users : [];

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { text: t('admin.admin'), variant: "danger" },
      supervisor: { text: t('admin.supervisor'), variant: "primary" },
      technician: { text: t('admin.technician'), variant: "success" },
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
        {isActive ? t('admin.active') : t('admin.inactive')}
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
                ⚙️ {t('admin.pageTitle')}
              </h1>
              <p className="cf-header-subtitle">{t('admin.pageSubtitle')}</p>
            </div>
            <div className="cf-header-actions">
              <ActionButton
                variant="secondary"
                onClick={() => setShowCreateForm(!showCreateForm)}
                icon={showCreateForm ? "cancel" : "add"}
              >
                {showCreateForm ? t('admin.cancel') : t('admin.createUser')}
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={fetchHomeData}
                icon="refresh"
              >
                {t('admin.refresh')}
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={() => navigate("/Home")}
                icon="home"
              >
                {t('admin.home')}
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
              ➕ {t('admin.createNewUser')}
            </h5>
          </div>
          <div className="cf-card-body">
            <form onSubmit={handleCreateUser}>
              <div className="cf-grid cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-4 cf-mb-4">
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">{t('admin.username')}</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder={t('admin.enterUsername')}
                    required
                  />
                </div>
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">{t('admin.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder={t('admin.enterEmail')}
                    required
                  />
                </div>
              </div>

              <div className="cf-grid cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-4 cf-mb-4">
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">{t('admin.password')}</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder={t('admin.enterPassword')}
                    required
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">{t('admin.role')}</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={onChange}
                    className="cf-form-select"
                  >
                    <option value="technician">{t('admin.technician')}</option>
                    <option value="supervisor">{t('admin.supervisor')}</option>
                    <option value="admin">{t('admin.admin')}</option>
                  </select>
                </div>
              </div>

              <div className="cf-grid cf-grid-cols-1 md:cf-grid-cols-2 cf-gap-4 cf-mb-4">
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">{t('admin.firstName')}</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder={t('admin.enterFirstName')}
                    required
                  />
                </div>
                <div>
                  <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">{t('admin.lastName')}</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onChange}
                    className="cf-form-select"
                    placeholder={t('admin.enterLastName')}
                    required
                  />
                </div>
              </div>

              <div className="cf-mb-4">
                <label className="cf-text-sm cf-font-semibold cf-text-primary cf-mb-2">{t('admin.employeeId')}</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={onChange}
                  className="cf-form-select"
                  placeholder={t('admin.enterEmployeeId')}
                />
              </div>

              <div className="cf-d-flex cf-gap-2">
                <StandardButton type="submit" variant="primary" icon="save">
                  {t('admin.createUser')}
                </StandardButton>
                <StandardButton
                  type="button"
                  variant="outline"
                  icon="cancel"
                  onClick={() => setShowCreateForm(false)}
                >
                  {t('admin.cancel')}
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
            👥 {t('admin.userManagement')}
          </h5>
        </div>
        <div className="cf-card-body">
          <div className="cf-d-flex cf-justify-content-between cf-align-items-center cf-mb-4">
            <div style={{ maxWidth: "300px" }}>
              <input
                type="text"
                className="cf-form-select"
                placeholder={t('admin.searchUsers')}
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
                  {t('admin.clear')}
                </StandardButton>
              )}
            </div>
            <ActionButton 
              variant="secondary"
              icon="refresh"
              onClick={fetchHomeData}
            >
              {t('admin.refreshUsers')}
            </ActionButton>
          </div>

          <div className="cf-table-container" style={{ overflowX: 'auto', width: '100%' }}>
            <table className="cf-table">
              <thead>
                <tr>
                  <th>{t('admin.name')}</th>
                  <th>{t('admin.username')}</th>
                  <th className="cf-d-none cf-d-md-table-cell">{t('admin.email')}</th>
                  <th>{t('admin.role')}</th>
                  <th>{t('admin.status')}</th>
                  <th>{t('admin.employeeId')}</th>
                  <th>{t('admin.lastLogin')}</th>
                  <th className="cf-text-center">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
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
                            title={t('admin.resetPassword')}
                          >
                            🔑 {t('admin.resetPassword')}
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
                              user.isActive ? t('admin.disableUser') : t('admin.enableUser')
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
                              title={t('admin.deleteUser')}
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
                          🔍 {t('admin.noUsersMatch')}
                        </>
                      ) : (
                        <>
                          ℹ️ {t('admin.noUsersFound')}
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredUsers.length > usersPerPage && (
            <div className="cf-d-flex cf-justify-content-center cf-align-items-center cf-mt-4 cf-gap-2">
              <button
                className="cf-btn cf-btn-sm cf-btn-outline-secondary"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                {i18n.language === 'ar' ? '→' : '←'} {t('admin.previous')}
              </button>
              
              <div className="cf-d-flex cf-gap-1">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`cf-btn cf-btn-sm ${
                      currentPage === index + 1
                        ? 'cf-btn-primary'
                        : 'cf-btn-outline-secondary'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                className="cf-btn cf-btn-sm cf-btn-outline-secondary"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                {t('admin.next')} {i18n.language === 'ar' ? '←' : '→'}
              </button>
            </div>
          )}

          {/* Show current page info */}
          {filteredUsers.length > 0 && (
            <div className="cf-text-center cf-mt-3" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {t('admin.showing')} {indexOfFirstUser + 1} {t('admin.to')} {Math.min(indexOfLastUser, filteredUsers.length)} {t('admin.of')} {filteredUsers.length} {t('admin.users')}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default AdminHome;
