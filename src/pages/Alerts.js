import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAlerts, resolveAlert } from "../services/api";

function Alerts() {
  const [alerts, setAlerts] = useState([]);

  const loadAlerts = async () => {
    try {
      const res = await getAlerts();
      setAlerts(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAlerts();
    const timer = setInterval(loadAlerts, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleResolve = async (id) => {
    try {
      await resolveAlert({ id });
      loadAlerts();
    } catch (error) {
      alert("Failed to resolve alert");
    }
  };

  return (
    <>
      <Navbar title="Alerts" />

      <div className="page-section">
        <p className="page-subtitle">Critical care notifications</p>

        <div className="alerts-list">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div className="alert-card" key={alert._id?.$oid || alert._id}>
                <div>
                  <h3>{alert.patientName}</h3>
                  <p>{alert.message}</p>
                  <small>{alert.createdAt}</small>
                </div>

                <div className="alert-actions">
                  <span className={`alert-badge ${alert.severity?.toLowerCase()}`}>
                    {alert.severity}
                  </span>
                  <span className={`status-badge ${alert.status?.toLowerCase()}`}>
                    {alert.status}
                  </span>
                  {alert.status !== "Resolved" && (
                    <button
                      className="primary-btn small-btn"
                      onClick={() => handleResolve(alert._id?.$oid || alert._id)}
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="muted">No alerts found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Alerts;