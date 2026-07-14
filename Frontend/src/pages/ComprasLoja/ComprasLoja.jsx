import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComprasLoja.css';
import * as pedidosService from '../../services/pedidosService';

export default function ComprasLoja() {
    const navigate = useNavigate();
  // Pega o mês e ano atuais para definir como padrão inicial
  const dataAtual = new Date();
  const [mes, setMes] = useState(dataAtual.getMonth() + 1); // getMonth() retorna 0-11
  const [ano, setAno] = useState(dataAtual.getFullYear());
  
  const [compras, setCompras] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // O useEffect observa as variáveis 'mes' e 'ano'. 
  // Se qualquer uma delas mudar, a função é executada novamente.
  useEffect(() => {
    const buscarCompras = async () => {
      setCarregando(true);
      try {
        const dados = await pedidosService.obterPedidosLojaParaMes(ano, mes);
        setCompras(dados);
      } catch (error) {
        console.error("Erro ao buscar compras da loja:", error);
        setCompras([]);
      } finally {
        setCarregando(false);
      }
    };

    buscarCompras();
  }, [mes, ano]); // Array de dependências do useEffect

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const formatarData = (dataString) => {
    if (!dataString) return '';
    // Quebra a string "YYYY-MM-DD" para evitar problemas de fuso horário do new Date()
    const [a, m, d] = dataString.split('-');
    return `${d}/${m}/${a}`;
  };

  const handleDeletarCompra = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.");
    if (!confirmar) return;

    try {
      const resposta = await fetch(`http://localhost:8080/api/pedidos/loja/${id}`, {
         method: 'DELETE',
       });      

      if (resposta.ok) {
        setCompras(compras.filter(c => c.id !== id));
        alert("Pedido deletado com sucesso!");
      } else {
        alert("Erro ao deletar o pedido.");
      }
    } catch (error) {
      console.error("Erro ao deletar compra:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // Gerar opções de anos (ex: de 2024 até o ano atual + 1)
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
    <div className="compras-container">
      
      {/* Cabeçalho */}
      <div className="compras-header">
        <div className="compras-acoes-topo">
          <button 
            className="btn-nova-compra"
            onClick={() => navigate('/nova-compra')}
            >Registrar compra</button>
        </div>
        
        <div className="compras-filtros">
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

      {/* Lista de Compras */}
      <div className="compras-lista-wrapper">
        <div className="compras-lista-scroll">
          {carregando ? (
            <p className="sem-dados">Carregando...</p>
          ) : compras.length === 0 ? (
            <p className="sem-dados">Nenhuma compra encontrada para este período.</p>
          ) : (
            compras.map((compra) => (
              <div key={compra.id} className="compra-item">
                
                {/* Lado Esquerdo */}
                <div className="compra-info-principal">
                  <h3 className="compra-cartao">Cartão: {compra.cartao}</h3>
                  <div className="compra-meta">
                    <span className="compra-data">Data: {formatarData(compra.dataPedido)}</span>
                    <button
                      className="btn-deletar-card"
                      onClick={() => handleDeletarCompra(compra.id)}
                      title="Deletar pedido"
                    >
                      Deletar
                    </button>
                  </div>
                </div>

                {/* Lado Direito */}
                <div className="compra-info-valores">
                  <span className="compra-valor-total">
                    {formatarMoeda(compra.valorTotal)}
                  </span>
                  <span className={`compra-status ${compra.emAberto ? 'status-aberto' : 'status-pago'}`}>
                    {compra.emAberto ? 'Em aberto' : 'Pago'}
                  </span>

                  {/* Exibir número de parcelas pagas e total */}
                  <span className="compra-parcelas">
                    {(() => {
                      const parcelas = compra.parcelas || [];
                      const total = parcelas.length || (compra.quantidadeDeParcelas || 0);
                      const pagas = parcelas.filter(p => p.status === 'PAGO').length;
                      return `${pagas} of ${total}`;
                    })()}
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