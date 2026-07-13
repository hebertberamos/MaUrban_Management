import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import * as dashboardService from '../../services/dashboardService';

export default function Dashboard() {
  const navigate = useNavigate(); // Hook do React Router para navegação programática
  // Estados para guardar os dados que virão da API
  const [resumo, setResumo] = useState({ totalAReceber: 0, totalAPagar: 0, totalJaRecebido: 0, saldoCaixa: 0 });
  const [pagamentos, setPagamentos] = useState([]);
  const [parcelaSelecionada, setParcelaSelecionada] = useState(null); // Estado para controlar qual parcela está clicada (para a borda azul do seu Figma)
  const [deslocamentoMes, setDeslocamentoMes] = useState(0); // Deslocamento de meses para o mês selecionado no dashboard

  // 1. Função única que calcula a data alvo com base no deslocamento de teste
  const obterDataAlvo = () => {
    const data = new Date();
    // O método setMonth do JS lida automaticamente com a virada de ano se o número passar de 11 ou for menor que 0
    data.setMonth(data.getMonth() + deslocamentoMes);
    return data;
  };

  const obterNomeMesEAno = (data) => {
    const nome = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(data);
    return nome.charAt(0).toUpperCase() + nome.slice(1);
  };

  const opcoesMeses = Array.from({ length: 25 }, (_, index) => index - 12);
  // Armazena a nossa data base calculada para este ciclo de renderização
  const dataAlvo = obterDataAlvo();

  // 2. Função que extrai o nome do mês correto a partir da nossa data calculada
  const obterNomeMes = (data) => {
    const mesNome = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);
    return mesNome.charAt(0).toUpperCase() + mesNome.slice(1);
  };

  const textoMes = `Mês de ${obterNomeMes(dataAlvo)}`;

  // useEffect executa a busca assim que o componente é montado na tela
  useEffect(() => {
    const buscarDados = async () => {
      const data = new Date();
      data.setMonth(data.getMonth() + deslocamentoMes);
      const ano = data.getFullYear();
      const mes = data.getMonth() + 1; // JS conta meses de 0 a 11, por isso o +1

      try {
        // 1. Busca o resumo dos cards
        const dadosResumo = await dashboardService.obterResumo(ano, mes);
        setResumo(dadosResumo);

        // 2. Busca a lista de pagamentos dos clientes
        const dadosPagamentos = await dashboardService.obterPagamentos(ano, mes);
        setPagamentos(dadosPagamentos);
      } catch (error) {
        console.error("Erro ao comunicar com a API:", error);
      }
    };

    buscarDados();
  }, [deslocamentoMes]); // Recarrega sempre que o mês selecionado mudar

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const atualizarResumo = async () => {
    const data = obterDataAlvo();
    const ano = data.getFullYear();
    const mes = data.getMonth() + 1;

    try {
      const dadosResumo = await dashboardService.obterResumo(ano, mes);
      setResumo(dadosResumo);
    } catch (error) {
      console.error('Erro ao atualizar resumo:', error);
    }
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

      await atualizarResumo();
    } catch (error) {
      console.error('Erro ao atualizar status da parcela:', error);
    }
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-top-section">
        <div className="dashboard-header">
            <div className="month-selector">
              <label htmlFor="mesSelecionado">Selecione o mês</label>
              <select
                id="mesSelecionado"
                value={deslocamentoMes}
                onChange={(event) => setDeslocamentoMes(Number(event.target.value))}
              >
                {opcoesMeses.map((offset) => {
                  const data = new Date();
                  data.setMonth(data.getMonth() + offset);
                  return (
                    <option key={offset} value={offset}>
                      {obterNomeMesEAno(data)}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="action-buttons">
              <button 
                className="btn-dark"
                onClick={() => navigate('/nova-venda')}
              >
                Registrar venda
              </button>
              <button 
                className="btn-dark"
                onClick={() => navigate('/nova-compra')}
              >
                Registrar compra
              </button>
            </div>
        </div>

        <div className="cards-container">
            <div className="card">
              <span>Total parcelas a receber</span>
              <h2>{formatarMoeda(resumo.totalAReceber)}</h2>
              <small>{textoMes}</small>
            </div>
          
            <div className="card">
              <span>Total a pagar</span>
              <h2>{formatarMoeda(resumo.totalAPagar)}</h2>
              <small>{textoMes}</small>
            </div>
          
            <div className="card">
              <span>Total já recebido</span>
              <h2>{formatarMoeda(resumo.totalJaRecebido)}</h2>
              <small>{textoMes}</small>
            </div>

            <div className="card">
              <span>Caixa</span>
              <h2>{formatarMoeda(resumo.saldoCaixa)}</h2>
              <small>{textoMes}</small>
            </div>
        </div>
      </div>

      <div className="lista-pagamentos-container">
        <h3>Lista de pagamentos</h3>
        
        <div className="pagamentos-scroll-area">
          {pagamentos.length === 0 ? (
             <p className="sem-dados">Nenhum pagamento registrado para o mês de {obterNomeMes(dataAlvo)}.</p>
          ) : (
            pagamentos.map((pagamento) => (
              <div 
                key={pagamento.idParcela}
                // Adiciona a classe 'selecionado' dinamicamente se for o item clicado
                className={`pagamento-item ${parcelaSelecionada === pagamento.idParcela ? 'selecionado' : ''}`}
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
      
    </div>
  );
}