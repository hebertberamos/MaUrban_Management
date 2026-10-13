import { apiGet } from './api';

// Fetch all movements (entries and exits) for a specific month
export async function obterMovimentacoes(ano, mes, tipo = null) {
  let endpoint = `/movimentacoes?ano=${ano}&mes=${mes}`;
  
  if (tipo && tipo !== 'ALL') {
    endpoint += `&tipo=${tipo}`;
  }
  
  return apiGet(endpoint);
}

export default {
  obterMovimentacoes,
};
