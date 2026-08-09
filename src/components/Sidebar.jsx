import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Se estiver usando react-router

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: 'Usuários', path: '/users', icon: '👤' },
    { name: 'Funcionários', path: '/employees', icon: '👥' },
    { name: 'Projetos', path: '/projects', icon: '📁' },
  ];

  return (
    <aside 
      className={`bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col min-h-screen ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Cabeçalho do Menu / Botão de Retração */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {isOpen && <span className="font-bold text-white text-lg tracking-wide">ECOS</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto"
          title={isOpen ? "Recolher menu" : "Expandir menu"}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Links de navegação */}
      <nav className="flex-1 p-4 space-y-2">
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

      {/* Rodapé do Menu (Opcional) */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        {isOpen ? 'v1.0.0' : 'v1'}
      </div>
    </aside>
  );
}