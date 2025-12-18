import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/auth/check-auth`, {
        withCredentials: true,
      })
      .then((res) => {
        setAuthenticated(true);
        setUser(res.data.user);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return React.cloneElement(children, { user });
}
