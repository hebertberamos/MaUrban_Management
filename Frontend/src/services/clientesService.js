import { apiGet, apiPost } from './api';

// Fetch all clients with their total debt
export async function listarClientesComDebito() {
  return apiGet('/clientes/debito/total');
}

// Fetch all clients (basic list)
export async function listarClientes() {
  return apiGet('/clientes');
}

// Create a new client
export async function criarCliente(nome) {
  return apiPost('/clientes', { nome: nome.trim() });
}

export default {
  listarClientesComDebito,
  listarClientes,
  criarCliente,
};
