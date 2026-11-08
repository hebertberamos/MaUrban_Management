import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MaUrbanIcon from '../../assets/MaUrban-icon.svg';
import { useAuth } from '../../components/Auth/useAuth';
import './Login.css';

export default function Login() {
  const { status, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  }, [location.state, navigate, status]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(username, password);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <img src={MaUrbanIcon} alt="MaUrban" className="login-logo" />
        <h1>Acessar MaUrban</h1>
        <p>Entre com suas credenciais de administrador.</p>

        <label htmlFor="username">Usuário</label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          autoFocus
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="login-error" role="alert">{error}</p>}

        <button type="submit" disabled={submitting || status === 'loading'}>
          {submitting ? 'Entrando...' : status === 'loading' ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
