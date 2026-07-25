import { useEffect, useState } from 'react';
import './ListaPagamentos.css';
import * as dashboardService from '../../services/dashboardService';

export default function ListaPagamentos({ mes, ano, onAtualizarResumo }) {
  const [pagamentos, setPagamentos] = useState([]);
  const [parcelaSelecionada, setParcelaSelecionada] = useState(null);

  useEffect(() => {
    const buscarPagamentos = async () => {
      try {
        const dadosPagamentos = await dashboardService.obterPagamentos(ano, mes);
        setPagamentos(dadosPagamentos || []);
      } catch (error) {
        console.error("Erro ao buscar pagamentos:", error);
      }
    };

    if (mes && ano) {
      buscarPagamentos();
    }
  }, [mes, ano]);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const obterNomeMes = () => {
    // O JS usa meses de 0 a 11 no Date, então subtraímos 1 do mês passado por prop
    const data = new Date(ano, mes - 1);
    const mesNome = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);
    return mesNome.charAt(0).toUpperCase() + mesNome.slice(1);
  };

  const handlePagamentoClick = async (pagamento) => {
    setParcelaSelecionada(pagamento.idParcela);

    const isPago = pagamento.status === 'PAGO';

    try {
      const parcelaAtualizada = isPago
        ? await dashboardService.estornarParcela(pagamento.idParcela)
        : await dashboardService.pagarParcela(pagamento.idParcela);

      setPagamentos((prevPagamentos) =>
        prevPagamentos.map((item) =>
          item.idParcela === parcelaAtualizada.id
            ? { ...item, status: parcelaAtualizada.status }
            : item
        )
      );

      // Avisa o Dashboard para atualizar os cards de resumo
      if (onAtualizarResumo) {
        onAtualizarResumo();
      }
    } catch (error) {
      console.error('Erro ao atualizar status da parcela:', error);
    }
  };

  return (
    <div className="lista-pagamentos-container">
      <h3>Lista de pagamentos</h3>
      
      <div className="pagamentos-scroll-area">
        {pagamentos.length === 0 ? (
          <p className="sem-dados">Nenhum pagamento registrado para o mês de {obterNomeMes()}.</p>
        ) : (
          pagamentos.map((pagamento) => (
            <div 
              key={pagamento.idParcela}
              className="pagamento-item"
              onClick={() => handlePagamentoClick(pagamento)}
            >
              <div className="pagamento-info">
                <span className="nome-cliente">{pagamento.nomeCliente}</span>
                <span className="valor-parcela">{formatarMoeda(pagamento.valor)}</span>
              </div>
              <div className={`pagamento-status ${pagamento.status === 'PAGO' ? 'status-pago' : 'status-nao-pago'}`}>
                {pagamento.status === 'PAGO' ? 'Pago' : 'Não pago'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}