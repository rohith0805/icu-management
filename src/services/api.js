// src/services/api.js

const getStorage = (key, fallback = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const wrapResponse = (data) => Promise.resolve({ data });

const wrapError = (message) =>
  Promise.reject({
    response: {
      data: { message },
    },
  });

// --------------------
// Demo Data Init
// --------------------
const initDemoData = () => {
  if (!localStorage.getItem("icu_users")) {
    setStorage("icu_users", [
      {
        name: "Doctor Admin",
        email: "doctor@hospital.com",
        password: "123456",
        role: "admin",
      },
    ]);
  }

  if (!localStorage.getItem("icu_patients")) {
    setStorage("icu_patients", [
      {
        _id: Date.now().toString(),
        name: "rohith",
        age: 20,
        gender: "male",
        diagnosis: "operation",
        heartRate: 72,
        oxygen: 98,
        temperature: 37,
        status: "Stable",
        hospitalId: "AIIMS New Delhi",
        bedNumber: "ICU-01",
      },
    ]);
  }

  if (!localStorage.getItem("icu_hospitals")) {
    setStorage("icu_hospitals", [
      {
        _id: "h1",
        name: "AIIMS New Delhi",
        address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi",
        totalBeds: 6,
        availableBeds: 3,
      },
      {
        _id: "h2",
        name: "Apollo Hospital Chennai",
        address: "21 Greams Lane, Off Greams Road, Chennai",
        totalBeds: 5,
        availableBeds: 3,
      },
      {
        _id: "h3",
        name: "CMC Vellore",
        address: "Vellore, Tamil Nadu",
        totalBeds: 4,
        availableBeds: 2,
      },
    ]);
  }

  if (!localStorage.getItem("icu_beds")) {
    setStorage("icu_beds", [
      { _id: "b1", hospitalName: "AIIMS New Delhi", bedNumber: "ICU-01", status: "Occupied" },
      { _id: "b2", hospitalName: "AIIMS New Delhi", bedNumber: "ICU-02", status: "Available" },
      { _id: "b3", hospitalName: "Apollo Hospital Chennai", bedNumber: "ICU-03", status: "Available" },
      { _id: "b4", hospitalName: "CMC Vellore", bedNumber: "ICU-04", status: "Occupied" },
    ]);
  }

  if (!localStorage.getItem("icu_alerts")) {
    setStorage("icu_alerts", [
      {
        _id: "a1",
        patientName: "rohith",
        message: "No active alerts",
        severity: "Low",
        status: "Resolved",
        createdAt: new Date().toISOString(),
      },
    ]);
  }
};

initDemoData();

// --------------------
// AUTH
// --------------------
export const signupUser = async (data) => {
  const users = getStorage("icu_users");

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === data.email.toLowerCase()
  );

  if (existingUser) {
    return wrapError("Email already exists");
  }

  users.push({
    name: data.name,
    email: data.email,
    password: data.password,
    role: "user",
  });

  setStorage("icu_users", users);

  return wrapResponse({
    message: "Signup successful",
  });
};

export const loginUser = async (data) => {
  const users = getStorage("icu_users");

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === data.email.toLowerCase() &&
      u.password === data.password
  );

  if (!user) {
    return wrapError("Invalid email or password");
  }

  return wrapResponse({
    token: "demo-token",
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

// --------------------
// PATIENTS
// --------------------
export const getPatients = async () => {
  return wrapResponse(getStorage("icu_patients"));
};

export const addPatient = async (data) => {
  const patients = getStorage("icu_patients");
  const alerts = getStorage("icu_alerts");

  const newPatient = {
    _id: Date.now().toString(),
    ...data,
  };

  patients.push(newPatient);
  setStorage("icu_patients", patients);

  if (
    Number(data.heartRate) > 120 ||
    Number(data.oxygen) < 90 ||
    Number(data.temperature) > 39
  ) {
    alerts.push({
      _id: "a" + Date.now(),
      patientName: data.name,
      message: "Critical vitals detected",
      severity: "High",
      status: "Active",
      createdAt: new Date().toISOString(),
    });
    setStorage("icu_alerts", alerts);
  }

  return wrapResponse({
    message: "Patient added successfully",
  });
};

export const updatePatient = async (data) => {
  const patients = getStorage("icu_patients");
  const alerts = getStorage("icu_alerts");

  const updatedPatients = patients.map((patient) => {
    if (patient._id === data._id || patient._id === data.id) {
      const updated = { ...patient, ...data };

      updated.status =
        Number(updated.heartRate) > 120 ||
        Number(updated.oxygen) < 90 ||
        Number(updated.temperature) > 39
          ? "Critical"
          : "Stable";

      if (updated.status === "Critical") {
        alerts.push({
          _id: "a" + Date.now(),
          patientName: updated.name,
          message: "Critical vitals detected",
          severity: "High",
          status: "Active",
          createdAt: new Date().toISOString(),
        });
      }

      return updated;
    }
    return patient;
  });

  setStorage("icu_patients", updatedPatients);
  setStorage("icu_alerts", alerts);

  return wrapResponse({
    message: "Patient updated successfully",
  });
};

export const deletePatient = async (id) => {
  const patients = getStorage("icu_patients");
  const filtered = patients.filter((patient) => patient._id !== id);
  setStorage("icu_patients", filtered);

  return wrapResponse({
    message: "Patient deleted successfully",
  });
};

// --------------------
// HOSPITALS
// --------------------
export const getHospitals = async () => {
  return wrapResponse(getStorage("icu_hospitals"));
};

export const addHospital = async (data) => {
  const hospitals = getStorage("icu_hospitals");

  hospitals.push({
    _id: "h" + Date.now(),
    ...data,
  });

  setStorage("icu_hospitals", hospitals);

  return wrapResponse({
    message: "Hospital added successfully",
  });
};

// --------------------
// BEDS
// --------------------
export const getBeds = async (hospitalName = "") => {
  const beds = getStorage("icu_beds");

  if (!hospitalName) {
    return wrapResponse(beds);
  }

  return wrapResponse(
    beds.filter((bed) => bed.hospitalName === hospitalName)
  );
};

export const addBed = async (data) => {
  const beds = getStorage("icu_beds");

  beds.push({
    _id: "b" + Date.now(),
    ...data,
  });

  setStorage("icu_beds", beds);

  return wrapResponse({
    message: "Bed added successfully",
  });
};

// --------------------
// ALERTS
// --------------------
export const getAlerts = async () => {
  return wrapResponse(getStorage("icu_alerts"));
};

export const resolveAlert = async (data) => {
  const alerts = getStorage("icu_alerts");

  const updatedAlerts = alerts.map((alert) =>
    alert._id === data.id
      ? { ...alert, status: "Resolved" }
      : alert
  );

  setStorage("icu_alerts", updatedAlerts);

  return wrapResponse({
    message: "Alert resolved successfully",
  });
};