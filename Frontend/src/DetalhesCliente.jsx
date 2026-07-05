import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import './DetalhesCliente.css';

export default function DetalhesCliente() {
  const { id } = useParams(); // Pega o ID do cliente da URL
  const navigate = useNavigate();
  
  const [pedidos, setPedidos] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const buscarPedidosDoCliente = async () => {
      setCarregando(true);
      try {
        // ATENÇÃO: Ajuste esta URL se o seu endpoint for diferente!
        const resposta = await fetch(`http://localhost:8080/api/pedidos/cliente/${id}`);
        
        if (resposta.ok) {
          const dados = await resposta.json();
          setPedidos(dados);
          
          // Se houver pedidos, pegamos o nome do cliente do primeiro pedido 
          // para exibir no título da tela
          if (dados.length > 0) {
            setNomeCliente(dados[0].nomeCliente);
          }
        } else {
          setPedidos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do cliente:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (id) {
      buscarPedidosDoCliente();
    }
  }, [id]);

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
      case 'CARTAO_CREDITO': return 'Cartão de crédito';
      case 'PIX': return 'PIX';
      case 'DINHEIRO': return 'Dinheiro';
      case 'CARTAO_DEBITO': return 'Cartão de débito';
      default: return metodo;
    }
  };

  return (
    <div className="detalhes-cliente-container">
      
      {/* Cabeçalho */}
      <div className="detalhes-cliente-header">
        <button className="btn-voltar" onClick={() => navigate('/clientes')}>
          ← Voltar para Clientes
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
                  <span className="venda-data">{formatarData(pedido.dataPedido)}</span>
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