import {apiPost} from './api';

// Service function to create a new expense
export async function criarDespesa(novaDespesa) {
  return apiPost('/despesas', novaDespesa);
}