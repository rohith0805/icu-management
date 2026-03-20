import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "doctor@hospital.com",
    password: "123456",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userEmail", res.data.email);

      window.location.href = "/";
    } catch (error) {
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-logo">∿</div>
        <h1>ICU Manager</h1>
        <p>Sign in to your account</p>

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="doctor@hospital.com"
          value={form.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" className="primary-btn">
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;