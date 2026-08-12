import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { UsersPage } from './pages/UsersPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { supabase } from './services/supabase';
import { useEffect, useState } from 'react';

// Layout para as páginas internas que possuem a Sidebar
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

// Componente para validar se o usuário é autorizado ou não
function RoleProtectedRoute() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email) {
                    // Exemplo: buscando na sua tabela de usuários o papel pelo email
                    const response = await fetch(`http://localhost:3000/api/users`); // Ajuste conforme seu endpoint de usuários
                    const users = await response.json();
                    const currentUser = users.find(u => u.email === session.user.email);
                    
                    setUserRole(currentUser ? currentUser.role : 'não autorizado');
                }
            } catch (error) {
                console.error("Erro ao buscar função do usuário:", error);
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

    // Se a função for 'não autorizado', exibe a tela de espera
    if (userRole === 'não autorizado') {
        return <UnauthorizedPage />;
    }

    return <InternalLayout />;
}

export function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Rota raiz redireciona para o login */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Login sem Sidebar */}
                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* Rotas internas protegidas */}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/*"
                        element={<RoleProtectedRoute />}
                    />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;