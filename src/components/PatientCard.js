function PatientCard({ patient }) {
  return (
    <div className="patient-card">
      <div className="patient-avatar">❤</div>
      <div className="patient-info">
        <h4>{patient.name}</h4>
        <p>{patient.diagnosis}</p>
      </div>
      <div className="patient-vitals">
        <span>{patient.heartRate} bpm</span>
      </div>
      <div>
        <span className={`status-badge ${patient.status?.toLowerCase()}`}>
          {patient.status}
        </span>
      </div>
    </div>
  );
}

export default PatientCard;