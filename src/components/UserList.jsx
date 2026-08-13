import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mantemos apenas a edição, removendo a criação de novo usuário
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ''
    });

    const fetchUsers = () => {
        setLoading(true);
        api.get('/users')
            .then((res) => {
                setUsers(res.data.data || res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar usuários:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!editingUser) return;

        api.put(`/users/${editingUser.id}`, formData)
            .then(() => {
                fetchUsers();
                handleCloseModal();
            })
            .catch((err) => console.error("Erro ao atualizar usuário:", err));
    };

    const handleDelete = (id) => {
        if (window.confirm("Deseja realmente excluir este usuário?")) {
            api.delete(`/users/${id}`)
                .then(() => fetchUsers())
                .catch((err) => console.error("Erro ao deletar usuário:", err));
        }
    };

    if (loading) return <p className="p-4 text-gray-500">Carregando usuários...</p>;

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            <div className="max-w-4xl mx-auto p-4 relative">
                {/* Cabeçalho alinhado com o botão de menu e centralizado */}
                <div className="relative flex items-center justify-center mb-6 pt-1 md:pt-0">
                    <h2 className="text-xl font-bold text-gray-800 text-center">
                        Gerenciamento de Usuários
                    </h2>
                </div>

                {/* Resto do conteúdo da página... */}
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Usuários Registrados</h2>
                </div>

                <div className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <div key={user.id} className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                                <p className="text-sm text-gray-500 break-words">
                                    {user.email} | Função: <span className="font-medium text-gray-700">{user.role || 'N/A'}</span>
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-auto">
                                <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(user)}
                                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <p className="text-center text-gray-500 py-4">Nenhum usuário registrado.</p>
                    )}
                </div>
            </div>

            {/* Modal apenas para Edição (sem opção de criar) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Editar Usuário</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                <input
                                    type="email"
                                    required
                                    disabled
                                    value={formData.email}
                                    className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                                />
                                <span className="text-xs text-gray-400 mt-1 block">O e-mail é vinculado à conta de login do Google.</span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="collaborator">collaborator</option>
                                    <option value="admin">admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
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