import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BedCard from "../components/BedCard";
import { getHospitals } from "../services/api";

function Beds() {
  const [hospitals, setHospitals] = useState([]);
  const [filterHospital, setFilterHospital] = useState("All Hospitals");

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

  const filtered =
    filterHospital === "All Hospitals"
      ? hospitals
      : hospitals.filter((h) => h.name === filterHospital);

  const totalAvailable = hospitals.reduce((sum, h) => sum + (h.availableBeds || 0), 0);
  const totalBeds = hospitals.reduce((sum, h) => sum + (h.totalBeds || 0), 0);
  const occupied = totalBeds - totalAvailable;

  return (
    <>
      <Navbar title="Bed Management" />

      <div className="page-section">
        <div className="page-header-row">
          <div>
            <h1>Bed Management</h1>
            <p className="page-subtitle">
              {totalAvailable} available · {occupied} occupied
            </p>
          </div>

          <select
            className="hospital-filter"
            value={filterHospital}
            onChange={(e) => setFilterHospital(e.target.value)}
          >
            <option>All Hospitals</option>
            {hospitals.map((hospital) => (
              <option key={hospital._id?.$oid || hospital._id || hospital.name}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>

        <div className="beds-grid">
          {filtered.map((hospital) => (
            <BedCard
              key={hospital._id?.$oid || hospital._id || hospital.name}
              hospital={hospital}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Beds;