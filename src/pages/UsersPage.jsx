import React, { useEffect } from 'react';
import { UserList } from '../components/UserList';
import { supabase } from '../services/supabase';

export function UsersPage() {
  useEffect(() => {
    async function syncUserWithBackend() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const response = await fetch('http://localhost:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.user_metadata?.full_name || user.email, // Tentando 'name' que é comum em APIs
            email: user.email,
            role: 'não autorizado',
          }),
        });

        const data = await response.json();
        console.log('Resposta do cadastro no backend:', data);
      } catch (error) {
        console.error('Erro ao registrar usuário no backend:', error);
      }
    }

    syncUserWithBackend();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
      <UserList />
    </div>
  );
}