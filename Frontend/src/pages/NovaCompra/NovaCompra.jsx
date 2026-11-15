import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NovaCompra.css';
import * as pedidosService from '../../services/pedidosService';
import toast from 'react-hot-toast';

function formatarDataInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function adicionarMes(dataString, quantidade) {
  if (!dataString) return '';

  const [ano, mes, dia] = dataString.split('-').map(Number);
  const primeiroDiaDoMesAlvo = new Date(ano, mes - 1 + quantidade, 1);
  const ultimoDiaDoMesAlvo = new Date(
    primeiroDiaDoMesAlvo.getFullYear(),
    primeiroDiaDoMesAlvo.getMonth() + 1,
    0
  ).getDate();
  primeiroDiaDoMesAlvo.setDate(Math.min(dia, ultimoDiaDoMesAlvo));
  return formatarDataInput(primeiroDiaDoMesAlvo);
}

export default function NovaCompra() {
  const navigate = useNavigate();
  const hoje = formatarDataInput(new Date());

  // O estado espelha a estrutura do JSON que o backend espera
  const [compra, setCompra] = useState({
    cartao: '',
    quantidadeDeParcelas: 1,
    valorTotal: 0.0,
    dataPedido: hoje,
    dataPrimeiroVencimento: adicionarMes(hoje, 1),
    quantidadeDeParcelasPagas: 0
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
    if (compra.quantidadeDeParcelasPagas > compra.quantidadeDeParcelas) {
      toast.error("A quantidade de parcelas pagas não pode superar o total.");
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
          <h3>Informações da Compra</h3>
          
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="dataPedido">Data da compra</label>
              <input
                id="dataPedido"
                type="date"
                className="form-input"
                required
                value={compra.dataPedido}
                onChange={(e) => {
                  const dataPedido = e.target.value;
                  setCompra((atual) => ({
                    ...atual,
                    dataPedido,
                    dataPrimeiroVencimento: adicionarMes(dataPedido, 1)
                  }));
                }}
              />
            </div>

            <div className="form-group flex-2">
              <label htmlFor="cartao">Cartão utilizado</label>
              <select 
                id="cartao"
                className="form-input"
                required
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
              <label htmlFor="valorTotal">Valor total original (R$)</label>
              <input
                id="valorTotal"
                type="number"
                step="0.01"
                className="form-input"
                min="0"
                required
                value={compra.valorTotal}
                onChange={(e) => setCompra({...compra, valorTotal: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="quantidadeDeParcelas">Total original de parcelas</label>
              <input 
                id="quantidadeDeParcelas"
                type="number" 
                className="form-input"
                min="1"
                max="24"
                required
                value={compra.quantidadeDeParcelas}
                onChange={(e) => {
                  const quantidadeDeParcelas = parseInt(e.target.value, 10) || 1;
                  setCompra((atual) => ({
                    ...atual,
                    quantidadeDeParcelas,
                    quantidadeDeParcelasPagas: Math.min(atual.quantidadeDeParcelasPagas, quantidadeDeParcelas)
                  }));
                }}
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="quantidadeDeParcelasPagas">Parcelas já pagas</label>
              <input
                id="quantidadeDeParcelasPagas"
                type="number"
                className="form-input"
                min="0"
                max={compra.quantidadeDeParcelas}
                required
                value={compra.quantidadeDeParcelasPagas}
                onChange={(e) => setCompra({
                  ...compra,
                  quantidadeDeParcelasPagas: parseInt(e.target.value, 10) || 0
                })}
              />
              <small>Parcelas pagas antes do cadastro não geram movimentações no caixa.</small>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="dataPrimeiroVencimento">Vencimento da 1ª parcela</label>
              <input
                id="dataPrimeiroVencimento"
                type="date"
                className="form-input"
                required
                min={compra.dataPedido}
                value={compra.dataPrimeiroVencimento}
                onChange={(e) => setCompra({
                  ...compra,
                  dataPrimeiroVencimento: e.target.value
                })}
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