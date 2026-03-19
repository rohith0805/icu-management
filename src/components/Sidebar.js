import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail") || "rohithreddygade321@gmail.com";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">∿</div>
        <div>
          <h2>ICU Manager</h2>
          <p>Critical Care System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="nav-item">
          Dashboard
        </NavLink>
        <NavLink to="/patients" className="nav-item">
          Patients
        </NavLink>
        <NavLink to="/beds" className="nav-item">
          Bed Management
        </NavLink>
        <NavLink to="/hospitals" className="nav-item">
          Hospitals
        </NavLink>
        <NavLink to="/alerts" className="nav-item">
          Alerts
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span>{email}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;