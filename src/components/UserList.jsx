import { useEffect, useState } from 'react';
import api from '../services/api';

export function UserList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get('/usuarios')
      .then((response) => {
        if (response.data.success) {
          setUsuarios(response.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setErro('Erro ao carregar dados do servidor.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Carregando dados do servidor...</p>;
  if (erro) return <p className="p-4 text-red-500">{erro}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 my-8 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800">Usuários cadastrados (Supabase)</h2>
      <ul className="divide-y divide-gray-200 text-left">
        {usuarios.map((user) => (
          <li key={user.id} className="py-2 flex justify-between items-center">
            <span className="font-medium text-gray-700">{user.nome}</span>
            <span className="text-xs text-gray-400">ID: {user.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}