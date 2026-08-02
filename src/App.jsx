import { UserList } from './components/UserList';
import { EmployeeList } from './components/EmployeeList';
import { ProjectList } from './components/ProjectList';
import { ProjectEmployeeList } from './components/ProjectEmployeeList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">ECOS - Plataforma</h1>
        <p className="text-sm text-gray-500">Conexão Front-end & Back-end - MVP</p>
      </header>
      <main className="w-full space-y-6">
        <UserList />
        <EmployeeList />
        <ProjectList />
        <ProjectEmployeeList />
      </main>
    </div>
  );
}

export default App;