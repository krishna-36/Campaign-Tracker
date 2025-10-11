import React, { useState } from "react";
import "./login.css"; // 👈 Import the CSS

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (user === "admin" && pass === "admin") {
      onLogin("dummy-token-123");
    } else {
      setError("Invalid credentials 😢");
      setTimeout(() => setError(""), 2000);
    }
  }

  return (
    <div className="login">
      <form className="login-form" onSubmit={submit}>
        <h2>Campaign Tracker</h2>
        <input
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <p className="error-text">{error}</p>}
        <p>Hint: username: admin / password: admin</p>
      </form>
    </div>
  );
}
