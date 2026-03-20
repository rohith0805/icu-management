import { NavLink } from "react-router-dom";

function Sidebar() {
  const email = localStorage.getItem("userEmail") || "rohithreddygade321@gmail.com";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <div className="logo-box">∿</div>
          <div>
            <h2>ICU Manager</h2>
            <p>Critical Care System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/patients" className="nav-link">
            Patients
          </NavLink>
          <NavLink to="/beds" className="nav-link">
            Bed Management
          </NavLink>
          <NavLink to="/hospitals" className="nav-link">
            Hospitals
          </NavLink>
          <NavLink to="/alerts" className="nav-link">
            Alerts
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <span>{email}</span>
        <button onClick={handleLogout} className="logout-btn">
          ↪
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;