import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { name, email, password } = formData;
      const res = await axios.post(`${BASE_URL}/api/auth/register`, {
        userName:name,
        email,
        password,
      });
      if(!res.data.success){setError(res.data.message)
        console.log(res.data.message) 
         return; }
         console.log(res.data.message) ;
      navigate("/login");
    } catch (err) {
      setError("Some error occured");
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

        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-card {
          width: 100%;
          max-width: 380px;
          background: #0b1220;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          color: #e5e7eb;
        }

        .auth-card h2 {
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

        .auth-card input {
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

        .auth-card input::placeholder {
          color: #6b7280;
        }

        .auth-card input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 1px #6366f1;
        }

        .auth-card button {
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

        .auth-card button:hover {
          background: #4f46e5;
        }

        .auth-card button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          margin-bottom: 12px;
          font-size: 13px;
          color: #f87171;
          text-align: center;
        }

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
      `}</style>

      <div className="auth-container">
        <form className="auth-card" onSubmit={handleRegister}>
          <h2>Create Account</h2>
          <p className="subtitle">Sign up to get started</p>

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="footer-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </form>
      </div>
    </>
  );
}
