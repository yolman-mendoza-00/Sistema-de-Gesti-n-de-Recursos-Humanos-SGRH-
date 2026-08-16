import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/api";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem(
        "sgrh_user",
        JSON.stringify({
          businessEntityId: data.businessEntityId,
          nombre: data.nombre,
          email: data.email,
          cargo: data.cargo,
        })
      );
      navigate("/");
    } catch (err) {
      setError(err.message || "Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__topbar" />

        <div className="login__body">
          <div className="login__brand">
            <div className="login__brand-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />
              </svg>
            </div>
            <h1 className="login__title">SGRH</h1>
            <p className="login__subtitle">HR Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="login__form">
            <div className="login__field">
              <label htmlFor="email" className="login__label">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@adventure-works.com"
                className="login__input"
                autoComplete="username"
              />
            </div>

            <div className="login__field">
              <label htmlFor="password" className="login__label">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login__input"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="login__error">{error}</p>}

            <button type="submit" disabled={loading} className="login__submit">
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>

        <div className="login__footer">
          <span>SISTEMA CORPORATIVO SEGURO</span>
        </div>
      </div>
    </div>
  );
}
