import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './HomePage.module.css';

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      {}
      <h1 className={styles.title}>
        Bem-vindo, {user ? user.username : 'Usuário'}!
      </h1>
      <p className={styles.text}>Você está logado com sucesso.</p>
      <button onClick={logout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

export default HomePage;
