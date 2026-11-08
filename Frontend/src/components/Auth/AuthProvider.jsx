import { useCallback, useEffect, useState } from 'react';
import { getCurrentUser, login as authenticate, logout as endSession } from '../../services/authService';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const refreshSession = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const user = await getCurrentUser();
      setStatus(user ? 'authenticated' : 'unauthenticated');
    } catch (sessionError) {
      setError(sessionError);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((user) => {
        if (active) setStatus(user ? 'authenticated' : 'unauthenticated');
      })
      .catch((sessionError) => {
        if (active) {
          setError(sessionError);
          setStatus('error');
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      setStatus('unauthenticated');
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const signIn = async (username, password) => {
    await authenticate(username, password);
    setStatus('authenticated');
  };

  const signOut = async () => {
    await endSession();
    setStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ status, error, refreshSession, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
