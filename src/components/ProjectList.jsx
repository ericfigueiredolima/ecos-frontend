import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
        start_date: '',
        end_date: '',
        employee_ids: [],
        user_ids: []
    });

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            api.get('/projects'),
            api.get('/employees'),
            api.get('/users')
        ])
            .then(([projRes, empRes, userRes]) => {
                setProjects(projRes.data.data || projRes.data);
                setEmployees(empRes.data.data || empRes.data);
                setUsers(userRes.data.data || userRes.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar dados:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title || '',
                description: project.description || '',
                status: project.status || '',
                start_date: project.start_date ? project.start_date.split('T')[0] : '',
                end_date: project.end_date ? project.end_date.split('T')[0] : '',
                employee_ids: project.employees ? project.employees.map(e => e.id) : [],
                user_ids: project.users ? project.users.map(u => u.id) : []
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                status: '',
                start_date: '',
                end_date: '',
                employee_ids: [],
                user_ids: []
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
    };

    const handleEmployeeToggle = (empId) => {
        const currentIds = formData.employee_ids;
        if (currentIds.includes(empId)) {
            setFormData({ ...formData, employee_ids: currentIds.filter(id => id !== empId) });
        } else {
            setFormData({ ...formData, employee_ids: [...currentIds, empId] });
        }
    };

    const handleUserToggle = (userId) => {
        const currentIds = formData.user_ids;
        if (currentIds.includes(userId)) {
            setFormData({ ...formData, user_ids: currentIds.filter(id => id !== userId) });
        } else {
            setFormData({ ...formData, user_ids: [...currentIds, userId] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            employees: formData.employee_ids,
            users: formData.user_ids
        };

        const action = editingProject
            ? api.put(`/projects/${editingProject.id}`, payload)
            : api.post('/projects', payload);

        action
            .then(() => {
                fetchData();
                handleCloseModal();
            })
            .catch((err) => console.error("Erro ao salvar projeto:", err));
    };

    const handleDelete = (id) => {
        if (window.confirm("Deseja realmente excluir este projeto?")) {
            api.delete(`/projects/${id}`)
                .then(() => fetchData())
                .catch((err) => console.error("Erro ao deletar projeto:", err));
        }
    };

    if (loading) return <p className="p-4">Carregando projetos...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 relative">
            <div className="relative flex items-center justify-center mb-6 pt-2">
                {/* Título centralizado no topo */}
                <h2 className="text-xl font-bold text-gray-800 text-center">
                    Projetos Cadastrados
                </h2>

                {/* Botão de ação (se ele precisar ficar alinhado à direita ou abaixo) */}
                {/* Se quiser que o botão de "Novo Projeto" fique separado, mantenha-o fora deste flex ou abaixo dele */}
            </div>

            <div className="flex justify-end mb-4">
                <button
                    type="button"
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
                >
                    + Novo Projeto
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {projects.map((proj) => {
                        const employeeCount = proj.employees ? proj.employees.length : 0;
                        const userCount = proj.users ? proj.users.length : 0;
                        const totalLinked = employeeCount + userCount;

                        return (
                            <li key={proj.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 truncate">{proj.title}</p>
                                    <p className="text-sm text-gray-500 break-words">
                                        Status: <span className="font-medium text-gray-700">{proj.status || 'N/A'}</span> | Envolvidos vinculados: {totalLinked}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 self-end sm:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenModal(proj)}
                                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(proj.id)}
                                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                    {projects.length === 0 && (
                        <p className="p-4 text-center text-gray-500">Nenhum projeto cadastrado.</p>
                    )}
                </ul>
            </div>

            {/* Modal Flutuante */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] flex flex-col relative my-auto">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 shrink-0">
                            {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <input
                                    type="text"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                                    <input
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                                    <input
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Seção de Funcionários */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Funcionários Vinculados</label>
                                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-gray-50">
                                    {employees.map((emp) => (
                                        <label key={emp.id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-1.5 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.employee_ids.includes(emp.id)}
                                                onChange={() => handleEmployeeToggle(emp.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>{emp.full_name} <span className="text-xs text-gray-400">({emp.position})</span></span>
                                        </label>
                                    ))}
                                    {employees.length === 0 && (
                                        <p className="text-xs text-gray-500 text-center py-2">Nenhum funcionário cadastrado.</p>
                                    )}
                                </div>
                            </div>

                            {/* Seção de Usuários */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Usuários Vinculados (Admin / Collaborator)</label>
                                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-gray-50">
                                    {users.map((usr) => (
                                        <label key={usr.id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-1.5 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.user_ids.includes(usr.id)}
                                                onChange={() => handleUserToggle(usr.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>{usr.name || usr.email} <span className="text-xs text-gray-400">({usr.role || 'user'})</span></span>
                                        </label>
                                    ))}
                                    {users.length === 0 && (
                                        <p className="text-xs text-gray-500 text-center py-2">Nenhum usuário cadastrado.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}