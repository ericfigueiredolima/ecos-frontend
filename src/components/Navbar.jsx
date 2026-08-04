import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-6">
      <Link to="/" className="hover:underline font-semibold">Usuários</Link>
      <Link to="/employees" className="hover:underline font-semibold">Funcionários</Link>
      <Link to="/projects" className="hover:underline font-semibold">Projetos</Link>
    </nav>
  );
}