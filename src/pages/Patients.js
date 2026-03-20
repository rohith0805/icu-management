import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getPatients, addPatient } from "../services/api";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    diagnosis: "",
    heartRate: 72,
    oxygen: 20,
    temperature: 92,
    status: "Stable",
    hospitalId: "",
    bedNumber: "-",
  });

  const loadPatients = async () => {
    const res = await getPatients();
    setPatients(res.data);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    await addPatient({
      ...form,
      age: Number(form.age),
      heartRate: Number(form.heartRate),
      oxygen: Number(form.oxygen),
      temperature: Number(form.temperature),
    });
    setShowForm(false);
    setForm({
      name: "",
      age: "",
      gender: "male",
      diagnosis: "",
      heartRate: 72,
      oxygen: 20,
      temperature: 92,
      status: "Stable",
      hospitalId: "",
      bedNumber: "-",
    });
    loadPatients();
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar title="Patients" subtitle={`${filteredPatients.length} total patients`} />

      <div className="page-actions">
        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="filter-select">
            <option>All Status</option>
          </select>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          + Admit Patient
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleAddPatient}>
          <div className="form-grid">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
            <input name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} required />
            <input name="heartRate" type="number" placeholder="Heart Rate" value={form.heartRate} onChange={handleChange} />
            <input name="oxygen" type="number" placeholder="Oxygen" value={form.oxygen} onChange={handleChange} />
            <input name="temperature" type="number" placeholder="Temperature" value={form.temperature} onChange={handleChange} />
            <input name="hospitalId" placeholder="Hospital" value={form.hospitalId} onChange={handleChange} />
          </div>
          <button className="primary-btn" type="submit">Save Patient</button>
        </form>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Age/Gender</th>
              <th>Diagnosis</th>
              <th>Bed</th>
              <th>Vitals</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.age} • {p.gender}</td>
                <td>{p.diagnosis}</td>
                <td>{p.bedNumber || "-"}</td>
                <td>❤ {p.heartRate} &nbsp; O₂ {p.oxygen}% &nbsp; 🌡 {p.temperature}°</td>
                <td>
                  <span className={`status-pill ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;