import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BaseModal } from '../components/BaseModal';

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

    const handleToggle = (id, field) => {
        const currentIds = formData[field];
        const updatedIds = currentIds.includes(id)
            ? currentIds.filter(item => item !== id)
            : [...currentIds, id];
        setFormData({ ...formData, [field]: updatedIds });
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
                setIsModalOpen(false);
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
        <div className="max-w-4xl mx-auto p-4 pb-24 relative">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Projetos Cadastrados</h2>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {projects.map((proj) => {
                        const totalLinked = (proj.employees?.length || 0) + (proj.users?.length || 0);

                        return (
                            <li key={proj.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 truncate">{proj.title}</p>
                                    <p className="text-sm text-gray-500 break-words">
                                        Status: <span className="font-medium text-gray-700">{proj.status || 'N/A'}</span> | Envolvidos vinculados: {totalLinked}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 self-end sm:self-auto">
                                    <button type="button" onClick={() => handleOpenModal(proj)} className="btn-edit">Editar</button>
                                    <button type="button" onClick={() => handleDelete(proj.id)} className="btn-delete">Excluir</button>
                                </div>
                            </li>
                        );
                    })}
                    {projects.length === 0 && (
                        <p className="p-4 text-center text-gray-500">Nenhum projeto cadastrado.</p>
                    )}
                </ul>
            </div>

            {/* Botão Flutuante (FAB) */}
            <button 
                type="button"
                onClick={() => handleOpenModal()} 
                className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-28 md:h-28 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-center text-3xl md:text-6xl font-light transition-all duration-200 hover:scale-105 active:scale-95"
                title="Novo Projeto"
            >
                +
            </button>

            <BaseModal isOpen={isModalOpen} title={editingProject ? 'Editar Projeto' : 'Novo Projeto'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input-field"
                            rows="2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <input
                            type="text"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Funcionários Vinculados */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Funcionários Vinculados</label>
                        <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-gray-50">
                            {employees.map((emp) => (
                                <label key={emp.id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-1.5 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.employee_ids.includes(emp.id)}
                                        onChange={() => handleToggle(emp.id, 'employee_ids')}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>{emp.full_name} <span className="text-xs text-gray-400">({emp.position})</span></span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Usuários Vinculados */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Usuários Vinculados</label>
                        <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-gray-50">
                            {users.map((usr) => (
                                <label key={usr.id} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-white p-1.5 rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={formData.user_ids.includes(usr.id)}
                                        onChange={() => handleToggle(usr.id, 'user_ids')}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>{usr.name || usr.email} <span className="text-xs text-gray-400">({usr.role || 'user'})</span></span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
                        <button type="submit" className="btn-primary">Salvar</button>
                    </div>
                </form>
            </BaseModal>
        </div>
    );
}