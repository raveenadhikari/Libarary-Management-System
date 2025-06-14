import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5121/api/auth/register", {
        username,
        password,
      });

      const token = response.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        
        <input
          className="form-control mt-2"
          placeholder="Password"
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          className="form-control mt-2"
          placeholder="Confirm Password"
          type={show ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={show}
            onChange={() => setShow(!show)}
            id="showPw"
          />
          <label className="form-check-label" htmlFor="showPw">
            Show Password
          </label>
        </div>

        <button className="btn btn-primary mt-3" type="submit">Register</button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default Register;
