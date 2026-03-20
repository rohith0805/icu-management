import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAlerts, resolveAlert } from "../services/api";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = async () => {
    const res = await getAlerts();
    setAlerts(res.data);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve = async (id) => {
    await resolveAlert({ id });
    loadAlerts();
  };

  return (
    <div className="page">
      <Navbar title="Alerts" subtitle="Critical care notifications" />

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="panel">
            <p className="muted centered">No alerts found</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div className="alert-card" key={alert._id}>
              <div>
                <h3>{alert.patientName}</h3>
                <p>{alert.message}</p>
                <small>{alert.createdAt}</small>
              </div>

              <div className="alert-meta">
                <span className={`alert-tag ${alert.severity.toLowerCase()}`}>
                  {alert.severity}
                </span>
                <span className={`status-pill ${alert.status.toLowerCase()}`}>
                  {alert.status}
                </span>
                {alert.status !== "Resolved" && (
                  <button className="primary-btn small-btn" onClick={() => handleResolve(alert._id)}>
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;