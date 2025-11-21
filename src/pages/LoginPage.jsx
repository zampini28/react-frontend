import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiFileText,
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

import styles from './LoginPage.module.css';

function LoginPage() {
  const { register, handleSubmit } = useForm();

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const success = await login(data.username, data.password);
    if (success) {
      navigate('/');
    } else {
      alert('Usuário ou senha inválidos!');
    }
  };

  return (
    <div className={styles.loginContainer}>

      {/* card de login */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>

        <div className={styles.formIcon}>
          <FiFileText />
        </div>

        <h2>Sistema OS</h2>
        <p className={styles.subtitle}>Faça login para acessar suas ordens de serviço</p>

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
          {/* TODO: erro do react-hook-form aqui */}
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
          {/* TODO: erro do react-hook-form aqui */}
        </div>

        {/* lembrar de mim e esqueceu a senha */}
        <div className={styles.formHelpers}>
          <div className={styles.rememberMe}>
            <input
              type="checkbox"
              id="remember"
              {...register('remember')}
            />
            <label htmlFor="remember">Lembrar de mim</label>
          </div>
          <Link to="/forgot-password" className={styles.forgotPassword}>
            Esqueceu a senha?
          </Link>
        </div>

        {/* botão de entrar (submit) */}
        <button type="submit" className={styles.loginButton}>
          Entrar
        </button>

        {/* link de cadastro */}
        <div className={styles.signupLink}>
          Não possui conta?{' '}
          <Link to="/register">Cadastre-se</Link>
        </div>
      </form>

      <footer className={styles.footer}>
        © 2025 Sistema OS. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default LoginPage;