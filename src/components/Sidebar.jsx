import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const logoUrl = "https://static.wixstatic.com/media/0f561c_61ec1382ff654e8e8c25bbd8491f6977~mv2.png/v1/fill/w_1920,h_1080,al_c/0f561c_61ec1382ff654e8e8c25bbd8491f6977~mv2.png";

    useEffect(() => {
        async function fetchUserData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email);

                const { data: userData, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('email', user.email)
                    .single();

                if (!error && userData) {
                    setUserRole(userData.role);
                }
            }
        }
        fetchUserData();
    }, []);

    const allMenuItems = [
        { name: 'Usuários', path: '/users', icon: '👤', roles: ['admin'] },
        { name: 'Funcionários', path: '/employees', icon: '👥', roles: ['admin'] },
        { name: 'Projetos', path: '/projects', icon: '📁', roles: ['admin'] },
        { name: 'Agenda', path: '/calendar', icon: '📅', roles: ['admin', 'collaborator'] },
    ];

    const menuItems = allMenuItems.filter(item =>
        userRole ? item.roles.includes(userRole) : item.path === '/calendar'
    );

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
            {/* Botão flutuante do menu hamburguer para celular */}
            <div className="md:hidden fixed top-4 left-4 z-40">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-3 bg-slate-900/70 backdrop-blur-md text-white rounded-xl shadow-lg hover:bg-slate-900 transition-colors flex items-center justify-center cursor-pointer border border-slate-700/50"
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
                    {/* Cabeçalho no Desktop */}
                    <div className="hidden md:flex items-center justify-between p-4 border-b border-slate-800">
                        {isOpen ? (
                            <div className="flex items-center w-full px-2 py-1">
                                <img 
                                    src={logoUrl} 
                                    alt="ECOS Logo" 
                                    className="h-10 w-full object-contain filter brightness-0 invert"
                                />
                            </div>
                        ) : (
                            <div className="mx-auto">
                                <span className="font-bold text-white text-sm">ECOS</span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1 ${!isOpen && 'hidden'}`}
                            title={isOpen ? "Recolher menu" : "Expandir menu"}
                        >
                            {isOpen ? '◀' : '▶'}
                        </button>
                    </div>

                    {/* Botão de expandir quando recolhido no desktop centralizado */}
                    {!isOpen && (
                        <div className="hidden md:flex justify-center p-2 border-b border-slate-800">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Expandir menu"
                            >
                                ▶
                            </button>
                        </div>
                    )}

                    {/* Cabeçalho no Mobile */}
                    <div className="flex md:hidden items-center justify-between p-4 border-b border-slate-800">
                        <img 
                            src={logoUrl} 
                            alt="ECOS Logo" 
                            className="h-9 w-auto object-contain filter brightness-0 invert"
                        />
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Links de navegação filtrados */}
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-blue-600 text-white font-medium'
                                        : 'hover:bg-slate-800 hover:text-white'
                                        }`}
                                    title={!isOpen ? item.name : ''}
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
                        className={`w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium cursor-pointer ${(!isOpen && !isMobileOpen) && 'justify-center'
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