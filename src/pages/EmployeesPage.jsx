import { EmployeeList } from '../components/EmployeeList';

export function EmployeesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Funcionários</h1>
      <EmployeeList />
    </div>
  );
}