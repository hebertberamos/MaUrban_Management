import { apiGet, apiPost } from './api';

export async function listarClientesComDebito() {
  return apiGet('/clientes/debito/total');
}

export async function listarClientes() {
  return apiGet('/clientes');
}

// Create a new client (initial debt is optional)
export async function criarCliente(nome, valorDebitoInicial) {
  const payload = { nome: nome.trim() };
  if (valorDebitoInicial !== '' && valorDebitoInicial != null) {
    payload.valorDebitoInicial = parseFloat(valorDebitoInicial);
  }
  return apiPost('/clientes', payload);
}

// Fetch a single client with current debt
export async function obterResumoCliente(id) {
  return apiGet(`/clientes/${id}/resumo`);
}

// Register a payment of any amount against the client's debt
export async function registrarPagamento(id, valor) {
  return apiPost(`/clientes/${id}/pagamentos`, { valor });
}

export default {
  listarClientesComDebito,
  listarClientes,
  criarCliente,
  obterResumoCliente,
  registrarPagamento,
};