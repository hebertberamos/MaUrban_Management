import { apiGet, apiPut } from './api';

// Fetch dashboard summary data (cards)
export async function obterResumo(ano, mes) {
  return apiGet(`/dashboard/resumo?ano=${ano}&mes=${mes}`);
}

// Fetch dashboard payments list
export async function obterPagamentos(ano, mes) {
  return apiGet(`/dashboard/pagamentos?ano=${ano}&mes=${mes}`);
}

// Mark a parcel as paid
export async function pagarParcela(parcelaId) {
  return apiPut(`/parcelas/pagar/parcela-cliente/${parcelaId}`);
}

// Reverse (unmark) a parcel payment
export async function estornarParcela(parcelaId) {
  return apiPut(`/parcelas/estornar/parcela-cliente/${parcelaId}`);
}

export default {
  obterResumo,
  obterPagamentos,
  pagarParcela,
  estornarParcela,
};
