import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";
import API from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: "weak", text: "Weak - Use at least 6 characters" };
    if (password.length < 8) return { strength: "medium", text: "Medium - Consider adding more characters" };
    return { strength: "strong", text: "Strong password!" };
  };

  const passwordStrength = password ? getPasswordStrength(password) : null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        username,
        password,
      });
      const token = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title"> Join Library</h2>
        <p className="welcome-text">
          Create your account to start managing your personal book collection
        </p>
        
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <input
              className="form-input"
              placeholder=" Choose Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              placeholder=" Create Password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {passwordStrength && (
              <div className={`password-strength strength-${passwordStrength.strength}`}>
                {passwordStrength.text}
              </div>
            )}
          </div>

          <div className="form-group">
            <input
              className="form-input"
              placeholder=" Confirm Password"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={isLoading}
            />
            {confirm && password !== confirm && (
              <div className="password-strength strength-weak">
                Passwords don't match
              </div>
            )}
            {confirm && password === confirm && confirm.length > 0 && (
              <div className="password-strength strength-strong">
                Passwords match! ✓
              </div>
            )}
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
              Show Passwords
            </label>
          </div>

          <button 
            className="submit-btn" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : " Create Account"}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="auth-switch">
          <p className="auth-switch-text">Already have an account?</p>
          <Link to="/" className="auth-switch-link">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;