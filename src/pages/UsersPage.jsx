import React, { useEffect } from 'react';
import { UserList } from '../components/UserList';
import { supabase } from '../services/supabase';

export function UsersPage() {
  useEffect(() => {
    async function syncUserWithBackend() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

        const response = await fetch(`${backendUrl}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.user_metadata?.full_name || user.email,
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
      <UserList />
    </div>
  );
}