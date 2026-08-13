// src/components/RoleProtectedRoute.jsx (ou onde ele estiver localizado)
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { Navigate } from 'react-router-dom';

export function RoleProtectedRoute({ children, allowedRoles }) {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user?.email) {
                    const userEmail = session.user.email;
                    const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0];

                    let { data, error } = await supabase
                        .from('users')
                        .select('role')
                        .eq('email', userEmail)
                        .maybeSingle();

                    if (!data && !error) {
                        try {
                            const response = await fetch('http://localhost:3000/api/users', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
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

                    setUserRole(data?.role || 'não autorizado');
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

    // Se foram especificadas roles permitidas e a do usuário não está na lista
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redireciona colaboradores tentando acessar área de admin para a agenda de forma segura
        return <Navigate to="/calendar" replace />;
    }

    return children;
}