import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para o Modal / Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    position: ''
  });

  const fetchEmployees = () => {
    setLoading(true);
    api.get('/employees')
      .then((response) => {
        setEmployees(response.data.data || response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar funcionários:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || ''
      });
    } else {
      setEditingEmployee(null);
      setFormData({ full_name: '', email: '', phone: '', position: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      // Atualizar (PUT)
      api.put(`/employees/${editingEmployee.id}`, formData)
        .then(() => {
          fetchEmployees();
          handleCloseModal();
        })
        .catch((err) => console.error("Erro ao atualizar funcionário:", err));
    } else {
      // Criar (POST)
      api.post('/employees', formData)
        .then(() => {
          fetchEmployees();
          handleCloseModal();
        })
        .catch((err) => console.error("Erro ao criar funcionário:", err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir este funcionário?")) {
      api.delete(`/employees/${id}`)
        .then(() => {
          fetchEmployees();
        })
        .catch((err) => console.error("Erro ao deletar funcionário:", err));
    }
  };

  if (loading) return <p className="p-4">Carregando funcionários...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Funcionários Cadastrados</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Novo Funcionário
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {employees.map((emp) => (
            <li key={emp.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{emp.full_name}</p>
                <p className="text-sm text-gray-500">{emp.email} | Cargo: {emp.position}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenModal(emp)}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-xs font-medium transition-colors"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
          {employees.length === 0 && (
            <p className="p-4 text-center text-gray-500">Nenhum funcionário cadastrado.</p>
          )}
        </ul>
      </div>

      {/* Modal de Cadastro / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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