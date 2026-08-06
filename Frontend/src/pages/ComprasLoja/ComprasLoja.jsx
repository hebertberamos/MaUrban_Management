import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './ComprasLoja.css';
import * as pedidosService from '../../services/pedidosService';
import { useConfirm } from '../../components/ConfirmModal/ConfirmModal';

export default function ComprasLoja() {
    const navigate = useNavigate();
  const confirmar = useConfirm();
  // Pega o mês e ano atuais para definir como padrão inicial
  const dataAtual = new Date();
  // Iniciar sem filtros para mostrar todas as compras por padrão
  const [mes, setMes] = useState(''); // '' significa sem filtro de mês
  const [ano, setAno] = useState(''); // '' significa sem filtro de ano
  
  const [todasCompras, setTodasCompras] = useState([]);
  const [comprasFiltradas, setComprasFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('');

  useEffect(() => {
    const buscarCompras = async () => {
      setCarregando(true);
      try {
        const dados = await pedidosService.obterPedidosLoja();
        setTodasCompras(dados || []);
      } catch (error) {
        console.error("Erro ao buscar compras da loja:", error);
        setTodasCompras([]);
      } finally {
        setCarregando(false);
      }
    };

    buscarCompras();
  }, []);

  useEffect(() => {
    const filtradas = todasCompras.filter((compra) => {
      const dataPedido = compra.dataPedido ? new Date(compra.dataPedido) : null;
      const mesmoMes = !mes || (dataPedido && dataPedido.getMonth() + 1 === mes);
      const mesmoAno = !ano || (dataPedido && dataPedido.getFullYear() === ano);

      // Determinar status da compra de forma correta:
      // - Se houver parcelas: 'PAGO' somente se todas as parcelas estiverem com status 'PAGO'
      // - Caso contrário, se API fornecer emAberto: emAberto === true -> 'PENDENTE', else 'PAGO'
      // - Fallback: 'PAGO'
      let statusCompra = 'PAGO';
      const parcelas = compra.parcelas || [];
      if (parcelas.length > 0) {
        const total = parcelas.length;
        const pagas = parcelas.filter(p => p.status === 'PAGO').length;
        statusCompra = (pagas === total) ? 'PAGO' : 'PENDENTE';
      } else if (typeof compra.emAberto === 'boolean') {
        statusCompra = compra.emAberto ? 'PENDENTE' : 'PAGO';
      }

      const mesmoStatus = !statusFiltro || statusCompra === statusFiltro;

      return mesmoMes && mesmoAno && mesmoStatus;
    });

    setComprasFiltradas(filtradas);
  }, [todasCompras, mes, ano, statusFiltro]);

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
    // Antes: const confirmar = window.confirm("...")
    // Agora: modal customizado, chamado via await (retorna true/false)
    const ok = await confirmar(
      "Tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.",
      "Deletar compra"
    );
    if (!ok) return;

    try {
      await pedidosService.deletarPedidoLoja(id);

      setTodasCompras(todasCompras.filter(compra => compra.id !== id));
      // Antes: alert("Compra deletada com sucesso!")
      toast.success("Compra deletada com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar compra:", error);
      // Antes: alert("Erro ao conectar com o servidor.")
      toast.error("Erro ao conectar com o servidor.");
    }
  };

  // Gerar opções de anos (ex: de 2024 até o ano atual + 1)
  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => dataAtual.getFullYear() - 2 + i);

  const mesesDisponiveis = [
    { valor: '', nome: 'Todos' },
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
          >
            Registrar compra
          </button>
          
          <button 
            className="btn-nova-despesa"
            onClick={() => navigate('/nova-despesa')}
            style={{ marginLeft: '10px' }} // Adicionado um espaçamento básico (você pode mover para o CSS)
          >
            Registrar despesa
          </button>
        </div>
        
        <div className="compras-filtros">
          {/* Seletor de Mês */}
          <div className="input-com-icone">
            <span className="icone-pequeno">📅</span>
            <select 
              value={mes} 
              onChange={(e) => setMes(e.target.value === '' ? '' : parseInt(e.target.value))}
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
              onChange={(e) => setAno(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="select-filtro seletor-ano"
            >
              <option value="">Todos</option>
              {anosDisponiveis.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="input-com-icone">
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="select-filtro"
            >
              <option value="">Todos os status</option>
              <option value="PAGO">Pago</option>
              <option value="PENDENTE">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Compras */}
      <div className="compras-lista-wrapper">
        <div className="compras-lista-scroll">
          {carregando ? (
            <p className="sem-dados">Carregando...</p>
          ) : comprasFiltradas.length === 0 ? (
            <p className="sem-dados">Nenhuma compra encontrada para este período.</p>
          ) : (
            comprasFiltradas.map((compra) => (
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
                  {(() => {
                    const parcelas = compra.parcelas || [];
                    let statusCompra = 'PAGO';
                    if (parcelas.length > 0) {
                      const total = parcelas.length;
                      const pagas = parcelas.filter(p => p.status === 'PAGO').length;
                      statusCompra = (pagas === total) ? 'PAGO' : 'PENDENTE';
                    } else if (typeof compra.emAberto === 'boolean') {
                      statusCompra = compra.emAberto ? 'PENDENTE' : 'PAGO';
                    }

                    return (
                      <span className={`compra-status ${statusCompra === 'PENDENTE' ? 'status-aberto' : 'status-pago'}`}>
                        {statusCompra === 'PENDENTE' ? 'Pendente' : 'Pago'}
                      </span>
                    );
                  })()}

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