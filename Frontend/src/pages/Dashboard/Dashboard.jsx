import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import * as dashboardService from '../../services/dashboardService';
import DebitoMensal from '../../components/ListaDebitoMensal/DebitoMensal';
import ListaPagamentos from '../../components/ListaPagamentos/ListaPagamentos';

export default function Dashboard() {
  const navigate = useNavigate(); // Hook do React Router para navegação programática
  // Estados para guardar os dados que virão da API
  const [resumo, setResumo] = useState({ totalAReceber: 0, totalAPagar: 0, totalJaRecebido: 0, saldoCaixa: 0 });
  const [deslocamentoMes, setDeslocamentoMes] = useState(0); // Deslocamento de meses para o mês selecionado no dashboard

  // 1. Função única que calcula a data alvo com base no deslocamento de teste
  const obterDataAlvo = () => {
    const data = new Date();
    data.setMonth(data.getMonth() + deslocamentoMes); // O método setMonth do JS lida automaticamente com a virada de ano se o número passar de 11 ou for menor que 0
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
    const buscarResumo = async () => {
      const ano = dataAlvo.getFullYear();
      const mes = dataAlvo.getMonth() + 1; // JS conta meses de 0 a 11, por isso o +1

      // Busca o resumo dos cards
      try {
        const dadosResumo = await dashboardService.obterResumo(ano, mes);
        setResumo(dadosResumo);
      } catch (error) {
        console.error("Erro ao buscar o resumo:", error);
      }
    };

    buscarResumo();
  }, [deslocamentoMes]); // Recarrega sempre que o mês selecionado mudar

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const atualizarResumo = async () => {
    const ano = dataAlvo.getFullYear();
    const mes = dataAlvo.getMonth() + 1;

    try {
      const dadosResumo = await dashboardService.obterResumo(ano, mes);
      setResumo(dadosResumo);
    } catch (error) {
      console.error('Erro ao atualizar resumo:', error);
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

      <div className="dashboard-lists-section">     
        <ListaPagamentos 
          mes={dataAlvo.getMonth() + 1} 
          ano={dataAlvo.getFullYear()} 
          onAtualizarResumo={atualizarResumo} 
        />
        <DebitoMensal 
          mes={dataAlvo.getMonth() + 1} 
          ano={dataAlvo.getFullYear()} 
        />
      </div> 
      
    </div>
  );
}