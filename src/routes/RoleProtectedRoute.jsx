import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { Sidebar } from '../components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { UsersPage } from '../pages/UsersPage';
import { EmployeesPage } from '../pages/EmployeesPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectsCalendarPage } from '../pages/ProjectsCalendarPage'; // <- 1. Importação da página de agenda

function InternalLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
                <Routes>
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/calendar" element={<ProjectsCalendarPage />} /> {/* <- 2. Rota adicionada */}
                </Routes>
            </main>
        </div>
    );
}

export function RoleProtectedRoute() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user?.email) {
                    const userEmail = session.user.email;
                    const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0];

                    // 1. Tenta buscar o usuário na tabela public.users
                    let { data, error } = await supabase
                        .from('users')
                        .select('role')
                        .eq('email', userEmail)
                        .maybeSingle();

                    // 2. Se o usuário não existe, cadastra chamando a API do backend
                    if (!data && !error) {
                        console.log("Usuário não encontrado. Cadastrando via backend...");
                        try {
                            const response = await fetch('http://localhost:3000/api/users', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    name: userName,
                                    email: userEmail,
                                    role: 'não autorizado'
                                })
                            });

                            const result = await response.json();
                            if (result.success) {
                                data = { role: 'não autorizado' };
                            }
                        } catch (apiError) {
                            console.error("Erro ao cadastrar usuário no backend:", apiError);
                        }
                    }

                    if (!data) {
                        setUserRole('não autorizado');
                    } else {
                        setUserRole(data.role);
                    }
                } else {
                    setUserRole('não autorizado');
                }
            } catch (error) {
                console.error("Erro crítico ao gerenciar função do usuário:", error);
                setUserRole('não autorizado');
            } finally {
                setLoading(false);
            }
        }

        fetchUserRole();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando permissões...</div>;
    }

    if (userRole === 'não autorizado' || !userRole) {
        return <UnauthorizedPage />;
    }

    return <InternalLayout />;
}