import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { UsersPage } from './pages/UsersPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleProtectedRoute } from './routes/RoleProtectedRoute';
import { ProjectsCalendarPage } from './pages/ProjectsCalendarPage';

// No seu App.jsx, altere o main para incluir pt-16 ou pt-20:
function InternalLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative overflow-x-hidden">
            <Sidebar />

            {/* Adicionado pt-16 para dar espaço ao botão flutuante do menu no mobile */}
            <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-y-auto w-full max-w-full">
                <Routes>
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/calendar" element={<ProjectsCalendarPage />} />
                </Routes>
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