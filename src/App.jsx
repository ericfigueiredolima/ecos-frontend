import { UserList } from './components/UserList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">ECOS - Plataforma</h1>
        <p className="text-sm text-gray-500">Conexão Front-end & Back-end</p>
      </header>
      <main className="w-full">
        <UserList />
      </main>
    </div>
  );
}

export default App;