import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Beds from "./Beds";
import RequestBed from "./RequestBed";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beds" element={<Beds />} />
        <Route path="/request" element={<RequestBed />} />
      </Routes>

    </Router>
  );
}

export default App;