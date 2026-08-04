import { ProjectList } from '../components/ProjectList';
import { ProjectEmployeeList } from '../components/ProjectEmployeeList';

export function ProjectsPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Projetos</h1>
      <ProjectList />
    </div>
  );
}