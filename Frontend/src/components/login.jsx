import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password },{ withCredentials: true });
      if(!res.data.success){
        setError(res.data.message);
        return;
      }
     
      
      navigate("/summarise");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, system-ui, sans-serif;
          background: linear-gradient(135deg, #0f172a, #020617);
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          width: 100%;
          max-width: 380px;
          background: #0b1220;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          color: #e5e7eb;
        }

        .login-card h2 {
          margin-bottom: 6px;
          font-size: 24px;
          font-weight: 600;
          text-align: center;
        }

        .subtitle {
          margin-bottom: 24px;
          text-align: center;
          font-size: 14px;
          color: #9ca3af;
        }

        .login-card input {
          width: 100%;
          padding: 12px 14px;
          margin-bottom: 14px;
          border-radius: 8px;
          border: 1px solid #1f2937;
          background: #020617;
          color: #e5e7eb;
          font-size: 14px;
          outline: none;
        }

        .login-card input::placeholder {
          color: #6b7280;
        }

        .login-card input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 1px #6366f1;
        }

        .login-card button {
          width: 100%;
          padding: 12px;
          margin-top: 8px;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .login-card button:hover {
          background: #4f46e5;
        }

        .login-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          margin-bottom: 12px;
          font-size: 13px;
          color: #f87171;
          text-align: center;
        }

        /* 🔽 NEW FOOTER STYLES */
        .footer-text {
          margin-top: 16px;
          text-align: center;
          font-size: 14px;
          color: #9ca3af;
        }

        .footer-text span {
          color: #6366f1;
          cursor: pointer;
          font-weight: 500;
        }

        .footer-text span:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue</p>

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="footer-text">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </form>
      </div>
    </>
  );
}
