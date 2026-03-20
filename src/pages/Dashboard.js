import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PatientCard from "../components/PatientCard";
import { getPatients, getAlerts, getHospitals, getBeds } from "../services/api";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [p, a, h, b] = await Promise.all([
        getPatients(),
        getAlerts(),
        getHospitals(),
        getBeds(),
      ]);
      setPatients(p.data);
      setAlerts(a.data);
      setHospitals(h.data);
      setBeds(b.data);
    };

    loadData();
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === "Active").length;
  const criticalPatients = patients.filter((p) => p.status === "Critical").length;
  const occupiedBeds = beds.filter((b) => b.status === "Occupied").length;
  const totalBeds = hospitals.reduce((sum, h) => sum + h.totalBeds, 0);

  return (
    <div className="page">
      <Navbar title="Dashboard" subtitle="ICU Overview & Monitoring" />

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <h2>{patients.length}</h2>
          <p>Currently admitted</p>
        </div>
        <div className="stat-card">
          <h3>Critical Patients</h3>
          <h2>{criticalPatients}</h2>
          <p>Require immediate attention</p>
        </div>
        <div className="stat-card">
          <h3>Beds Occupied</h3>
          <h2>{occupiedBeds}/{totalBeds}</h2>
          <p>{totalBeds - occupiedBeds} available</p>
        </div>
        <div className="stat-card">
          <h3>Active Alerts</h3>
          <h2>{activeAlerts}</h2>
          <p>Unacknowledged</p>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="panel">
          <h2>Current Patients</h2>
          {patients.length > 0 ? (
            patients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))
          ) : (
            <p className="muted centered">No patients</p>
          )}
        </div>

        <div className="panel">
          <h2>Recent Alerts</h2>
          {activeAlerts > 0 ? (
            alerts
              .filter((a) => a.status === "Active")
              .map((alert) => (
                <div className="alert-row" key={alert._id}>
                  <strong>{alert.patientName}</strong>
                  <p>{alert.message}</p>
                </div>
              ))
          ) : (
            <p className="muted centered no-alerts">No active alerts</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;