function Navbar({ title = "ICU Manager" }) {
  const userName = localStorage.getItem("userName") || "Doctor";

  return (
    <div className="topbar">
      <div>
        <h2>{title}</h2>
        <p className="subtitle">Critical Care System</p>
      </div>
      <div className="topbar-user">
        <span>{userName}</span>
      </div>
    </div>
  );
}

export default Navbar;