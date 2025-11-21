import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiFileText,
  FiUser,
  FiAtSign,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

import styles from './RegisterPage.module.css';

function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register/', data);
      alert('Usuário cadastrado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro no cadastro', error);
      alert('Erro ao cadastrar usuário. Verifique os dados.');
    }
  };

  return (
    <div className={styles.loginContainer}>

      {/* card de cadastro */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>

        <div className={styles.formIcon}>
          <FiFileText />
        </div>

        <h2>Crie sua Conta</h2>
        <p className={styles.subtitle}>Preencha os dados para se cadastrar</p>

        {/* campo usuário (username) */}
        <div className={styles.inputGroup}>
          <label htmlFor="username">Usuário</label>
          <div className={styles.inputField}>
            <FiUser className={styles.icon} />
            <input
              id="username"
              type="text"
              placeholder="seu.usuario"
              {...register('username', { required: true })}
            />
          </div>
        </div>

        {/* campo email (email) */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <div className={styles.inputField}>
            <FiAtSign className={styles.icon} />
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email', { required: true })}
            />
          </div>
        </div>

        {/* campo senha (password) */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <div className={styles.inputField}>
            <FiLock className={styles.icon} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', { required: true })}
            />
            {showPassword ? (
              <FiEyeOff
                className={`${styles.icon} ${styles.iconRight}`}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FiEye
                className={`${styles.icon} ${styles.iconRight}`}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        </div>

        {/* botão de cadastrar (submit) */}
        <button type="submit" className={styles.loginButton}>
          Cadastrar
        </button>

        {/* link de login */}
        <div className={styles.signupLink}>
          Já tem uma conta?{' '}
          <Link to="/login">Faça o login</Link>
        </div>
      </form>

      <footer className={styles.footer}>
        © 2025 Sistema OS. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default RegisterPage;