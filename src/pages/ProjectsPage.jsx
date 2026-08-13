import { ProjectList } from '../components/ProjectList';
import { ProjectEmployeeList } from '../components/ProjectEmployeeList';

export function ProjectsPage() {
  return (
    <div className="p-4 space-y-6">
      <ProjectList />
    </div>
  );
}