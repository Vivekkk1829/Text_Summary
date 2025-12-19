import { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export default function Summarise({ user }) {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarise = async () => {
    if (!text.trim()) {
      alert("Enter some text to summarise")
      return;
    }

    try {
      setLoading(true);
      setSummary("");

      const response = await axios.post(
        `${BASE_URL}/api/summarise`,
        { text },
        {
          withCredentials: true, 
        }
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

          .user-info {
            text-align: right;
            font-size: 13px;
          }

          .user-info strong {
            display: block;
            font-size: 14px;
          }

          .user-info span {
            color: #64748b;
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

          .card h2 {
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 24px;
          }

          .card p {
            margin-top: 0;
            color: #64748b;
            font-size: 14px;
          }

          textarea {
            width: 100%;
            min-height: 180px;
            margin-top: 16px;
            padding: 14px;
            border-radius: 10px;
            border: 1px solid #cbd5f5;
            font-size: 14px;
            outline: none;
            resize: vertical;
          }

          textarea:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
          }

          textarea::placeholder {
            color: #94a3b8;
          }

          button {
            margin-top: 16px;
            padding: 12px 20px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
          }

          button:hover {
            background: #1d4ed8;
          }

          button:disabled {
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

          .summary-box h4 {
            margin-top: 0;
            margin-bottom: 8px;
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

        <div className="user-info">
          <strong>{user.userName}</strong>
          <span>{user.email}</span>
        </div>
      </div>

      {/* ---------- PAGE ---------- */}
      <div className="page">
        <div className="card">
          <h2>Summarise your text</h2>
          <p>Paste your content below and get a concise summary.</p>

          <textarea
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button onClick={handleSummarise} disabled={loading}>
            {loading ? "Summarising..." : "Summarise"}
          </button>

          {summary && (
            <div className="summary-box">
              <h4>Summary</h4>
              <p>{summary}</p>
            </div>
          )}

          {!summary && !loading && (
            <p className="empty">
              Your summary will appear here after processing.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
