import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NovaVenda.css';
import * as clientesService from '../../services/clientesService';
import * as pedidosService from '../../services/pedidosService';
import toast from 'react-hot-toast';

export default function NovaVenda() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);

  const [pedido, setPedido] = useState({
    clienteId: '',
    metodoPagamento: 'CARTAO',
    valorTotal: '',
    quantidadeDeParcelas: 1
  });

  // Busca clientes ao carregar a tela
  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const dados = await clientesService.listarClientes();
        setClientes(dados);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    carregarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pedido.clienteId) {
      //TODO: alterar de alert pra toast
      alert("Por favor, selecione um cliente.");
      return;
    }
    if (!pedido.valorTotal || Number(pedido.valorTotal) <= 0) {
      //TODO: alterar de alert pra toast
      alert("Por favor, informe o valor total da venda maior que zero.");
      return;
    }
    if (pedido.metodoPagamento === 'PROMISSORIA' && (!pedido.quantidadeDeParcelas || pedido.quantidadeDeParcelas < 1)) {
      //TODO: alterar de alert pra toast
      alert("Por favor, informe uma quantidade de parcelas válida.");
      return;
    }

    const dadosParaEnvio = {
      ...pedido,
      valorTotal: parseFloat(pedido.valorTotal),
      quantidadeDeParcelas: pedido.metodoPagamento === 'PROMISSORIA' ? pedido.quantidadeDeParcelas : 1
    };

    try {
      await pedidosService.criarPedidoCliente(dadosParaEnvio);

      //TODO: alterar de alert pra toast
      alert("Venda registrada com sucesso!");
      setPedido({
        clienteId: '',
        metodoPagamento: 'CARTAO',
        valorTotal: '',
        quantidadeDeParcelas: 1
      });
      navigate('/vendas');
    } catch (error) {
      console.error("Erro na requisição:", error);
      //TODO: alterar de alert pra toast
      alert("Erro ao registrar a venda.");
    }
  };

  return (
    <div className="nova-venda-container">
      <div className="nova-venda-header">
        <h2>Registrar Nova Venda</h2>
      </div>

      <form className="nova-venda-form" onSubmit={handleSubmit}>

        <div className="form-section">
          <h3>Informações da Venda</h3>

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
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Valor Total (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0.00"
                value={pedido.valorTotal}
                onChange={(e) => setPedido({...pedido, valorTotal: e.target.value})}
              />
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