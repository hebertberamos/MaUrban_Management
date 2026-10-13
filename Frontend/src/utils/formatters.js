// Funções de formatação compartilhadas entre VendasClientes e DetalhesCliente.

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

export function formatarData(dataString) {
  if (!dataString) return '';
  const [a, m, d] = dataString.split('-');
  return `${d}/${m}/${a}`;
}

export function formatarMetodoPagamento(metodo) {
  switch (metodo) {
    case 'CARTAO':
      return 'Cartão';
    case 'PROMISSORIA':
      return 'Promissória';
    case 'PIX':
      return 'PIX';
    case 'DINHEIRO':
      return 'Dinheiro';

    // Mantemos os antigos caso você tenha dados legados no banco de dados
    // de vendas feitas antes dessa alteração:
    case 'CARTAO_CREDITO':
      return 'Cartão de crédito';
    case 'CREDIARIO':
      return 'Crediário';
    default:
      return metodo;
  }
}