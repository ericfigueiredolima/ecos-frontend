import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/employees')
      .then((response) => {
        setEmployees(response.data.data || response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar funcionários:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Carregando funcionários...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Funcionários Cadastrados</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {employees.map((emp) => (
            <li key={emp.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{emp.full_name}</p>
                <p className="text-sm text-gray-500">{emp.email} | Cargo: {emp.position}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
                ID: {emp.id}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}