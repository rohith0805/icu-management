import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getHospitals } from "../services/api";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const loadHospitals = async () => {
      const res = await getHospitals();
      setHospitals(res.data);
    };
    loadHospitals();
  }, []);

  return (
    <div className="page">
      <Navbar title="Hospitals" subtitle="Nearby ICU hospitals and emergency contact details" />

      <div className="map-box">
        <div className="fake-map">Map Preview</div>
      </div>

      <div className="hospital-grid">
        {hospitals.map((hospital, index) => (
          <div className={`hospital-card ${index === 1 ? "highlight-card" : ""}`} key={hospital._id}>
            <div className="hospital-top">
              <div className="hospital-icon">🏥</div>
              <div>
                <h3>{hospital.name}</h3>
                <p>{hospital.address}</p>
              </div>
              {index === 1 && <span className="nearest-badge">Nearest</span>}
            </div>

            <div className="hospital-contact">
              <span>{hospital.phone}</span>
              <span>{hospital.email}</span>
              <span>{hospital.ambulance}</span>
            </div>

            <div className="hospital-bed-strip">
              <div className="hospital-bed-title">
                <span>ICU Beds</span>
                <span>
                  {hospital.availableBeds} / {hospital.totalBeds} available
                </span>
              </div>
              <div className="bed-progress">
                <div
                  className="bed-progress-bar"
                  style={{
                    width: `${((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="hospital-actions">
              <button className="secondary-btn">Show Route</button>
              <button className="secondary-btn">Directions</button>
              <button className="danger-btn">Ambulance</button>
            </div>

            <small className="distance-text">{hospital.distance}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hospitals;