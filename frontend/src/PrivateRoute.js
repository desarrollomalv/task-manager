// PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkSession } from './supabaseClient'; // Asegúrate de importar checkSession

function PrivateRoute({ component: Component, session }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      const currentSession = await checkSession();
      setIsAuthenticated(!!currentSession);
      setLoading(false);
    };

    verifySession();
  }, [session]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Component />;
}

export default PrivateRoute;
