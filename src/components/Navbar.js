function Navbar({ title, subtitle }) {
  return (
    <div className="page-top">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default Navbar;