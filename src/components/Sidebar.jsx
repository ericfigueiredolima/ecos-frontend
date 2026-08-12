import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Usuários', path: '/users', icon: '👤' },
    { name: 'Funcionários', path: '/employees', icon: '👥' },
    { name: 'Projetos', path: '/projects', icon: '📁' },
  ];

  // Busca o usuário logado ao carregar o componente
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro ao sair:', error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <aside 
      className={`bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col min-h-screen justify-between ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div>
        {/* Cabeçalho do Menu / Botão de Retração */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {isOpen && <span className="font-bold text-white text-lg tracking-wide">ECOS</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto cursor-pointer"
            title={isOpen ? "Recolher menu" : "Expandir menu"}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Links de navegação */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white font-medium' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && <span className="text-sm truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé do Menu: Informações do Usuário e Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        {isOpen && userEmail && (
          <div className="text-xs text-slate-400 truncate" title={userEmail}>
            <span className="block text-slate-500 font-semibold mb-0.5">Conectado como:</span>
            <span className="text-slate-200 truncate block">{userEmail}</span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium cursor-pointer ${
            !isOpen && 'justify-center'
          }`}
          title="Desconectar"
        >
          <span>🚪</span>
          {isOpen && <span>Desconectar</span>}
        </button>

        <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-800/50">
          {isOpen ? 'v1.0.0' : 'v1'}
        </div>
      </div>
    </aside>
  );
}