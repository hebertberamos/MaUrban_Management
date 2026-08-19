import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NovoProduto.css';
import * as produtosService from '../../services/produtosService';
import toast from 'react-hot-toast';

export default function NovoProduto() {
  const navigate = useNavigate();

  // O estado inicial espelha a estrutura do seu JSON
  const [produto, setProduto] = useState({
    nome: '',
    precoAtual: '',
    quantEstoque: '',
    tamanho: 'MEDIO' // Define um valor padrão para facilitar
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica para não enviar dados vazios
    if (!produto.nome.trim() || !produto.precoAtual || !produto.quantEstoque) {
      toast.error("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      await produtosService.criarProduto(produto);
      
      toast.success("Produto cadastrado com sucesso!");
      // Redireciona o usuário de volta para a tela de estoque
      navigate('/estoque');
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao cadastrar o produto.");
    }
  };

  return (
    <div className="novo-produto-container">
      <div className="novo-produto-header">
        <h2>Cadastrar Novo Produto</h2>
      </div>

      <form className="novo-produto-form" onSubmit={handleSubmit}>
        
        <div className="form-section">
          <h3>Informações do Produto</h3>
          
          {/* Primeira linha do formulário */}
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Nome do Produto</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Ex: Short Flex Croco"
                value={produto.nome}
                onChange={(e) => setProduto({...produto, nome: e.target.value})}
              />
            </div>

            <div className="form-group flex-1">
              <label>Tamanho</label>
              <select 
                className="form-input"
                value={produto.tamanho}
                onChange={(e) => setProduto({...produto, tamanho: e.target.value})}
              >
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
              </select>
            </div>
          </div>

          {/* Segunda linha do formulário */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Preço Atual (R$)</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0.00"
                value={produto.precoAtual}
                onChange={(e) => setProduto({...produto, precoAtual: e.target.value})}
              />
            </div>

            <div className="form-group flex-1">
              <label>Quantidade em Estoque</label>
              <input 
                type="number" 
                min="0"
                className="form-input"
                placeholder="Ex: 10"
                value={produto.quantEstoque}
                onChange={(e) => setProduto({...produto, quantEstoque: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-outline" 
            onClick={() => navigate('/estoque')}
          >
            Cancelar
          </button>
          <button type="submit" className="btn-dark">Salvar Produto</button>
        </div>

      </form>
    </div>
  );
}