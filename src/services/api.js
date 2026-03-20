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
        oxygen: 20,
        temperature: 92,
        status: "Stable",
        hospitalId: "AIIMS New Delhi",
        bedNumber: "-",
      },
    ]);
  }

  if (!localStorage.getItem("icu_hospitals")) {
    setStorage("icu_hospitals", [
      {
        _id: "h1",
        name: "AIIMS New Delhi",
        address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029",
        totalBeds: 6,
        availableBeds: 3,
        phone: "+91 11 2658 8500",
        email: "director@aiims.edu",
        ambulance: "102",
        distance: "1413.4 km from you",
      },
      {
        _id: "h2",
        name: "Apollo Hospital Chennai",
        address: "21 Greams Lane, Off Greams Road, Chennai 600006",
        totalBeds: 5,
        availableBeds: 3,
        phone: "+91 44 2829 3333",
        email: "enquiry@apollohospitals.com",
        ambulance: "+91 44 2829 0200",
        distance: "354.4 km from you",
      },
      {
        _id: "h3",
        name: "CMC Vellore",
        address: "Ida Scudder Rd, Vellore, Tamil Nadu 632004",
        totalBeds: 4,
        availableBeds: 2,
        phone: "+91 416 228 1000",
        email: "info@cmcvellore.ac.in",
        ambulance: "+91 416 222 2102",
        distance: "502.1 km from you",
      },
      {
        _id: "h4",
        name: "Fortis Memorial Research Institute",
        address: "Sector 44, Gurugram, Haryana 122002",
        totalBeds: 4,
        availableBeds: 2,
        phone: "+91 124 496 2200",
        email: "care@fortishealthcare.com",
        ambulance: "+91 124 492 1021",
        distance: "1380.0 km from you",
      },
      {
        _id: "h5",
        name: "Kokilaben Dhirubhai Ambani Hospital",
        address: "Rao Saheb Achutrao Patwardhan Marg, Mumbai 400053",
        totalBeds: 5,
        availableBeds: 3,
        phone: "+91 22 3099 9999",
        email: "info@kokilabenhospital.com",
        ambulance: "+91 22 4269 6969",
        distance: "1035.2 km from you",
      },
      {
        _id: "h6",
        name: "Narayana Health Bangalore",
        address: "258/A Bommasandra Industrial Area, Bangalore",
        totalBeds: 4,
        availableBeds: 2,
        phone: "+91 80 7122 2222",
        email: "info@narayanahealth.org",
        ambulance: "+91 80 2783 2648",
        distance: "289.5 km from you",
      },
      {
        _id: "h7",
        name: "Tata Memorial Hospital",
        address: "Dr E Borges Rd, Parel, Mumbai",
        totalBeds: 4,
        availableBeds: 1,
        phone: "+91 22 2417 7000",
        email: "tmh@tmc.gov.in",
        ambulance: "+91 22 2417 7000",
        distance: "1042.8 km from you",
      },
    ]);
  }

  if (!localStorage.getItem("icu_beds")) {
    setStorage("icu_beds", [
      { _id: "b1", hospitalName: "AIIMS New Delhi", bedNumber: "ICU-01", status: "Occupied" },
      { _id: "b2", hospitalName: "AIIMS New Delhi", bedNumber: "ICU-02", status: "Available" },
      { _id: "b3", hospitalName: "Apollo Hospital Chennai", bedNumber: "ICU-03", status: "Available" },
      { _id: "b4", hospitalName: "CMC Vellore", bedNumber: "ICU-04", status: "Occupied" },
      { _id: "b5", hospitalName: "Fortis Memorial Research Institute", bedNumber: "ICU-05", status: "Available" },
      { _id: "b6", hospitalName: "Kokilaben Dhirubhai Ambani Hospital", bedNumber: "ICU-06", status: "Available" },
      { _id: "b7", hospitalName: "Narayana Health Bangalore", bedNumber: "ICU-07", status: "Occupied" },
      { _id: "b8", hospitalName: "Tata Memorial Hospital", bedNumber: "ICU-08", status: "Occupied" },
    ]);
  }

  if (!localStorage.getItem("icu_alerts")) {
    setStorage("icu_alerts", []);
  }
};

initDemoData();

export const signupUser = async (data) => {
  const users = getStorage("icu_users");

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === data.email.toLowerCase()
  );

  if (existingUser) return wrapError("Email already exists");

  users.push({
    name: data.name,
    email: data.email,
    password: data.password,
    role: "user",
  });

  setStorage("icu_users", users);
  return wrapResponse({ message: "Signup successful" });
};

export const loginUser = async (data) => {
  const users = getStorage("icu_users");

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === data.email.toLowerCase() &&
      u.password === data.password
  );

  if (!user) return wrapError("Invalid email or password");

  return wrapResponse({
    token: "demo-token",
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

export const getPatients = async () => wrapResponse(getStorage("icu_patients"));

export const addPatient = async (data) => {
  const patients = getStorage("icu_patients");
  const alerts = getStorage("icu_alerts");

  const newPatient = { _id: Date.now().toString(), ...data };
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
      createdAt: new Date().toLocaleString(),
    });
    setStorage("icu_alerts", alerts);
  }

  return wrapResponse({ message: "Patient added successfully" });
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
          createdAt: new Date().toLocaleString(),
        });
      }

      return updated;
    }
    return patient;
  });

  setStorage("icu_patients", updatedPatients);
  setStorage("icu_alerts", alerts);

  return wrapResponse({ message: "Patient updated successfully" });
};

export const deletePatient = async (id) => {
  const patients = getStorage("icu_patients");
  setStorage(
    "icu_patients",
    patients.filter((patient) => patient._id !== id)
  );
  return wrapResponse({ message: "Patient deleted successfully" });
};

export const getHospitals = async () => wrapResponse(getStorage("icu_hospitals"));

export const addHospital = async (data) => {
  const hospitals = getStorage("icu_hospitals");
  hospitals.push({ _id: "h" + Date.now(), ...data });
  setStorage("icu_hospitals", hospitals);
  return wrapResponse({ message: "Hospital added successfully" });
};

export const getBeds = async (hospitalName = "") => {
  const beds = getStorage("icu_beds");
  return wrapResponse(
    hospitalName ? beds.filter((bed) => bed.hospitalName === hospitalName) : beds
  );
};

export const addBed = async (data) => {
  const beds = getStorage("icu_beds");
  beds.push({ _id: "b" + Date.now(), ...data });
  setStorage("icu_beds", beds);
  return wrapResponse({ message: "Bed added successfully" });
};

export const getAlerts = async () => wrapResponse(getStorage("icu_alerts"));

export const resolveAlert = async (data) => {
  const alerts = getStorage("icu_alerts");
  const updatedAlerts = alerts.map((alert) =>
    alert._id === data.id ? { ...alert, status: "Resolved" } : alert
  );
  setStorage("icu_alerts", updatedAlerts);
  return wrapResponse({ message: "Alert resolved successfully" });
};