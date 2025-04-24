import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Asegúrate de tener este archivo

export default function Login() {
  const [username, setUsername] = useState("cliente");
  const [password, setPassword] = useState("cliente123");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      if (user.role === "Admin") navigate("/admin");
      else navigate("/cliente");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>

        {/* 👇 Aquí se muestran las credenciales de prueba */}
        <p className="demo-credentials">
          <strong>Cliente:</strong> cliente / cliente123<br />
          <strong>Admin:</strong> admin / admin123
        </p>

        {error && <p className="login-error">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
