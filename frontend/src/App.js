import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import GlobalStyles from "./components/GlobalStyles";
import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateLOTO from "./pages/CreateLOTO";
import LOTOList from "./pages/LOTOList";
import LOTOdetail from "./pages/LOTOdetail";
import UpdateLOTO from "./pages/UpdateLOTO";
import HandoverLOTO from "./pages/HandoverLOTO";
import CompleteLOTO from "./pages/CompleteLOTO";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import KPISummary from "./pages/KPISummary";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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

      const res = await axios.get("http://localhost:5000/api/auth/me", config);
      setCurrentUser(res.data.user);
    } catch (err) {
      console.log("Error fetching current user");
      localStorage.removeItem("token");
    }
  };

  return (
    <Router>
      <GlobalStyles />
      <div className="App">
        <Header currentUser={currentUser} />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Login onLogin={fetchCurrentUser} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-loto" element={<CreateLOTO />} />
            <Route path="/loto-list" element={<LOTOList />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/kpi" element={<KPISummary />} />
            <Route path="/loto/:id" element={<LOTOdetail />} />
            <Route path="/loto/:id/update" element={<UpdateLOTO />} />
            <Route path="/loto/:id/handover" element={<HandoverLOTO />} />
            <Route path="/loto/:id/complete" element={<CompleteLOTO />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
