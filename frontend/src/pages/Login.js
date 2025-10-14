import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../config/api";

const Login = ({ onLogin }) => {
  const { t, i18n } = useTranslation();
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

    <button type="submit" disabled={loading}>
      {loading ? (i18n.language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...') : t('common.login')}
    </button>
  </form>

  {/* Language Toggle */}
  <div className="language-toggle-container">
    <div className="language-toggle-label">
      {t('language.selectLanguage')}
    </div>
    <button 
      type="button" 
      className="language-toggle-button"
      onClick={toggleLanguage}
    >
      <span className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}>
        🇬🇧 English
      </span>
      <span className="language-divider">|</span>
      <span className={`language-option ${i18n.language === 'ar' ? 'active' : ''}`}>
        🇸🇦 العربية
      </span>
    </button>
  </div>
</div>


    </div>
  );
};

export default Login;
