import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    if (!form.email.trim() || !form.password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userEmail", res.data.email);

      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      alert(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-logo">∿</div>
        <h1>ICU Manager</h1>
        <p>Sign in to your account</p>

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
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

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;