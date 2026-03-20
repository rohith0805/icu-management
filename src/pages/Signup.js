import { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../services/api";

function Signup() {
  const [form, setForm] = useState({
    name: "",
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

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await signupUser(form);
      alert(res.data.message || "Signup successful");
      window.location.href = "/login";
    } catch (error) {
      alert(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSignup}>
        <div className="auth-logo">∿</div>
        <h1>Create Account</h1>
        <p>Register to access ICU Manager</p>

        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
        />

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
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" className="primary-btn">
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;