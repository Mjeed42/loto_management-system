import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { t, i18n } = useTranslation();
  const { login, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.role;
      navigate(userRole === "technician" ? "/technician-home" : "/Home");
    }
  }, [isAuthenticated, user, navigate]);

  const { username, password, rememberMe } = formData;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    // Update document direction for RTL/LTR
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(username, password, rememberMe);
      
      if (result.success) {
        const userRole = result.user.role;
        navigate(userRole === "technician" ? "/technician-home" : "/Home");
      } else {
        setError(result.message || "Login failed");
      }
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
          <label>{i18n.language === 'ar' ? 'اسم المستخدم أو البريد الإلكتروني' : 'Username or Email'}</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
            placeholder={i18n.language === 'ar' ? 'أدخل اسم المستخدم أو البريد الإلكتروني' : 'Enter username or email'}
          />

          <label>{i18n.language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder={i18n.language === 'ar' ? 'أدخل كلمة المرور' : 'Enter password'}
          />

          <div className="remember-me-container" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '1rem',
            gap: '0.5rem'
          }}>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={onChange}
              style={{ 
                width: 'auto',
                margin: 0,
                cursor: 'pointer'
              }}
            />
            <label 
              htmlFor="rememberMe" 
              style={{ 
                margin: 0,
                cursor: 'pointer',
                fontWeight: 'normal',
                fontSize: '0.9rem'
              }}
            >
              {i18n.language === 'ar' ? 'تذكرني' : 'Remember Me'}
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (i18n.language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...') : t('common.login')}
          </button>
        </form>

        {/* Language Toggle */}
        <button 
          type="button"
          onClick={toggleLanguage}
          style={{
            marginTop: '1rem',
            padding: '0.65rem',
            background: 'transparent',
            border: '2px solid #e5e7eb',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: '#374151',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#0033a0';
            e.target.style.background = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.background = 'transparent';
          }}
        >
          🌐 {i18n.language === 'en' ? 'العربية' : 'English'}
        </button>

       
      </div>
      
    </div>
  );
};

export default Login;
