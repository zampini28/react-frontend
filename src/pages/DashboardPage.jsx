import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { format } from 'date-fns';
import {
    FiPlus, FiEdit, FiTrash2, FiUpload, FiX,
    FiChevronLeft, FiChevronRight, FiCheckCircle, FiAlertTriangle,
    FiUser
} from 'react-icons/fi';

import styles from './DashboardPage.module.css';

const TYPE_OPTIONS = [
    { value: 'administrative', label: 'Administrativa' },
    { value: 'installation', label: 'Instalação' },
    { value: 'preventive_maintenance', label: 'Manutenção Preventiva' },
    { value: 'corrective_maintenance', label: 'Manutenção Corretiva' },
    { value: 'predictive_maintenance', label: 'Manutenção Preditiva' },
    { value: 'inspection', label: 'Vistoria' },
    { value: 'technical_assistance', label: 'Assistência Técnica' },
    { value: 'work_safety', label: 'Segurança do Trabalho' },
    { value: 'budget', label: 'Orçamento' },
    { value: 'events', label: 'Eventos' },
];

const STATUS_OPTIONS = [
    { value: 'open', label: 'Aberta' },
    { value: 'in_progress', label: 'Em andamento' },
    { value: 'completed', label: 'Concluída' },
    { value: 'cancelled', label: 'Cancelada' },
];

const INITIAL_FILTERS = {
    search: '',
    status: '',
    type: '',
    data_inicial: '',
    data_final: '',
};

function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [ordens, setOrdens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filters, setFilters] = useState(INITIAL_FILTERS);

    const [pagination, setPagination] = useState({
        count: 0,
        page: 1,
        page_size: 10,
    });

    const fetchOrdens = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.page,
                page_size: pagination.page_size,

                search: filters.search || undefined,
                status: filters.status || undefined,
                type: filters.type || undefined,
                created_at_after: filters.data_inicial || undefined,
                created_at_before: filters.data_final || undefined,
            };

            const response = await api.get('/ordens-servico/', { params });

            setOrdens(response.data.results);
            setPagination(prev => ({
                ...prev,
                count: response.data.count,
            }));

        } catch (error) {
            console.error("Erro ao buscar ordens de serviço:", error);
            alert("Falha ao carregar dados.");
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.page, pagination.page_size]);

    useEffect(() => {
        fetchOrdens();
    }, [fetchOrdens]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleClearFilters = () => {
        setFilters(INITIAL_FILTERS);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= Math.ceil(pagination.count / pagination.page_size)) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja deletar esta O.S.?")) {
            try {
                await api.delete(`/ordens-servico/${id}/`);
                alert("O.S. deletada com sucesso!");
                fetchOrdens();
            } catch (error) {
                console.error("Erro ao deletar O.S.:", error);
                alert("Falha ao deletar.");
            }
        }
    };

    return (
        <div className={styles.pageContainer}>

            {/* 1. cabeçalho da página */}
            <header className={styles.header}>
                <h2>Ordens de Serviço</h2>
                <div className={styles.headerActions}>
                    
                    <Link to="/perfil" className={styles.csvButton}>
                        <FiUser /> Meu Perfil
                    </Link>

                    {user && (
                        <button className={styles.csvButton} onClick={() => navigate('/importar-csv')}>
                            <FiUpload /> Importar CSV
                        </button>
                    )}

                    <Link to="/ordens-servico/novo" className={styles.primaryButton}>
                        <FiPlus /> Nova O.S
                    </Link>
                </div>
            </header>

            {/* 2. card de filtros */}
            <div className={styles.filterCard}>
                <div className={styles.filterGrid}>
                    <SelectFilter
                        label="Status"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        options={STATUS_OPTIONS}
                    />
                    <SelectFilter
                        label="Tipo"
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        options={TYPE_OPTIONS}
                    />
                    <InputFilter
                        label="Data Inicial"
                        name="data_inicial"
                        type="date"
                        value={filters.data_inicial}
                        onChange={handleFilterChange}
                    />
                    <InputFilter
                        label="Data Final"
                        name="data_final"
                        type="date"
                        value={filters.data_final}
                        onChange={handleFilterChange}
                    />
                    <InputFilter
                        label="Número da O.S"
                        name="search"
                        type="text"
                        placeholder="Ex: 2025001"
                        value={filters.search}
                        onChange={handleFilterChange}
                    />
                </div>
                <button onClick={handleClearFilters} className={styles.clearButton}>
                    <FiX /> Limpar filtros
                </button>
            </div>

            {/* 3. tabela de dados */}
            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>NÚMERO O.S</th>
                            <th>TIPO</th>
                            <th>STATUS</th>
                            <th>DATA ABERTURA</th>
                            <th>BENEFICIÁRIO(A)</th>
                            <th>SLA</th>
                            <th>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="7" className={styles.loading}>Carregando...</td></tr>
                        ) : ordens.length === 0 ? (
                            <tr><td colSpan="7" className={styles.empty}>Nenhuma ordem de serviço encontrada.</td></tr>
                        ) : (
                            ordens.map(ordem => (
                                <tr key={ordem.id}>
                                    <td>{ordem.so_number}</td>
                                    <td><Badge text={ordem.type_display} type={ordem.type} /></td>
                                    <td><Badge text={ordem.status_display} type={ordem.status} /></td>
                                    <td>{format(new Date(ordem.created_at), 'dd/MM/yyyy')}</td>
                                    <td>{ordem.recipient_name}</td>
                                    <td><SlaStatus sla={ordem} /></td>
                                    <td className={styles.actions}>
                                        <Link to={`/ordens-servico/editar/${ordem.id}`} title="Editar">
                                            <FiEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(ordem.id)} title="Deletar">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 4. footer com paginação */}
            <PaginationFooter
                pagination={pagination}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

const InputFilter = ({ label, ...props }) => (
    <div className={styles.filterGroup}>
        <label>{label}</label>
        <input {...props} />
    </div>
);

const SelectFilter = ({ label, options, ...props }) => (
    <div className={styles.filterGroup}>
        <label>{label}</label>
        <select {...props}>
            <option value="">Todos</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

const Badge = ({ text, type }) => (
    <span className={`${styles.badge} ${styles[type]}`}>
        {text}
    </span>
);

const SlaStatus = ({ sla }) => {
    const slaDate = format(new Date(sla.due_date), 'dd/MM/yyyy');

    if (sla.sla_status === 'overdue') {
        return (
            <div className={`${styles.sla} ${styles.overdue}`}>
                <span>{slaDate}</span>
                <span><FiAlertTriangle /> Vencido</span>
            </div>
        );
    }

    if (sla.sla_status === 'nearing_due_date') {
        return (
            <div className={`${styles.sla} ${styles.nearing}`}>
                <span>{slaDate}</span>
                <span><FiAlertTriangle /> Próx. vencimento</span>
            </div>
        );
    }

    return (
        <div className={`${styles.sla} ${styles.onTime}`}>
            <span>{slaDate}</span>
            <span><FiCheckCircle /> No prazo</span>
        </div>
    );
};

const returnPaginationRange = (totalPage, page, siblings) => {
    const totalPageNoInArray = 7 + siblings;

    if (totalPageNoInArray >= totalPage) {
        return [...Array(totalPage).keys()].map(n => n + 1);
    }

    const leftSiblingsIndex = Math.max(page - siblings, 1);
    const rightSiblingsIndex = Math.min(page + siblings, totalPage);

    const showLeftDots = leftSiblingsIndex > 2;
    const showRightDots = rightSiblingsIndex < totalPage - 2;

    if (!showLeftDots && showRightDots) {
        const leftItemCount = 3 + 2 * siblings;
        const leftRange = [...Array(leftItemCount).keys()].map(n => n + 1);
        return [...leftRange, '...', totalPage];
    }

    if (showLeftDots && !showRightDots) {
        const rightItemCount = 3 + 2 * siblings;
        const rightRange = [...Array(rightItemCount).keys()].map(n => totalPage - n).reverse();
        return [1, '...', ...rightRange];
    }

    if (showLeftDots && showRightDots) {
        const middleRange = [...Array(rightSiblingsIndex - leftSiblingsIndex + 1).keys()].map(n => leftSiblingsIndex + n);
        return [1, '...', ...middleRange, '...', totalPage];
    }
};

const PaginationFooter = ({ pagination, onPageChange }) => {
    const { count, page, page_size } = pagination;

    if (count === 0) return null;

    const totalPages = Math.ceil(count / page_size);
    const startItem = (page - 1) * page_size + 1;
    const endItem = Math.min(page * page_size, count);

    const arrayPages = returnPaginationRange(totalPages, page, 1);

    return (
        <footer className={styles.footer}>
            <span className={styles.pageInfo}>
                Mostrando {startItem} a {endItem} de {count} resultados
            </span>

            <nav className={styles.pagination} aria-label="Navegação de paginação">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Página anterior"
                    title="Anterior"
                >
                    <FiChevronLeft />
                </button>

                {arrayPages.map((value, idx) => {
                    if (value === '...') {
                        return (
                            <span key={`dots-${idx}`} className={styles.paginationDots}>
                                &#8230;
                            </span>
                        );
                    }

                    return (
                        <button
                            key={value}
                            className={page === value ? styles.active : ''}
                            onClick={() => onPageChange(value)}
                            aria-current={page === value ? 'page' : undefined}
                        >
                            {value}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Próxima página"
                    title="Próximo"
                >
                    <FiChevronRight />
                </button>
            </nav>
        </footer>
    );
};

export default DashboardPage;
