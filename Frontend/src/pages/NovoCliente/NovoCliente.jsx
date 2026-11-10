import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NovoCliente.css';
import * as clientesService from '../../services/clientesService';
import toast from 'react-hot-toast';

export default function NovoCliente() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [valorDebito, setValorDebito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica para evitar enviar nomes vazios
    if (!nome.trim()) {
      toast.error("Insira o nome do cliente.");
      return;
    }

    if (valorDebito !== '' && parseFloat(valorDebito) < 0) {
      toast.error("O débito anterior não pode ser negativo.");
      return;
    }



    setCarregando(true);

    try {
      await clientesService.criarCliente(nome, valorDebito);
      
      toast.success("Cliente cadastrado com sucesso!");
      navigate('/clientes'); // Retorna para a listagem de clientes
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao cadastrar o cliente. Verifique os dados.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="novo-cliente-container">
      <div className="novo-cliente-header">
        <h2>Adicionar Novo Cliente</h2>
      </div>

      <form className="novo-cliente-form" onSubmit={handleSubmit}>
        
        {/* Bloco de Informações do Cliente */}
        <div className="form-section">
          <h3>Dados Cadastrais</h3>
          
          <div className="form-group">
            <label htmlFor="nome-cliente">Nome do Cliente</label>
            <input
              id="nome-cliente"
              type="text"
              className="form-input"
              placeholder="Nome do cliente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={carregando}
            />
            <label htmlFor="debito-cliente">Débito anterior (R$) - opcional</label>
            <input
              id="debito-cliente"
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              placeholder="0,00"
              value={valorDebito}
              onChange={(e) => setValorDebito(e.target.value)}
              disabled={carregando}
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-outline"
            onClick={() => navigate('/clientes')}
            disabled={carregando}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-dark"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </div>

      </form>
    </div>
  );
}