function PatientCard({ patient }) {
  return (
    <div className="patient-mini-card">
      <div className="patient-avatar">♡</div>
      <div className="patient-main">
        <h4>{patient.name}</h4>
        <p>{patient.diagnosis}</p>
      </div>
      <div className="patient-bpm">{patient.heartRate} bpm</div>
      <div className={`status-pill ${patient.status?.toLowerCase()}`}>
        {patient.status}
      </div>
    </div>
  );
}

export default PatientCard;