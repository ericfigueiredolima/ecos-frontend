import { UserList } from '../components/UserList';

export function UsersPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
      <UserList />
    </div>
  );
}