import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";
import API from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await API.post("/auth/login", {
        username,
        password,
      });
      const token = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Library Management System</h2>
        <p className="welcome-text">
          Sign in to access your personal library management system
        </p>
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <input
              className="form-input"
              placeholder=" Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              placeholder=" Password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="checkbox-container">
            <input
              className="custom-checkbox"
              type="checkbox"
              checked={show}
              onChange={() => setShow(!show)}
              id="showPw"
              disabled={isLoading}
            />
            <label className="checkbox-label" htmlFor="showPw">
              Show Password
            </label>
          </div>

          <button 
            className="submit-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : " Sign In"}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="auth-switch">
          <p className="auth-switch-text">Don't have an account?</p>
          <Link to="/register" className="auth-switch-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;