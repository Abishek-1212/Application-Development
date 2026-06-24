import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "./logo.png"; // college logo

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      navigate("/");
    } else {
      alert("Please enter username and password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <img src={logo} alt="College Logo" className="logo" />

        <h1>WELCOME</h1>
        <p className="subtitle">
          Please login to access the internet
        </p>

        <p className="warning">
          Please disable randomized MAC address on your device
        </p>

        <h3 className="user-type">Existing Users</h3>

        <form className="login-form" onSubmit={handleLogin}>

          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="checkbox-group">
            <input type="checkbox" required />
            <label>
              Accept <a href="/">Terms and Conditions</a>
            </label>
          </div>

          <button type="submit" className="login-btn">
            LOGIN
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;