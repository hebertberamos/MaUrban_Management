import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function ProtectedRoute({ children }) {
  const { status, error, refreshSession } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <main className="auth-loading">Verificando sessão...</main>;
  }

  if (status === 'error') {
    return (
      <main className="auth-loading">
        <p>Não foi possível conectar ao serviço de autenticação: {error.message}</p>
        <button type="button" onClick={refreshSession}>Tentar novamente</button>
      </main>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
