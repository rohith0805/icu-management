import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Beds from "./pages/Beds";
import Hospitals from "./pages/Hospitals";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/beds" element={<Beds />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={isLoggedIn ? <Layout /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;