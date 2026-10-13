import { apiGet, apiPut } from './api';

// FETCH DASHBOARD MONTHLY DEBITS
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

// FETCH DASHBOARD MONTHLY DEBITS
export async function obterDebitosMensais(ano, mes) {
  return apiGet(`/dashboard/debitos-mensais?ano=${ano}&mes=${mes}`);
} 


export default {
  obterResumo,
  obterPagamentos,
  pagarParcela,
  estornarParcela,
  obterDebitosMensais
};
