import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateLOTO from "./pages/CreateLOTO";
import LOTOList from "./pages/LOTOList";
import LOTOdetail from "./pages/LOTOdetail";
import UpdateLOTO from "./pages/UpdateLOTO";
import HandoverLOTO from "./pages/HandoverLOTO";
import CompleteLOTO from "./pages/CompleteLOTO";
import Notifications from "./pages/Notifications"; // Add this

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-loto" element={<CreateLOTO />} />
          <Route path="/loto-list" element={<LOTOList />} />
          <Route path="/loto/:id" element={<LOTOdetail />} />
          <Route path="/loto/:id/update" element={<UpdateLOTO />} />
          <Route path="/loto/:id/handover" element={<HandoverLOTO />} />
          <Route path="/loto/:id/complete" element={<CompleteLOTO />} />
          <Route path="/notifications" element={<Notifications />} />{" "}
          {/* Add this */}
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
