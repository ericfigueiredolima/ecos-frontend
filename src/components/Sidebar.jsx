import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // Expandido/recolhido no desktop
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Gaveta no mobile
  const [userEmail, setUserEmail] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Usuários', path: '/users', icon: '👤' },
    { name: 'Funcionários', path: '/employees', icon: '👥' },
    { name: 'Projetos', path: '/projects', icon: '📁' },
    { name: 'Agenda', path: '/calendar', icon: '📅' },
  ];

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
    <>
      {/* Botão flutuante do menu hamburguer para celular (fica visível apenas no mobile quando a barra está fechada) */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
          title="Abrir menu"
        >
          <span className="text-xl">☰</span>
        </button>
      </div>

      {/* Overlay escuro de fundo quando o menu mobile estiver aberto */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar principal */}
      <aside 
        className={`
          bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col justify-between z-50
          fixed inset-y-0 left-0 shadow-2xl md:shadow-none
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
          md:relative md:translate-x-0
          ${isOpen ? 'md:w-64' : 'md:w-20'}
          min-h-screen
        `}
      >
        <div>
          {/* Cabeçalho no Desktop (Botão de recolher/expandir) */}
          <div className="hidden md:flex items-center justify-between p-4 border-b border-slate-800">
            {isOpen && <span className="font-bold text-white text-lg tracking-wide">ECOS</span>}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-auto cursor-pointer"
              title={isOpen ? "Recolher menu" : "Expandir menu"}
            >
              {isOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* Cabeçalho no Mobile (Botão para fechar a gaveta) */}
          <div className="flex md:hidden items-center justify-between p-4 border-b border-slate-800">
            <span className="font-bold text-white text-lg tracking-wide">ECOS</span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              ✕
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
                  onClick={() => setIsMobileOpen(false)} // Fecha automaticamente ao navegar no celular
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {(isOpen || isMobileOpen) && <span className="text-sm truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé do Menu */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {(isOpen || isMobileOpen) && userEmail && (
            <div className="text-xs text-slate-400 truncate" title={userEmail}>
              <span className="block text-slate-500 font-semibold mb-0.5">Conectado como:</span>
              <span className="text-slate-200 truncate block">{userEmail}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium cursor-pointer ${
              (!isOpen && !isMobileOpen) && 'justify-center'
            }`}
            title="Desconectar"
          >
            <span>🚪</span>
            {(isOpen || isMobileOpen) && <span>Desconectar</span>}
          </button>

          <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-800/50">
            {(isOpen || isMobileOpen) ? 'v1.0.0' : 'v1'}
          </div>
        </div>
      </aside>
    </>
  );
}