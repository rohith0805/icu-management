import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/api";

function Signup() {
  const navigate = useNavigate();

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

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await signupUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });

      console.log("SIGNUP SUCCESS:", res.data);
      alert(res.data.message || "Signup successful");
      navigate("/login");
    } catch (error) {
      console.error("SIGNUP ERROR FULL:", error);
      console.error("SIGNUP ERROR RESPONSE:", error?.response);
      console.error("SIGNUP ERROR DATA:", error?.response?.data);

      alert(
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSignup}>
        <div className="login-logo">∿</div>
        <h1>Create Account</h1>
        <p>Register to access ICU Manager</p>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Create password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;