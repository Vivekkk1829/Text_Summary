import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function History({ user }) {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ---------- FETCH FULL HISTORY ----------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/getSummaries`,
          { withCredentials: true }
        );
        setSummaries(response.data.summaries);
      } catch (error) {
        console.error(error);
        alert("Failed to load summary history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      {/* ---------- STYLES ---------- */}
      <style>{`
        body {
          font-family: Inter, system-ui, sans-serif;
          background: #f8fafc;
        }

        .navbar {
          height: 64px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
        }

        .logo {
          font-size: 18px;
          font-weight: 600;
          color: #2563eb;
          cursor: pointer;
        }

        .page {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .summary-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          border-left: 4px solid #2563eb;
        }

        .meta {
          font-size: 12px;
          color: #64748b;
        }

        .empty {
          text-align: center;
          color: #64748b;
          margin-top: 40px;
        }
      `}</style>

      {/* ---------- NAVBAR ---------- */}
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          TextSummariser
        </div>
        <div>
          <strong>{user?.userName}</strong>
        </div>
      </div>

      {/* ---------- PAGE ---------- */}
      <div className="page">
        <button onClick={() => navigate("/summarise")}>← Back</button>

        <h2>Summary History</h2>

        {loading && <p>Loading summaries...</p>}

        {!loading && summaries.length === 0 && (
          <p className="empty">No summaries found</p>
        )}

        {!loading &&
          summaries.map((item, index) => (
            <div className="summary-card" key={index}>
              <p>{item.summary}</p>
              <div className="meta">
                {item.strategy} · {item.chunks} chunk(s) ·{" "}
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
