function BedCard({ hospital }) {
  const occupied = hospital.totalBeds - hospital.availableBeds;

  return (
    <div className="bed-card">
      <div className="bed-card-icon">🏥</div>
      <div className="bed-card-content">
        <h3>{hospital.name}</h3>
        <p>{hospital.address}</p>
      </div>
      <div className="bed-card-count">
        <span>{hospital.availableBeds}</span>
        <small>of {hospital.totalBeds} beds</small>
      </div>
      <div className="bed-progress">
        <div
          className="bed-progress-bar"
          style={{ width: `${(occupied / hospital.totalBeds) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default BedCard;