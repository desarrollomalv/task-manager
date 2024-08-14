import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { checkSession, subscribeAuthChanges, supabase } from './supabaseClient';
import TaskManager from './TaskManager';
import Login from './login';
import PrivateRoute from './PrivateRoute';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const session = await checkSession();
      setSession(session);
      setLoading(false);
    };

    initializeAuth();
    const unsubscribe = subscribeAuthChanges(setSession);

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    localStorage.setItem('logoutRedirect', 'true');
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      handleLogout();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session]);

  useEffect(() => {
    if (localStorage.getItem('logoutRedirect') === 'true') {
      localStorage.removeItem('logoutRedirect');
      navigate('/login');
    }
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      {session && (
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      )}
      <Routes>
        <Route path="/" element={<PrivateRoute component={TaskManager} session={session} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
