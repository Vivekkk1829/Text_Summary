import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Summarise({ user }) {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  // ---------- LOGOUT ----------
  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  };

  // ---------- CLOSE DROPDOWN ON OUTSIDE CLICK ----------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------- SUMMARISE ----------
  const handleSummarise = async () => {
    if (!text.trim()) {
      alert("Enter some text to summarise");
      return;
    }

    try {
      setLoading(true);
      setSummary("");

      const response = await axios.post(
        `${BASE_URL}/api/summarise`,
        { text },
        { withCredentials: true }
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.error(error);
      alert("Failed to summarize text");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ---------- STYLES ---------- */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, system-ui, sans-serif;
          background: #f8fafc;
          color: #0f172a;
        }

        /* ---------- NAVBAR ---------- */
        .navbar {
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
        }

        .logo {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          background: transparent;
          border: none;
          color: #2563eb;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .user-dropdown {
          position: relative;
        }

        .user-info {
          text-align: right;
          font-size: 13px;
          cursor: pointer;
        }

        .user-info strong {
          display: block;
          font-size: 14px;
        }

        .user-info span {
          color: #64748b;
        }

        .dropdown-menu {
          position: absolute;
          top: 52px;
          right: 0;
          background: white;
          border-radius: 10px;
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          padding: 8px;
          min-width: 140px;
          z-index: 100;
        }

        .dropdown-menu button {
          width: 100%;
          background: transparent;
          border: none;
          padding: 10px 14px;
          text-align: left;
          font-size: 14px;
          cursor: pointer;
          border-radius: 8px;
        }

        .dropdown-menu button:hover {
          background: #f1f5f9;
        }

        /* ---------- PAGE ---------- */
        .page {
          display: flex;
          justify-content: center;
          padding: 40px 20px;
        }

        .card {
          width: 100%;
          max-width: 800px;
          background: #ffffff;
          padding: 32px;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        textarea {
          width: 100%;
          min-height: 180px;
          margin-top: 16px;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #cbd5f5;
          font-size: 14px;
          resize: vertical;
        }

        textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
          outline: none;
        }

        textarea:disabled {
          background: #f1f5f9;
        }

        button.action {
          margin-top: 16px;
          padding: 12px 20px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
        }

        button.action:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .summary-box {
          margin-top: 28px;
          padding: 20px;
          background: #f1f5f9;
          border-radius: 12px;
          border-left: 4px solid #2563eb;
        }

        .empty {
          margin-top: 20px;
          font-size: 14px;
          color: #64748b;
        }
      `}</style>

      {/* ---------- NAVBAR ---------- */}
      <div className="navbar">
        <div className="logo">TextSummariser</div>

        <div className="nav-right">
          <button className="nav-link" onClick={() => navigate("/history")}>
            History
          </button>

          <div className="user-dropdown" ref={menuRef}>
            <div
              className="user-info"
              onClick={() => setShowMenu(!showMenu)}
            >
              <strong>{user?.userName}</strong>
              <span>{user?.email}</span>
            </div>

            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- PAGE ---------- */}
      <div className="page">
        <div className="card">
          <h2>Summarise your text</h2>
          <p>Paste your content below. Large inputs are handled automatically.</p>

          <textarea
            placeholder="Paste your text here..."
            value={text}
            disabled={loading}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="action" onClick={handleSummarise} disabled={loading}>
            {loading ? "Summarising..." : "Summarise"}
          </button>

          {summary && (
            <div className="summary-box">
              <h4>Summary</h4>
              <p>{summary}</p>
            </div>
          )}

          {!summary && !loading && (
            <p className="empty">Your summary will appear here.</p>
          )}
        </div>
      </div>
    </>
  );
}
