import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PatientCard from "../components/PatientCard";
import { getPatients, getAlerts, getBeds } from "../services/api";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [beds, setBeds] = useState([]);

  const loadData = async () => {
    try {
      const [patientRes, alertRes, bedRes] = await Promise.all([
        getPatients(),
        getAlerts(),
        getBeds(),
      ]);

      setPatients(patientRes.data || []);
      setAlerts(alertRes.data || []);
      setBeds(bedRes.data || []);
    } catch (error) {
      console.error("Dashboard load error:", error);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  const totalPatients = patients.length;
  const criticalPatients = patients.filter((p) => p.status === "Critical").length;
  const occupiedBeds = beds.filter((b) => b.status === "Occupied").length;
  const totalBeds = beds.length;
  const activeAlerts = alerts.filter((a) => a.status === "Active").length;

  return (
    <>
      <Navbar title="Dashboard" />

      <div className="page-section">
        <p className="page-subtitle">ICU Overview & Monitoring</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Patients</h3>
            <h2>{totalPatients}</h2>
            <p>Currently admitted</p>
          </div>

          <div className="stat-card">
            <h3>Critical Patients</h3>
            <h2>{criticalPatients}</h2>
            <p>Require immediate attention</p>
          </div>

          <div className="stat-card">
            <h3>Beds Occupied</h3>
            <h2>
              {occupiedBeds}/{totalBeds}
            </h2>
            <p>{totalBeds - occupiedBeds} available</p>
          </div>

          <div className="stat-card">
            <h3>Active Alerts</h3>
            <h2>{activeAlerts}</h2>
            <p>Unacknowledged</p>
          </div>
        </div>

        <div className="two-column-grid">
          <div className="panel">
            <h2>Current Patients</h2>
            {patients.length > 0 ? (
              patients.slice(0, 4).map((patient) => (
                <PatientCard key={patient._id?.$oid || patient._id || patient.name} patient={patient} />
              ))
            ) : (
              <p className="muted">No patients found</p>
            )}
          </div>

          <div className="panel">
            <h2>Recent Alerts</h2>
            {alerts.filter((a) => a.status === "Active").length > 0 ? (
              alerts
                .filter((a) => a.status === "Active")
                .slice(0, 5)
                .map((alert, index) => (
                  <div key={index} className="alert-item">
                    <strong>{alert.patientName}</strong>
                    <p>{alert.message}</p>
                    <span className={`alert-badge ${alert.severity?.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                  </div>
                ))
            ) : (
              <p className="muted center-text">No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;