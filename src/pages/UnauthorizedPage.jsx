import React from 'react';
import { supabase } from '../services/supabase';

export function UnauthorizedPage() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-lg text-center border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-amber-400">Acesso Pendente</h2>
        <p className="text-slate-300 mb-6">
          Sua conta foi cadastrada, mas ainda está aguardando o administrador conceder as permissões adequadas para visualizar as telas do sistema.
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Desconectar
        </button>
      </div>
    </div>
  );
}