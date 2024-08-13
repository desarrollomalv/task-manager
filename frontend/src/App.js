// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { checkSession, subscribeAuthChanges, supabase } from './supabaseClient'; // Asegúrate de importar supabase
import TaskManager from './TaskManager';
import Login from './login';
import PrivateRoute from './PrivateRoute';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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
    localStorage.setItem('logoutRedirect', 'true');
    window.location.href = '/login'; // Redirige al login después de cerrar sesión
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Aquí puedes agregar un mensaje de advertencia si es necesario
      // event.preventDefault();
      // event.returnValue = '';

      // Ejecutar la función de logout
      handleLogout();
    };

    // Escuchar el evento beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Limpiar el evento cuando el componente se desmonta
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session]);

  useEffect(() => {
    if (localStorage.getItem('logoutRedirect') === 'true') {
      localStorage.removeItem('logoutRedirect');
      window.location.href = '/login';
    }
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
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
    </Router>
  );
}

export default App;
