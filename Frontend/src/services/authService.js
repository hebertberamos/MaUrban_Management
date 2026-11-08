const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Não foi possível obter o token de segurança (${response.status}).`);
  }

  const { token } = await response.json();
  return token;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Não foi possível validar a sessão (${response.status}).`);
  }

  return response.json();
}

export async function login(username, password) {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-XSRF-TOKEN': csrfToken,
    },
    body: new URLSearchParams({ username, password }),
  });

  if (response.status === 401) {
    throw new Error('Usuário ou senha incorretos.');
  }
  if (!response.ok) {
    throw new Error(`Não foi possível entrar (${response.status}).`);
  }

  await getCsrfToken();
}

export async function logout() {
  const csrfToken = await getCsrfToken();
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-XSRF-TOKEN': csrfToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Não foi possível encerrar a sessão (${response.status}).`);
  }
}
