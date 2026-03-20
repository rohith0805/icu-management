import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BedCard from "../components/BedCard";
import { getHospitals } from "../services/api";

function Beds() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("All Hospitals");

  useEffect(() => {
    const loadHospitals = async () => {
      const res = await getHospitals();
      setHospitals(res.data);
    };
    loadHospitals();
  }, []);

  const filteredHospitals =
    selectedHospital === "All Hospitals"
      ? hospitals
      : hospitals.filter((hospital) => hospital.name === selectedHospital);

  const totalAvailable = hospitals.reduce((sum, h) => sum + h.availableBeds, 0);
  const totalOccupied = hospitals.reduce((sum, h) => sum + (h.totalBeds - h.availableBeds), 0);

  return (
    <div className="page">
      <Navbar
        title="Bed Management"
        subtitle={`${totalAvailable} available · ${totalOccupied} occupied · 3 maintenance`}
      />

      <div className="beds-header">
        <select
          className="filter-select beds-select"
          value={selectedHospital}
          onChange={(e) => setSelectedHospital(e.target.value)}
        >
          <option>All Hospitals</option>
          {hospitals.map((hospital) => (
            <option key={hospital._id} value={hospital.name}>
              {hospital.name}
            </option>
          ))}
        </select>
      </div>

      <div className="beds-grid">
        {filteredHospitals.map((hospital) => (
          <BedCard key={hospital._id} hospital={hospital} />
        ))}
      </div>
    </div>
  );
}

export default Beds;