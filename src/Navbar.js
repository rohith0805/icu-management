import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{padding:"15px",background:"#2c3e50",color:"white"}}>
      <Link to="/" style={{marginRight:"20px",color:"white"}}>Home</Link>
      <Link to="/beds" style={{marginRight:"20px",color:"white"}}>ICU Beds</Link>
      <Link to="/request" style={{color:"white"}}>Request Bed</Link>
    </div>
  );
}

export default Navbar;