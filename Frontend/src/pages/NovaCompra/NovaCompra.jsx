import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NovaCompra.css';
import * as pedidosService from '../../services/pedidosService';
import toast from 'react-hot-toast';

export default function NovaCompra() {
  const navigate = useNavigate();
  
  // O estado espelha a estrutura do JSON que o backend espera
  const [compra, setCompra] = useState({
    cartao: '',
    quantidadeDeParcelas: 1,
    valorTotal: 0.0
  });



  // Envio dos dados para o back-end
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!compra.cartao.trim()) {
      toast.error("Informe o cartão utilizado.");
      return;
    }
    if (!compra.valorTotal || Number(compra.valorTotal) <= 0) {
      toast.error("Iinforme o valor total da compra maior que zero.");
      return;
    }
    if (!compra.quantidadeDeParcelas || Number(compra.quantidadeDeParcelas) < 1) {
      toast.error("Informe uma quantidade de parcelas válida.");
      return;
    }

    try {
      await pedidosService.criarPedidoLoja(compra);
      
      toast.success("Compra da loja registrada com sucesso!");
      navigate('/compras'); // Redireciona de volta para a lista de compras
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao registrar a compra.");
    }
  };

  return (
    <div className="nova-compra-container">
      <div className="nova-compra-header">
        <h2>Registrar Compra da Loja</h2>
      </div>

      <form className="nova-compra-form" onSubmit={handleSubmit}>
        
        {/* Informações Principais */}
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
              <label>Valor Total (R$)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                min="0"
                value={compra.valorTotal}
                onChange={(e) => setCompra({...compra, valorTotal: parseFloat(e.target.value) || 0})}
              />
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

        {/* Ações */}
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