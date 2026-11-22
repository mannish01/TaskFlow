import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-slate-400">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
