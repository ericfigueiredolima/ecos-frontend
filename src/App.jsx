import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { UsersPage } from './pages/UsersPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ProjectsPage } from './pages/ProjectsPage';

export function App() {
  return (
    <BrowserRouter>
      {/* Container principal flexível em linha (Sidebar à esquerda, Conteúdo à direita) */}
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
    </BrowserRouter>
  );
}

export default App;