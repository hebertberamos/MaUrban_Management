import { apiGet, apiPost, apiDelete } from './api';

// ============ CLIENT ORDERS ============

// Fetch all orders from a specific client
export async function obterPedidosDoCliente(clienteId) {
  return apiGet(`/pedidos/cliente/${clienteId}`);
}

// Fetch client orders for a specific month
export async function obterPedidosClientePorMes(ano, mes) {
  const mesFormatado = String(mes).padStart(2, '0');
  return apiGet(`/pedidos/cliente/mes?ano=${ano}&mes=${mesFormatado}`);
}

// Create a new client order (sale)
export async function criarPedidoCliente(pedido) {
  return apiPost('/pedidos/cliente', pedido);
}

// Delete a client order
export async function deletarPedidoCliente(pedidoId) {
  return apiDelete(`/pedidos/cliente/${pedidoId}`);
}

// ============ STORE ORDERS ============

// Fetch store orders (purchases) for a specific month
export async function obterPedidosLojaParaMes(ano, mes) {
  const mesFormatado = String(mes).padStart(2, '0');
  return apiGet(`/pedidos/loja/mes?ano=${ano}&mes=${mesFormatado}`);
}

export async function obterTodosOsPedidosLoja() {
  return apiGet('/pedidos/loja');
}

export async function deletarPedidoLoja(pedidoId) {
  return apiDelete(`/pedidos/loja/${pedidoId}`);
}

// Create a new store order (purchase)
export async function criarPedidoLoja(compra) {
  return apiPost('/pedidos/loja', compra);
}

export default {
  obterPedidosDoCliente,
  obterPedidosClientePorMes,
  criarPedidoCliente,
  deletarPedidoCliente,
  obterPedidosLojaParaMes,
  obterTodosOsPedidosLoja,
  criarPedidoLoja,
};
