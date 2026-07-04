import { useEffect, useState } from 'react';
import './NovaVenda.css';

export default function NovaVenda() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  
  // Estado que reflete exatamente a estrutura do seu DTO/JSON
  const [pedido, setPedido] = useState({
    clienteId: '',
    metodoPagamento: 'CARTAO_CREDITO', // Valor padrão
    quantidadeDeParcelas: 1,
    itens: [
      { produtoId: '', quantidade: 1 } // Começa com 1 item vazio
    ]
  });

  // Busca clientes e produtos ao carregar a tela
  useEffect(() => {
    const carregarDadosBase = async () => {
      try {
        const [resClientes, resProdutos] = await Promise.all([
          fetch('http://localhost:8080/api/clientes'),
          fetch('http://localhost:8080/api/produtos')
        ]);

        if (resClientes.ok) setClientes(await resClientes.json());
        if (resProdutos.ok) setProdutos(await resProdutos.json());
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
      alert("Por favor, selecione um cliente.");
      return;
    }
    if (pedido.itens.some(item => !item.produtoId || item.quantidade < 1)) {
      alert("Por favor, preencha todos os produtos e quantidades corretamente.");
      return;
    }

    try {
      const resposta = await fetch('http://localhost:8080/api/pedidos/cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido)
      });

      if (resposta.ok) {
        alert("Venda registrada com sucesso!");
        // Limpa o formulário
        setPedido({
          clienteId: '',
          metodoPagamento: 'CARTAO_CREDITO',
          quantidadeDeParcelas: 1,
          itens: [{ produtoId: '', quantidade: 1 }]
        });
      } else {
        alert("Erro ao registrar a venda.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
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
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="PIX">PIX</option>
                <option value="DINHEIRO">Dinheiro</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Parcelas</label>
              <input 
                type="number" 
                className="form-input"
                min="1"
                max="12"
                value={pedido.quantidadeDeParcelas}
                onChange={(e) => setPedido({...pedido, quantidadeDeParcelas: parseInt(e.target.value) || 1})}
              />
            </div>
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
          <button type="button" className="btn-outline">Cancelar</button>
          <button type="submit" className="btn-dark">Finalizar Venda</button>
        </div>

      </form>
    </div>
  );
}