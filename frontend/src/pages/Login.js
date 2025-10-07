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
        API_ENDPOINTS.ME,
        config
      );

      // If successful, redirect to appropriate Home
      if (onLogin) {
        onLogin();
      }

      // Redirect based on user role
      const userRole = res.data.user?.role;
      if (userRole === "technician") {
        navigate("/technician-home");
      } else {
        navigate("/Home");
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
        API_ENDPOINTS.LOGIN,
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      if (onLogin) {
        onLogin();
      }

      // Redirect based on user role
      const userRole = res.data.user?.role;
      if (userRole === "technician") {
        navigate("/technician-home");
      } else {
        navigate("/Home");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section - PepsiCo Logo */}
      <div className="login-left">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/PepsiCo_logo.svg/1024px-PepsiCo_logo.svg.png"
          alt="PepsiCo Logo"
          style={{
            width: '66.666667%',
            maxWidth: '28rem',
            filter: 'drop-shadow(0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04))'
          }}
        />
      </div>

      {/* Right Section - Login Form */}
      <div className="login-right">
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#1e3a8a',
          marginBottom: '1.5rem',
          textAlign: 'center',
          margin: '0 0 1.5rem 0'
        }}>
          LOTO Management System
        </h2>
        

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="login-form">
          <div>
            <label>
              Username or Email
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              placeholder="Enter username or email"
              required
            />
          </div>

          <div>
            <label>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg 
                  style={{
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.75rem',
                    width: '1.25rem',
                    height: '1.25rem'
                  }}
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    style={{ opacity: 0.25 }} 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    style={{ opacity: 0.75 }} 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .login-container {
          display: flex;
          height: 100vh;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        }
        
        .login-left {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
        }
        
        .login-right {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(90deg,rgba(251, 85, 85, 0.79) 0%, rgb(255, 106, 106) 44%, rgba(255, 0, 0, 0.87) 100%);
  padding-left: 3rem;
  padding-right: 3rem;
  border-radius: 20px 20px 20px  20px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
  border-left: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
}



          @media (max-width: 768px) {
  .login-right {
    width: 100% !important;
    height: 60vh !important;
    padding: 2rem !important;
    background:linear-gradient(90deg,rgba(251, 85, 85, 0.79) 0%, rgb(255, 106, 106) 44%, rgba(255, 0, 0, 0.87) 100%);
    border-radius: 1.25rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  .login-right:hover {
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

        
        .login-form input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease-in-out;
        }
        
        .login-form input:focus {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.1);
        }
        
        .login-form button {
          width: 100%;
          background-color: #1d4ed8;
          color: #ffffff;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .login-form button:hover:not(:disabled) {
          background-color: #1e40af;
        }
        
        .login-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .login-form > div {
          margin-bottom: 1.25rem;
        }
        
        .login-form label {
          display: block;
          color: #374151;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column !important;
          }
          .login-left {
            width: 100% !important;
            height: 40vh !important;
          }
          .login-right {
            width: 100% !important;
            height: 60vh !important;
            padding: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;