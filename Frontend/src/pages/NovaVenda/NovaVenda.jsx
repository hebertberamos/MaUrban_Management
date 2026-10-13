import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NovaVenda.css';
import * as clientesService from '../../services/clientesService';
import * as produtosService from '../../services/produtosService';
import * as pedidosService from '../../services/pedidosService';
import toast from 'react-hot-toast';

export default function NovaVenda() {
  const navigate = useNavigate();      
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

// E depois enviar 'dadosParaEnvio' no fetch
  
  // Estado que reflete exatamente a estrutura do seu DTO/JSON
  const [pedido, setPedido] = useState({
    clienteId: '',
    metodoPagamento: 'CARTAO', // Valor padrão
    quantidadeDeParcelas: 1,
    itens: [
      { produtoId: '', quantidade: 1 } // Começa com 1 item vazio
    ]
  });

    const dadosParaEnvio = {
  ...pedido,
  quantidadeDeParcelas: pedido.metodoPagamento === 'PROMISSORIA' ? pedido.quantidadeDeParcelas : 1
};

  // Busca clientes e produtos ao carregar a tela
  useEffect(() => {
    const carregarDadosBase = async () => {
      try {
        const [clients, products] = await Promise.all([
          clientesService.listarClientes(),
          produtosService.listarProdutos()
        ]);
        
        setClientes(clients);
        setProdutos(products);
      } catch (error) {
        console.error("Erro ao buscar dados base:", error);
      }
    };

    carregarDadosBase();
  }, []);

  // Funções para manipular a lista de itens
  const adicionarNovoItem = () => {
    setPedido({
      ...pedido,
      itens: [...pedido.itens, { produtoId: '', quantidade: 1 }]
    });
  };

  const removerItem = (indexParaRemover) => {
    const novosItens = pedido.itens.filter((_, index) => index !== indexParaRemover);
    setPedido({ ...pedido, itens: novosItens });
  };

  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...pedido.itens];
    novosItens[index][campo] = valor;
    setPedido({ ...pedido, itens: novosItens });
  };

  // Função para enviar os dados para o Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que a página recarregue

    // Validação básica
    if (!pedido.clienteId) {
      toast.error("Selecione um cliente.");
      return;
    }
    if (pedido.itens.some(item => !item.produtoId || item.quantidade < 1)) {
      toast.error("Selecione o item do pedido.");
      return;
    }

    try {
      await pedidosService.criarPedidoCliente(dadosParaEnvio);
      
      toast.success("Venda registrada com sucesso!");
      // Limpa o formulário
      setPedido({
        clienteId: '',
        metodoPagamento: 'CARTAO',
        quantidadeDeParcelas: 1,
        itens: [{ produtoId: '', quantidade: 1 }]
      });
      navigate('/vendas');
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao registrar a venda.");
    }
  };

  return (
    <div className="nova-venda-container">
      <div className="nova-venda-header">
        <h2>Registrar Nova Venda</h2>
      </div>

      <form className="nova-venda-form" onSubmit={handleSubmit}>
        
        {/* BLOCO 1: Informações Principais */}
        <div className="form-section">
          <h3>Informações Principais</h3>
          
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Cliente</label>
              <select 
                className="form-input"
                value={pedido.clienteId}
                onChange={(e) => setPedido({...pedido, clienteId: e.target.value})}
              >
                <option value="">Selecione um cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Método de Pagamento</label>
              <select 
                className="form-input"
                value={pedido.metodoPagamento}
                onChange={(e) => setPedido({...pedido, metodoPagamento: e.target.value})}
              >
                <option value="CARTAO">Cartão</option>
                <option value="PIX">PIX</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PROMISSORIA">Promissória</option>
              </select>
            </div>

            {/* O campo de parcelas SÓ aparece se o método for PROMISSORIA */}
            {pedido.metodoPagamento === 'PROMISSORIA' && (
              <div className="form-group flex-1">
                <label>Qtd. de Parcelas</label>
                <input 
                  type="number" 
                  className="form-input"
                  min="1"
                  max="24"
                  value={pedido.quantidadeDeParcelas}
                  onChange={(e) => setPedido({...pedido, quantidadeDeParcelas: parseInt(e.target.value) || 1})}
                />
              </div>
            )}
          </div>
        </div>

        {/* BLOCO 2: Produtos (Dinâmico) */}
        <div className="form-section">
          <h3>Produtos</h3>
          
          {pedido.itens.map((item, index) => (
            <div key={index} className="produto-item-row">
              <div className="form-group flex-2">
                <select 
                  className="form-input"
                  value={item.produtoId}
                  onChange={(e) => atualizarItem(index, 'produtoId', e.target.value)}
                >
                  <option value="">Selecione um produto...</option>
                  {produtos.map(p => (
                    // Supondo que seu produto retorne 'id' e 'nome'
                    <option key={p.id} value={p.id}>{p.nome} - {p.tamanho}</option> 
                  ))}
                </select>
              </div>

              <div className="form-group flex-1">
                <input 
                  type="number" 
                  className="form-input"
                  min="1"
                  placeholder="Quantidade"
                  value={item.quantidade}
                  onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                />
              </div>

              <button 
                type="button" 
                className="btn-remover-item"
                onClick={() => removerItem(index)}
                disabled={pedido.itens.length === 1} // Impede remover se for o último
              >
                Remover
              </button>
            </div>
          ))}

          <button type="button" className="btn-adicionar-item" onClick={adicionarNovoItem}>
            + Adicionar outro produto
          </button>
        </div>

        {/* BLOCO 3: Botão de Envio */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-outline"
            onClick={() => navigate('/vendas')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-dark">Finalizar Venda</button>
        </div>

      </form>
    </div>
  );
}