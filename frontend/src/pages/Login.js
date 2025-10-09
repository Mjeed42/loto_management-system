import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onLogin) onLogin();
      const userRole = res.data.user?.role;
      navigate(userRole === "technician" ? "/technician-home" : "/Home");
    } catch {
      localStorage.removeItem("token");
    }
  };

  const { username, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(API_ENDPOINTS.LOGIN, { username, password });
      localStorage.setItem("token", res.data.token);
      if (onLogin) onLogin();
      const userRole = res.data.user?.role;
      navigate(userRole === "technician" ? "/technician-home" : "/Home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/PepsiCo_logo.svg/1024px-PepsiCo_logo.svg.png"
    alt="PepsiCo Logo"
    className="logo"
  />

  <h3 className="subtitle">LOTO Management System</h3>

  {error && <div className="error-box">{error}</div>}

  <form onSubmit={onSubmit} className="form">
    <label>Username or Email</label>
    <input
      type="text"
      name="username"
      value={username}
      onChange={onChange}
      required
      placeholder="Enter username or email"
    />

    <label>Password</label>
    <input
      type="password"
      name="password"
      value={password}
      onChange={onChange}
      required
      placeholder="Enter password"
    />

    <button type="submit" disabled={loading}>
      {loading ? "Logging in..." : "Login"}
    </button>
  </form>
</div>


    </div>
  );
};

export default Login;
