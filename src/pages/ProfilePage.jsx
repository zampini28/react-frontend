import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, FiMail, FiLock, FiSave, FiArrowLeft, FiShield 
} from 'react-icons/fi';

import styles from './ProfilePage.module.css';

function ProfilePage() {
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    reset: resetProfile,
    setError: setProfileError,
    formState: { errors: profileErrors, isSubmitting: isSavingProfile } 
  } = useForm();

  const { 
    register: registerPass, 
    handleSubmit: handleSubmitPass, 
    reset: resetPass,
    setError: setPassError,
    formState: { errors: passErrors, isSubmitting: isSavingPass } 
  } = useForm();

  const { user } = useAuth(); 

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get('/auth/user/');
        resetProfile({
          username: response.data.username,
          email: response.data.email,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        });
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
        alert("Erro ao carregar dados do usuário.");
      }
    }
    loadProfile();
  }, [resetProfile]);

  const onSubmitProfile = async (data) => {
    try {
      await api.patch('/auth/user/', data);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      
      if (error.response && error.response.data) {
        Object.keys(error.response.data).forEach((field) => {
          setProfileError(field, { 
            type: 'manual', 
            message: error.response.data[field][0] 
          });
        });
      } else {
        alert("Erro ao atualizar perfil.");
      }
    }
  };

  const onSubmitPassword = async (data) => {
    if (data.new_password !== data.confirm_new_password) {
        setPassError('confirm_new_password', { type: 'manual', message: 'As senhas não conferem.' });
        return;
    }

    try {
      await api.put('/auth/change-password/', {
        old_password: data.old_password,
        new_password: data.new_password
      });
      
      alert("Senha alterada com sucesso!");
      resetPass();
    } catch (error) {
      console.error("Erro ao alterar senha:", error);

      if (error.response && error.response.data) {
        Object.keys(error.response.data).forEach((field) => {
          setPassError(field, { 
            type: 'manual', 
            message: error.response.data[field][0] 
          });
        });
      } else {
        alert("Erro ao alterar senha.");
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair do sistema?")) {
      logout();
      navigate('/login');
    }
  }

  return (
    <div className={styles.pageContainer}>
      
      <header className={styles.header}>
        <div>
          <h2>Minha Conta</h2>
          <p>Gerencie suas informações pessoais e segurança</p>
        </div>
        
        <div className={styles.headerActions}>
          
          <button onClick={handleLogout} className={styles.logoutButton}>
            <FiLogOut /> Sair
          </button>

          <Link to="/" className={styles.backButton}>
            <FiArrowLeft /> Voltar ao Dashboard
          </Link>
        </div>
      </header>

      <div className={styles.contentGrid}>
        
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <FiUser className={styles.cardIcon} />
            <h3>Dados Pessoais</h3>
          </div>
          
          <form onSubmit={handleSubmitProfile(onSubmitProfile)}>

            <InputGroup label="E-mail" error={profileErrors.email}>
              <div className={styles.inputWithIcon}>
                <FiMail />
                <input type="email" {...registerProfile('email', { required: 'E-mail é obrigatório' })} />
              </div>
            </InputGroup>

            <InputGroup label="Nome de Usuário" error={profileErrors.username}>
              <div className={styles.inputWithIcon}>
                <FiUser />
                <input type="text" {...registerProfile('username', { required: 'Username é obrigatório' })} />
              </div>
            </InputGroup>

            <button type="submit" className={styles.primaryButton} disabled={isSavingProfile}>
              <FiSave /> {isSavingProfile ? "Salvando..." : "Atualizar Perfil"}
            </button>
          </form>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <FiShield className={styles.cardIcon} />
            <h3>Alterar Senha</h3>
          </div>
          
          <form onSubmit={handleSubmitPass(onSubmitPassword)}>
            <InputGroup label="Senha Atual" error={passErrors.old_password}>
              <div className={styles.inputWithIcon}>
                <FiLock />
                <input 
                  type="password" 
                  placeholder="Digite sua senha atual"
                  {...registerPass('old_password', { required: 'Senha atual é obrigatória' })} 
                />
              </div>
            </InputGroup>

            <hr className={styles.divider} />

            <InputGroup label="Nova Senha" error={passErrors.new_password}>
              <div className={styles.inputWithIcon}>
                <FiLock />
                <input 
                  type="password" 
                  placeholder="Mínimo de 8 caracteres"
                  {...registerPass('new_password', { required: 'Nova senha é obrigatória' })} 
                />
              </div>
            </InputGroup>

            <InputGroup label="Confirmar Nova Senha" error={passErrors.confirm_new_password}>
              <div className={styles.inputWithIcon}>
                <FiLock />
                <input 
                  type="password" 
                  placeholder="Repita a nova senha"
                  {...registerPass('confirm_new_password', { required: 'Confirmação é obrigatória' })} 
                />
              </div>
            </InputGroup>

            <button type="submit" className={`${styles.primaryButton} ${styles.outline}`} disabled={isSavingPass}>
              <FiSave /> {isSavingPass ? "Alterando..." : "Definir Nova Senha"}
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}

const InputGroup = ({ label, children, error }) => (
  <div className={styles.inputGroup}>
    <label>{label}</label>
    {children}
    {error && <span className={styles.errorMessage}>{error.message}</span>}
  </div>
);

export default ProfilePage;
