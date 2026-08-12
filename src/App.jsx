import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { UsersPage } from './pages/UsersPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleProtectedRoute } from './routes/RoleProtectedRoute';

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