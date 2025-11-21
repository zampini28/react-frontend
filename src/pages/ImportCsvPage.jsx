import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FiUploadCloud, FiFile, FiArrowLeft } from 'react-icons/fi';

import styles from './ImportCsvPage.module.css';

function ImportCsvPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Por favor, selecione um arquivo .csv para enviar.");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await api.post('/ordens-servico/importar-csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert("Arquivo enviado com sucesso! A importação será processada.");
            navigate('/');
        } catch (error) {
            console.error("Erro ao importar CSV:", error);
            const errorMsg = error.response?.data?.detail || "Falha na importação. Verifique o console.";
            alert(`Erro: ${errorMsg}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h2>Importar Ordens de Serviço (CSV)</h2>
                <Link to="/" className={styles.backButton}>
                    <FiArrowLeft /> Voltar ao Dashboard
                </Link>
            </header>

            <div className={styles.card}>
                <form onSubmit={handleSubmit}>
                    <p className={styles.instructions}>
                        Selecione um arquivo .csv para importação em massa.
                        O arquivo deve conter as colunas:
                        <strong>protocol, so_number, type, status, recipient_name, cpf, provider, priority, description</strong>
                    </p>

                    <label
                        htmlFor="file-upload"
                        className={styles.fileDropArea}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            hidden
                        />
                        <FiUploadCloud />
                        <span>Arraste e solte o arquivo aqui, ou clique para selecionar.</span>
                    </label>

                    {selectedFile && (
                        <div className={styles.filePreview}>
                            <FiFile /> {selectedFile.name}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? "Enviando..." : "Iniciar Importação"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ImportCsvPage;