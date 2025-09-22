import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Try to fetch current user to verify token validity
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        "https://loto-backend-643788243736.europe-west1.run.app/api/auth/me",
        config
      );

      // If successful, redirect to appropriate Home
      if (onLogin) {
        onLogin();
      }

      // Redirect based on role
      switch (res.data.user.role) {
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/Home");
          break;
      }
    } catch (err) {
      // If token is invalid, remove it and stay on login page
      localStorage.removeItem("token");
    }
  };

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://loto-backend-643788243736.europe-west1.run.app/api/auth/login",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      if (onLogin) {
        onLogin();
      }

      // Redirect based on role
      switch (res.data.user.role) {
        case "admin":
          navigate("/loto-list");
          break;
        case "supervisor":
          navigate("/loto-list");
          break;
        case "technician":
          navigate("/Home");
          break;
        default:
          navigate("/Home");
          break;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg">
          <div className="card-header text-center">
            <h2>🔒 LOTO Management System</h2>
            <p className="text-muted mb-0">Secure Lockout/Tagout Management</p>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit}>
              <div className="form-group mb-3">
                <label className="form-label">Username or Email</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Enter username or email"
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  className="form-control"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
