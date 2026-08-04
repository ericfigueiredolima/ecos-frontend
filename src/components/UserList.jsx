import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para o Modal / Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });

  const fetchUsers = () => {
    setLoading(true);
    api.get('/users')
      .then((response) => {
        setUsers(response.data.data || response.data);
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
        role: user.role || ''
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      // Atualizar (PUT)
      api.put(`/users/${editingUser.id}`, formData)
        .then(() => {
          fetchUsers();
          handleCloseModal();
        })
        .catch((err) => console.error("Erro ao atualizar usuário:", err));
    } else {
      // Criar (POST)
      api.post('/users', formData)
        .then(() => {
          fetchUsers();
          handleCloseModal();
        })
        .catch((err) => console.error("Erro ao criar usuário:", err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      api.delete(`/users/${id}`)
        .then(() => {
          fetchUsers();
        })
        .catch((err) => console.error("Erro ao deletar usuário:", err));
    }
  };

  if (loading) return <p className="p-4">Carregando usuários...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Usuários Cadastrados</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Novo Usuário
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email} | Função: {user.role || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenModal(user)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
          {users.length === 0 && (
            <p className="p-4 text-center text-gray-500">Nenhum usuário cadastrado.</p>
          )}
        </ul>
      </div>

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </h3>
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função (Role)</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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