import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import "./Login.css";

const Login = () => {
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email");

  const [email, setEmail] = useState(emailFromQuery || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.post(
        `${API_URL}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );

      const { token, user } = res.data;
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-logo">NITW SafeCampus</h1>
        <p className="auth-subtitle">
          Access campus safety features securely
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="auth-input"
            placeholder="University Email"
            value={email}
            onChange={(e) => !emailFromQuery && setEmail(e.target.value)}
            readOnly={!!emailFromQuery}
            required
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-footer">
          New here?{" "}
          <Link to="/signup" className="auth-link">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;