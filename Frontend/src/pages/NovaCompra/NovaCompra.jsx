import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './NovaCompra.css';
import * as produtosService from '../../services/produtosService';
import * as pedidosService from '../../services/pedidosService';

export default function NovaCompra() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  
  // O estado espelha a estrutura do seu JSON de envio
  const [compra, setCompra] = useState({
    cartao: '',
    quantidadeDeParcelas: 1,
    itens: [
      { produtoId: '', quantidade: 1 }
    ]
  });

  // Busca os produtos ao carregar a tela para preencher os selects
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const produtos = await produtosService.listarProdutos();
        setProdutos(produtos);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    carregarProdutos();
  }, []);

  // Funções para manipular os itens da compra dinamicamente
  const adicionarNovoItem = () => {
    setCompra({
      ...compra,
      itens: [...compra.itens, { produtoId: '', quantidade: 1 }]
    });
  };

  const removerItem = (indexParaRemover) => {
    const novosItens = compra.itens.filter((_, index) => index !== indexParaRemover);
    setCompra({ ...compra, itens: novosItens });
  };

  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...compra.itens];
    novosItens[index][campo] = valor;
    setCompra({ ...compra, itens: novosItens });
  };

  // Envio dos dados para o back-end
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!compra.cartao.trim()) {
      alert("Por favor, informe o cartão utilizado.");
      return;
    }
    if (compra.itens.some(item => !item.produtoId || item.quantidade < 1)) {
      alert("Por favor, selecione um produto e informe uma quantidade válida para todos os itens.");
      return;
    }

    try {
      await pedidosService.criarPedidoLoja(compra);
      
      alert("Compra da loja registrada com sucesso!");
      navigate('/compras'); // Redireciona de volta para a lista de compras
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao registrar a compra.");
    }
  };

  return (
    <div className="nova-compra-container">
      <div className="nova-compra-header">
        <h2>Registrar Compra da Loja</h2>
      </div>

      <form className="nova-compra-form" onSubmit={handleSubmit}>
        
        {/* BLOCO 1: Informações Principais */}
        <div className="form-section">
          <h3>Informações do Pagamento</h3>
          
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Cartão Utilizado</label>
              <select 
                className="form-input"
                value={compra.cartao}
                onChange={(e) => setCompra({...compra, cartao: e.target.value})}
              >
                <option value="">Selecione um cartão...</option>
                <option value="C6">C6</option>
                <option value="NUBANK">Nubank</option>
                <option value="PICPAY">PicPay</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Quantidade de Parcelas</label>
              <input 
                type="number" 
                className="form-input"
                min="1"
                max="24"
                value={compra.quantidadeDeParcelas}
                onChange={(e) => setCompra({...compra, quantidadeDeParcelas: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>
        </div>

        {/* BLOCO 2: Produtos (Dinâmico) */}
        <div className="form-section">
          <h3>Itens da Compra</h3>
          
          {compra.itens.map((item, index) => (
            <div key={index} className="produto-item-row">
              <div className="form-group flex-2">
                <select 
                  className="form-input"
                  value={item.produtoId}
                  onChange={(e) => atualizarItem(index, 'produtoId', e.target.value)}
                >
                  <option value="">Selecione um produto...</option>
                  {produtos.map(p => (
                    // Reaproveitando a lógica de mostrar o nome e o tamanho
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.tamanho})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group flex-1">
                <input 
                  type="number" 
                  className="form-input"
                  min="1"
                  placeholder="Qtd"
                  value={item.quantidade}
                  onChange={(e) => atualizarItem(index, 'quantidade', parseInt(e.target.value) || 1)}
                />
              </div>

              <button 
                type="button" 
                className="btn-remover-item"
                onClick={() => removerItem(index)}
                disabled={compra.itens.length === 1} // Impede remover se for o único
              >
                Remover
              </button>
            </div>
          ))}

          <button type="button" className="btn-adicionar-item" onClick={adicionarNovoItem}>
            + Adicionar outro produto
          </button>
        </div>

        {/* BLOCO 3: Ações */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-outline"
            onClick={() => navigate('/compras')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-dark">Finalizar Compra</button>
        </div>

      </form>
    </div>
  );
}