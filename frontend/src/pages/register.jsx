import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Register = () => {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [branch, setBranch] = useState("");
  const [batch, setBatch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-logo">Create Account</h1>
        <p className="auth-subtitle">
          Join NITW SafeCampus community
        </p>

        <form>
          <input
            className="auth-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />

          <input
            className="auth-input"
            placeholder="Batch (2020-2024)"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          />

          <input
            type="email"
            className="auth-input"
            placeholder="University Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn">
            Create Account
          </button>
        </form>

        <p className="auth-footer">
          Already registered?{" "}
          <Link to="/" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;