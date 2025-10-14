import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/cloudflare-Home.css";
import { LoadingProvider } from "./contexts/LoadingContext";

// Initialize i18n
import './i18n-simple';

// Components
import GlobalStyles from "./components/GlobalStyles";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Breadcrumb from "./components/Breadcrumb";
import QuickActions from "./components/QuickActions";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TechnicianHome from "./pages/TechnicianHome";
import CreateLOTO from "./pages/CreateLOTO";
import LOTOList from "./pages/LOTOList";
import LOTOdetail from "./pages/LOTOdetail";
import UpdateLOTO from "./pages/UpdateLOTO";
import HandoverLOTO from "./pages/HandoverLOTO";
import CompleteLOTO from "./pages/CompleteLOTO";
import Notifications from "./pages/Notifications";
import AdminHome from "./pages/AdminHome";
import DataExport from "./pages/DataExport";
import DatabaseExport from "./pages/DatabaseExport";
import TranslationTest from "./components/TranslationTest";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import LocationManagement from "./pages/LocationManagement";
import EnergyTypesManagement from "./pages/EnergyTypesManagement";


// AppContent component that has access to useLocation
const AppContent = ({ currentUser, fetchCurrentUser, isLoading }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Start collapsed (hidden) by default
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile sidebar state
  
  // Check if we're on the login page
  const isLoginPage = location.pathname === "/";
  
  // Check if user is logged in and not on login page - also check loading state
  const showSidebar = currentUser && !isLoginPage && !isLoading;

  // Redirect logged-in users from root path to appropriate home
  useEffect(() => {
    if (currentUser && location.pathname === "/") {
      if (currentUser.role === "technician") {
        window.location.href = "/technician-home";
      } else {
        window.location.href = "/Home";
      }
    }
  }, [currentUser, location.pathname]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <img 
            src="https://logos-world.net/wp-content/uploads/2022/03/Pepsico-Symbol.png"
            alt="PepsiCo Logo"
            className="loading-logo"
          />
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-layout ${!showSidebar ? 'no-sidebar' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Navigation - Only show when logged in and not on login page */}
      {showSidebar && <Sidebar currentUser={currentUser} onCollapse={setSidebarCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />}
      
      {/* Main Content Area */}
      <div className="main-content">
        {/* Header - Only show when not on login page */}
        {!isLoginPage && <Header currentUser={currentUser} onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)} />}
        
        {/* Breadcrumb - Only show when logged in and not on login page */}
        {showSidebar && <Breadcrumb currentUser={currentUser} />}
        
        <main className={`content-area ${isLoginPage ? 'login-content' : ''}`}>
          <Routes>
            <Route path="/" element={<Login onLogin={fetchCurrentUser} />} />
            <Route path="/Home" element={
              currentUser?.role === "technician" ? 
                <div>Access Denied - Technicians should use /technician-home</div> : 
                <Home />
            } />
            <Route path="/technician-home" element={<TechnicianHome currentUser={currentUser} />} />
            <Route path="/create-loto" element={<CreateLOTO />} />
            <Route path="/loto-list" element={<LOTOList />} />
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/loto/:id" element={<LOTOdetail />} />
            <Route path="/loto/:id/update" element={<UpdateLOTO />} />
            <Route path="/loto/:id/handover" element={<HandoverLOTO />} />
            <Route path="/loto/:id/complete" element={<CompleteLOTO />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/data-export" element={<DataExport />} />
            <Route path="/database-export" element={
              currentUser?.role === "admin" ? 
                <DatabaseExport /> : 
                <div className="access-denied-container">
                  <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>You need administrator privileges to access the database export feature.</p>
                  </div>
                </div>
            } />
            <Route path="/monitoring" element={<MonitoringDashboard />} />
            <Route path="/location-management" element={<LocationManagement />} />
            <Route path="/energy-types-management" element={<EnergyTypesManagement />} />
            <Route path="/test-translation" element={<TranslationTest />} />
          </Routes>
        </main>
      </div>
      
      {/* Quick Actions - Only show when logged in and not on login page */}
      {showSidebar && <QuickActions currentUser={currentUser} />}
    </div>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
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
      setCurrentUser(res.data.user);
    } catch (err) {
      console.log("Error fetching current user");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <LoadingProvider>
        <GlobalStyles />
        <AppContent currentUser={currentUser} fetchCurrentUser={fetchCurrentUser} isLoading={isLoading} />
        <ToastContainer />
      </LoadingProvider>
    </Router>
  );
}

export default App;
