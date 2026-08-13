import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PageHeader } from '../components/PageHeader';
import { BaseModal } from '../components/BaseModal';

export function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'collaborator'
    });

    const fetchUsers = () => {
        setLoading(true);
        api.get('/users')
            .then((res) => {
                setUsers(res.data.data || res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao buscar usuários:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Senha geralmente fica em branco na edição
                role: user.role || 'collaborator'
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'collaborator' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Remove senha vazia se estiver editando para não sobrescrever com vazio
        const payload = { ...formData };
        if (editingUser && !payload.password) {
            delete payload.password;
        }

        const action = editingUser
            ? api.put(`/users/${editingUser.id}`, payload)
            : api.post('/users', payload);

        action
            .then(() => {
                fetchUsers();
                setIsModalOpen(false);
            })
            .catch((err) => console.error("Erro ao salvar usuário:", err));
    };

    const handleDelete = (id) => {
        if (window.confirm("Deseja realmente excluir este usuário?")) {
            api.delete(`/users/${id}`)
                .then(() => fetchUsers())
                .catch((err) => console.error("Erro ao deletar usuário:", err));
        }
    };

    if (loading) return <p className="p-4">Carregando usuários...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 relative">
            <PageHeader 
                title="Gerenciamento de Usuários" 
                buttonText="+ Novo Usuário" 
                onButtonClick={() => handleOpenModal()} 
            />

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {users.map((usr) => (
                        <li key={usr.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 truncate">{usr.name || 'Sem Nome'}</p>
                                <p className="text-sm text-gray-500 break-words">
                                    {usr.email} | Função: <span className="font-medium text-gray-700">{usr.role || 'user'}</span>
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-auto">
                                <button type="button" onClick={() => handleOpenModal(usr)} className="btn-edit">Editar</button>
                                <button type="button" onClick={() => handleDelete(usr.id)} className="btn-delete">Excluir</button>
                            </div>
                        </li>
                    ))}
                    {users.length === 0 && (
                        <p className="p-4 text-center text-gray-500">Nenhum usuário cadastrado.</p>
                    )}
                </ul>
            </div>

            <BaseModal isOpen={isModalOpen} title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Senha {editingUser && <span className="text-xs text-gray-400">(Deixe em branco para não alterar)</span>}
                        </label>
                        <input
                            type="password"
                            required={!editingUser}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Função (Role)</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="input-field"
                        >
                            <option value="collaborator">Collaborator</option>
                            <option value="admin">Admin</option>
                        </select>
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