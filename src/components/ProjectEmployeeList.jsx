import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function ProjectEmployeeList() {
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/project-employees')
      .then((response) => {
        setRelations(response.data.data || response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar associações:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Carregando associações...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Associações (Projeto x Funcionário)</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {relations.map((rel) => (
            <li key={rel.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Projeto: {rel.projects?.title || rel.project_id}</p>
                <p className="text-sm text-gray-500">Funcionário: {rel.employees?.full_name || rel.employee_id}</p>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2.5 py-1 rounded-full font-medium">
                Relação ID: {rel.id}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}