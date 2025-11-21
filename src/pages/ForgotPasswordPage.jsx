import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import styles from './LoginPage.module.css';

function ForgotPasswordPage() {
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.post('/auth/password-reset/', { email: data.email });

            setIsSubmitted(true);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setIsSubmitted(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>

            {isSubmitted ? (
                <div className={styles.loginForm}>
                    <div className={styles.formIcon} style={{ color: '#28a745' }}>
                        <FiCheckCircle />
                    </div>
                    <h2 style={{ marginBottom: '1rem' }}>Verifique seu e-mail</h2>
                    <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
                        Se uma conta com o e-mail fornecido existir,
                        você receberá um link para redefinir sua senha.
                    </p>
                    <Link to="/login" className={styles.backToLoginLink}>
                        <FiArrowLeft /> Voltar para o Login
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
                    <div className={styles.formIcon}>
                        <FiMail />
                    </div>

                    <h2>Esqueceu a senha?</h2>
                    <p className={styles.subtitle}>
                        Digite seu e-mail e enviaremos um link para redefinir sua senha.
                    </p>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">E-mail</label>
                        <div className={styles.inputField}>
                            <FiMail className={styles.icon} />
                            <input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...register('email', { required: true })}
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.loginButton} disabled={isLoading}>
                        {isLoading ? "Enviando..." : "Enviar link"}
                    </button>

                    <div className={styles.signupLink}>
                        Lembrou a senha?{' '}
                        <Link to="/login">Faça o login</Link>
                    </div>
                </form>
            )}

            <footer className={styles.footer}>
                © 2025 Sistema OS. Todos os direitos reservados.
            </footer>
        </div>
    );
}

export default ForgotPasswordPage;