import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { UsersPage } from './pages/UsersPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { ProjectsPage } from './pages/ProjectsPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<UsersPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;