import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

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
    <div className="container">
      <div className="card">
        <h2 className="title">SafeCampus</h2>
        <p className="subtitle">
          Login to access campus safety features
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              className="input"
              placeholder="University Email"
              value={email}
              onChange={(e) => !emailFromQuery && setEmail(e.target.value)}
              readOnly={!!emailFromQuery}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="input"
              placeholder="Password"
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
            Login
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          New user?{" "}
          <Link to="/signup" className="link">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
