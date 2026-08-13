import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { UsersPage } from './pages/UsersPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleProtectedRoute } from './routes/RoleProtectedRoute';
import { ProjectsCalendarPage } from './pages/ProjectsCalendarPage';

// Layout interno que mantém a Sidebar e o estilo responsivo
function InternalLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative overflow-x-hidden">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-y-auto w-full max-w-full">
                {children}
            </main>
        </div>
    );
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

                {/* Rotas internas protegidas por autenticação */}
                <Route element={<ProtectedRoute />}>
                    
                    {/* Rotas exclusivas para ADMIN */}
                    <Route
                        path="/users"
                        element={
                            <RoleProtectedRoute allowedRoles={['admin']}>
                                <InternalLayout><UsersPage /></InternalLayout>
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/employees"
                        element={
                            <RoleProtectedRoute allowedRoles={['admin']}>
                                <InternalLayout><EmployeesPage /></InternalLayout>
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <RoleProtectedRoute allowedRoles={['admin']}>
                                <InternalLayout><ProjectsPage /></InternalLayout>
                            </RoleProtectedRoute>
                        }
                    />

                    {/* Rota acessível para admin e collaborator */}
                    <Route
                        path="/calendar"
                        element={
                            <RoleProtectedRoute allowedRoles={['admin', 'collaborator']}>
                                <InternalLayout><ProjectsCalendarPage /></InternalLayout>
                            </RoleProtectedRoute>
                        }
                    />

                    {/* Redirecionamento padrão caso digitem uma rota inválida logado */}
                    <Route path="*" element={<Navigate to="/calendar" replace />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;