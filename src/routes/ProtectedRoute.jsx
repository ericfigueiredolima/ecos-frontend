import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

export function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      // 1. Verifica erros tanto nos parâmetros normais quanto no hash (#) da URL
      const searchParams = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.replace('#', '?'));

      if (searchParams.get('error') || hashParams.get('error')) {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        return;
      }

      // 2. Caso contrário, valida a sessão normalmente
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    }
    checkAuth();
  }, [location]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}