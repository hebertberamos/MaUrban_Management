import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './DetalhesCliente.css';
import * as pedidosService from '../../services/pedidosService';
import { formatarMoeda, formatarData, formatarMetodoPagamento } from '../../utils/formatters';
import { useConfirm } from '../../components/ConfirmModal/ConfirmModal';

export default function DetalhesCliente() {
  const { id } = useParams(); // Pega o ID do cliente da URL
  const navigate = useNavigate();
  const confirmar = useConfirm();
  
  const [pedidos, setPedidos] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const buscarPedidosDoCliente = async () => {
      setCarregando(true);
      try {
        const dados = await pedidosService.obterPedidosDoCliente(id);
        setPedidos(dados);
        
        // Se houver pedidos, pegamos o nome do cliente do primeiro pedido 
        // para exibir no título da tela
        if (dados.length > 0) {
          setNomeCliente(dados[0].nomeCliente);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do cliente:", error);
        setPedidos([]);
      } finally {
        setCarregando(false);
      }
    };

    if (id) {
      buscarPedidosDoCliente();
    }
  }, [id]);

  const handleDeletarPedido = async (idPedido) => {
    // Antes: const confirmar = window.confirm("...")
    // Agora: modal customizado, chamado via await (retorna true/false)
    const ok = await confirmar(
      "Tem certeza que deseja deletar este pedido por completo? O estoque dos produtos será devolvido.",
      "Deletar pedido"
    );
    if (!ok) return;

    try {
      await pedidosService.deletarPedidoCliente(idPedido);
      
      // Remove o pedido do estado local
      setPedidos(pedidos.filter(pedido => pedido.id !== idPedido));
      toast.success("Pedido deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      toast.error("Erro ao deletar o pedido.");
    }
  };

  return (
    <div className="detalhes-cliente-container">
      
      {/* Cabeçalho */}
      <div className="detalhes-cliente-header">
        <button className="btn-voltar" onClick={() => navigate('/clientes')}>
          ← Voltar
        </button>
        <div className="titulo-cliente">
          <h2>Pedidos de {nomeCliente || 'Cliente'}</h2>
        </div>
      </div>

      {/* Lista de Pedidos do Cliente */}
      <div className="detalhes-lista-wrapper">
        <div className="detalhes-lista-scroll">
          {carregando ? (
            <p className="sem-dados">Carregando pedidos...</p>
          ) : pedidos.length === 0 ? (
            <p className="sem-dados">Nenhum pedido encontrado para este cliente.</p>
          ) : (
            pedidos.map((pedido) => (
              <div key={pedido.id} className="venda-item">
                
                <div className="venda-linha-superior">
                  {/* Como já sabemos de quem é, podemos mostrar o Status no lugar do nome */}
                  <h3 className={`venda-status ${pedido.emAberto ? 'status-pendente' : 'status-pago'}`}>
                    {pedido.emAberto ? 'Pagamento Pendente' : 'Pago'}
                  </h3>
                  <div className="venda-meta">
                    <span className="venda-data">{formatarData(pedido.dataPedido)}</span>
                    <button 
                      className="btn-deletar-card"
                      onClick={() => handleDeletarPedido(pedido.id)}
                      title="Deletar pedido"
                    >
                      Deletar
                    </button>
                  </div>
                </div>

                {/* Lista de Itens do Pedido */}
                {pedido.itens && pedido.itens.length > 0 && (
                  <div className="venda-itens-lista">
                    <h4 className="titulo-itens">Produtos:</h4>
                    {pedido.itens.map((item) => (
                      <div key={item.itemId} className="item-detalhe">
                        <span className="item-nome">
                          {item.quantidadeComprada}x | {item.nomeProduto} | {formatarMoeda(item.valorProduto)}
                        </span>
                        {/* <span className="item-valor">
                        </span> */}
                      </div>
                    ))}
                  </div>
                )}

                <div className="venda-linha-inferior">
                  <span className="venda-detalhes">
                    Total: {formatarMoeda(pedido.valorTotal)} | {formatarMetodoPagamento(pedido.metodoPagamento)}
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