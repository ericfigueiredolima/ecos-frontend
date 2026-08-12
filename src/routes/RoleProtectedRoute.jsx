import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { Sidebar } from '../components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { UsersPage } from '../pages/UsersPage';
import { EmployeesPage } from '../pages/EmployeesPage';
import { ProjectsPage } from '../pages/ProjectsPage';

function InternalLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto">
                <Routes>
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
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
                console.log("LOG - Sessão atual do Supabase:", session);

                if (session?.user?.email) {
                    const userEmail = session.user.email;
                    console.log("LOG - Buscando role para o e-mail:", userEmail);

                    // Trocado .single() por .maybeSingle() para evitar erro 406 caso venha vazio
                    const { data, error } = await supabase
                        .from('users')
                        .select('role')
                        .eq('email', userEmail)
                        .maybeSingle();

                    console.log("LOG - Resposta da query users:", { data, error });

                    if (error || !data) {
                        console.error("Erro ao buscar role no Supabase:", error);
                        setUserRole('não autorizado');
                    } else {
                        console.log("LOG - Role encontrada com sucesso:", data.role);
                        setUserRole(data.role);
                    }
                } else {
                    console.log("LOG - Nenhum e-mail encontrado na sessão.");
                    setUserRole('não autorizado');
                }
            } catch (error) {
                console.error("Erro crítico ao buscar função do usuário:", error);
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