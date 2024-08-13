import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkSession } from './supabaseClient';
import styles from './Login.module.css'; // Importa los estilos como un objeto

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      const session = await checkSession();
      if (session) {
        await supabase.auth.signOut();
      }
    };

    verifySession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Credenciales Incorrectas');
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Tablero FIO</h2>
        <p>Ingrese sus credenciales</p>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
