import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getPatients, addPatient, deletePatient } from "../services/api";

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
    oxygen: 98,
    temperature: 37,
    status: "Stable",
    hospitalId: "AIIMS New Delhi",
    bedNumber: "ICU-01",
  });

  const loadPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
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
        oxygen: 98,
        temperature: 37,
        status: "Stable",
        hospitalId: "AIIMS New Delhi",
        bedNumber: "ICU-01",
      });
      loadPatients();
    } catch (error) {
      alert("Failed to add patient");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      loadPatients();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar title="Patients" />

      <div className="page-section">
        <div className="page-header-row">
          <div>
            <h1>Patients</h1>
            <p className="page-subtitle">{filteredPatients.length} total patients</p>
          </div>
          <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
            + Admit Patient
          </button>
        </div>

        {showForm && (
          <form className="form-card" onSubmit={handleAddPatient}>
            <div className="form-grid">
              <input
                placeholder="Patient name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                placeholder="Age"
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                required
              />
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                placeholder="Diagnosis"
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                required
              />
              <input
                placeholder="Heart Rate"
                type="number"
                value={form.heartRate}
                onChange={(e) => setForm({ ...form, heartRate: e.target.value })}
              />
              <input
                placeholder="Oxygen"
                type="number"
                value={form.oxygen}
                onChange={(e) => setForm({ ...form, oxygen: e.target.value })}
              />
              <input
                placeholder="Temperature"
                type="number"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })}
              />
              <input
                placeholder="Hospital"
                value={form.hospitalId}
                onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}
              />
              <input
                placeholder="Bed Number"
                value={form.bedNumber}
                onChange={(e) => setForm({ ...form, bedNumber: e.target.value })}
              />
            </div>
            <button className="primary-btn" type="submit">
              Save Patient
            </button>
          </form>
        )}

        <div className="toolbar">
          <input
            className="search-box"
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p._id?.$oid || p._id || p.name}>
                  <td>{p.name}</td>
                  <td>
                    {p.age} • {p.gender}
                  </td>
                  <td>{p.diagnosis}</td>
                  <td>{p.bedNumber || "-"}</td>
                  <td>
                    ❤️ {p.heartRate} &nbsp; O₂ {p.oxygen}% &nbsp; 🌡 {p.temperature}°C
                  </td>
                  <td>
                    <span className={`status-badge ${p.status?.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(p._id?.$oid || p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="7" className="center-text">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Patients;