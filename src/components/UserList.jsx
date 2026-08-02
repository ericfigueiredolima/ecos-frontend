import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Note o uso de 'export function' para casar com a importação { UserList }
export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users')
      .then((response) => {
        setUsers(response.data.data || response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar usuários:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center p-4">Carregando usuários...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Usuários cadastrados (Supabase)</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium">
                {user.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}