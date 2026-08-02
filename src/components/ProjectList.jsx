import React, { useEffect, useState } from 'react';
import api from '../services/api';

export function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then((response) => {
        setProjects(response.data.data || response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar projetos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Carregando projetos...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Projetos Cadastrados</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {projects.map((proj) => (
            <li key={proj.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">{proj.title}</p>
                <p className="text-sm text-gray-500">{proj.description}</p>
                <p className="text-xs text-gray-400 mt-1">Status: {proj.status} | Início: {proj.start_date}</p>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-medium">
                ID: {proj.id}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}