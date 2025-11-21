import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

import styles from './LoginPage.module.css';

function ResetPasswordPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = useRef({});
  password.current = watch("new_password", "");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const onSubmit = async (data) => {
    if (!uid || !token) {
      alert("Link de redefinição inválido ou incompleto.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/password-reset/confirm/', {
        uid: uid,
        token: token,
        new_password: data.new_password
      });
      
      alert("Senha redefinida com sucesso!");
      navigate('/login');

    } catch (error) {
      console.error(error);
      alert("Falha ao redefinir a senha. O link pode ser inválido ou ter expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <h2>Link Inválido</h2>
          <p className={styles.subtitle}>
            Este link de redefinição de senha é inválido ou expirou. 
            Por favor, solicite um novo link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
        <div className={styles.formIcon}>
          <FiLock />
        </div>

        <h2>Definir Nova Senha</h2>
        <p className={styles.subtitle}>
          Digite sua nova senha.
        </p>

        {/* nova senha */}
        <div className={styles.inputGroup}>
          <label htmlFor="new_password">Nova Senha</label>
          <div className={styles.inputField}>
            <FiLock className={styles.icon} />
            <input
              id="new_password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('new_password', { 
                required: 'A nova senha é obrigatória',
                minLength: { value: 8, message: 'Senha deve ter pelo menos 8 caracteres' }
              })}
            />
            {showPassword ? (
              <FiEyeOff className={`${styles.icon} ${styles.iconRight}`} onClick={() => setShowPassword(false)} />
            ) : (
              <FiEye className={`${styles.icon} ${styles.iconRight}`} onClick={() => setShowPassword(true)} />
            )}
          </div>
          {errors.new_password && <span className={styles.errorMessage}>{errors.new_password.message}</span>}
        </div>

        {/* confirmar nova senha */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirm_password">Confirmar Nova Senha</label>
          <div className={styles.inputField}>
            <FiLock className={styles.icon} />
            <input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              {...register('confirm_password', { 
                required: 'Confirme a nova senha',
                validate: value => 
                  value === password.current || "As senhas não conferem"
              })}
            />
          </div>
          {errors.confirm_password && <span className={styles.errorMessage}>{errors.confirm_password.message}</span>}
        </div>

        <button type="submit" className={styles.loginButton} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Nova Senha"}
        </button>
      </form>

      <footer className={styles.footer}>
        © 2025 Sistema OS. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default ResetPasswordPage;
