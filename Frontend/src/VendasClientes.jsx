import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VendasClientes.css';

export default function VendasClientes() {
  const navigate = useNavigate();
  const dataAtual = new Date();
  
  const [mes, setMes] = useState(dataAtual.getMonth() + 1);
  const [ano, setAno] = useState(dataAtual.getFullYear());
  
  const [vendas, setVendas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const buscarVendas = async () => {
      setCarregando(true);
      try {
        const mesFormatado = String(mes).padStart(2, '0');
        const url = `http://localhost:8080/api/pedidos/cliente/mes?ano=${ano}&mes=${mesFormatado}`;
        
        const resposta = await fetch(url);
        if (resposta.ok) {
          const dados = await resposta.json();
          setVendas(dados);
        } else {
          setVendas([]);
        }
      } catch (error) {
        console.error("Erro ao buscar vendas dos clientes:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarVendas();
  }, [mes, ano]);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    const [a, m, d] = dataString.split('-');
    return `${d}/${m}/${a}`;
  };

  const formatarMetodoPagamento = (metodo) => {
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
  };

  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => dataAtual.getFullYear() - 2 + i);

  const mesesDisponiveis = [
    { valor: 1, nome: 'Janeiro' }, { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' }, { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' }, { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' }, { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' }, { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' }, { valor: 12, nome: 'Dezembro' }
  ];

  return (
    <div className="vendas-container">
      
      {/* Cabeçalho */}
      <div className="vendas-header">
        <div className="vendas-acoes-topo">
          <button 
            className="btn-nova-venda"
            onClick={() => navigate('/nova-venda')}
          >
            Registrar venda
          </button>
        </div>
        
        <div className="vendas-filtros">
          {/* Seletor de Mês */}
          <div className="input-com-icone">
            <span className="icone-pequeno">📅</span>
            <select 
              value={mes} 
              onChange={(e) => setMes(parseInt(e.target.value))}
              className="select-filtro"
            >
              {mesesDisponiveis.map(m => (
                <option key={m.valor} value={m.valor}>{m.nome}</option>
              ))}
            </select>
          </div>

          {/* Seletor de Ano */}
          <div className="input-com-icone">
            <select 
              value={ano} 
              onChange={(e) => setAno(parseInt(e.target.value))}
              className="select-filtro seletor-ano"
            >
              {anosDisponiveis.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Vendas (Formato baseado no protótipo) */}
      <div className="vendas-lista-wrapper">
        <div className="vendas-lista-scroll">
          {carregando ? (
            <p className="sem-dados">Carregando...</p>
          ) : vendas.length === 0 ? (
            <p className="sem-dados">Nenhuma venda encontrada para este período.</p>
          ) : (
            vendas.map((venda) => (
              <div key={venda.id} className="venda-item">
                
                <div className="venda-linha-superior">
                  <h3 className="venda-nome-cliente">{venda.nomeCliente}</h3>
                  <span className="venda-data">{formatarData(venda.dataPedido)}</span>
                </div>

                <div className="venda-linha-inferior">
                  <span className="venda-detalhes">
                    Total: {formatarMoeda(venda.valorTotal)} | {formatarMetodoPagamento(venda.metodoPagamento)}
                  </span>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}