function BedCard({ hospital }) {
  const occupied = hospital.totalBeds - hospital.availableBeds;

  return (
    <div className="bed-card">
      <div className="bed-card-top">
        <h3>{hospital.name}</h3>
        <span className="bed-count">{hospital.availableBeds}</span>
      </div>

      <p className="muted">{hospital.address}</p>

      <div className="bed-progress-wrap">
        <div className="bed-progress">
          <div
            className="bed-progress-fill"
            style={{ width: `${(occupied / hospital.totalBeds) * 100}%` }}
          />
        </div>
        <p className="muted">
          {occupied} occupied of {hospital.totalBeds} beds
        </p>
      </div>
    </div>
  );
}

export default BedCard;