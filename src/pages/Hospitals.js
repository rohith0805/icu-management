import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getHospitals } from "../services/api";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);

  const loadHospitals = async () => {
    try {
      const res = await getHospitals();
      setHospitals(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  return (
    <>
      <Navbar title="Hospitals" />

      <div className="page-section">
        <p className="page-subtitle">Available ICU hospitals</p>

        <div className="hospital-grid">
          {hospitals.map((hospital) => (
            <div
              className="hospital-card"
              key={hospital._id?.$oid || hospital._id || hospital.name}
            >
              <h3>{hospital.name}</h3>
              <p>{hospital.address}</p>
              <div className="hospital-stats">
                <span>Total Beds: {hospital.totalBeds}</span>
                <span>Available: {hospital.availableBeds}</span>
              </div>
              <button className="primary-btn small-btn">Directions</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Hospitals;