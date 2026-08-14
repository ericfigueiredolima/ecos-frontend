import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BaseModal } from '../components/BaseModal';

export function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', position: '' });

  const fetchEmployees = () => {
    setLoading(true);
    api.get('/employees')
      .then((res) => { setEmployees(res.data.data || res.data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleOpenModal = (emp = null) => {
    setEditingEmployee(emp);
    setFormData(emp ? { full_name: emp.full_name, email: emp.email || '', phone: emp.phone || '', position: emp.position || '' } : { full_name: '', email: '', phone: '', position: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingEmployee 
      ? api.put(`/employees/${editingEmployee.id}`, formData)
      : api.post('/employees', formData);

    request.then(() => { fetchEmployees(); setIsModalOpen(false); });
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir?")) {
      api.delete(`/employees/${id}`).then(fetchEmployees);
    }
  };

  if (loading) return <p className="p-4">Carregando funcionários...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 relative">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Funcionários Cadastrados</h2>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {employees.map((emp) => (
            <li key={emp.id} className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 truncate">{emp.full_name}</p>
                <p className="text-sm text-gray-500">{emp.email} | Cargo: <span className="text-gray-700 font-medium">{emp.position}</span></p>
              </div>
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button onClick={() => handleOpenModal(emp)} className="btn-edit">Editar</button>
                <button onClick={() => handleDelete(emp.id)} className="btn-delete">Excluir</button>
              </div>
            </li>
          ))}
          {employees.length === 0 && (
            <p className="p-4 text-center text-gray-500">Nenhum funcionário cadastrado.</p>
          )}
        </ul>
      </div>

      {/* Botão Flutuante (FAB) */}
      <button 
        type="button"
        onClick={() => handleOpenModal()} 
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-28 md:h-28 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl md:rounded-3xl shadow-2xl flex items-center justify-center text-3xl md:text-6xl font-light transition-all duration-200 hover:scale-105 active:scale-95"
        title="Novo Funcionário"
      >
        +
      </button>

      <BaseModal isOpen={isModalOpen} title={editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="input-field" />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}