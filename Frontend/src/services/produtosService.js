import { apiGet, apiPost } from './api';

// Fetch all products from inventory
export async function listarProdutos() {
  return apiGet('/produtos');
}

// Create a new product
export async function criarProduto(produto) {
  return apiPost('/produtos', {
    nome: produto.nome,
    precoAtual: parseFloat(produto.precoAtual),
    quantEstoque: parseInt(produto.quantEstoque, 10),
    tamanho: produto.tamanho,
  });
}

export default {
  listarProdutos,
  criarProduto,
};
