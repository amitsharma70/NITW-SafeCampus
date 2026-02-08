import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    // TODO: Call signup API
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Create your SafeCampus account</h2>
        <p className="subtitle">Stay connected. Stay safe.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className="input"
              placeholder="University Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="input"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
