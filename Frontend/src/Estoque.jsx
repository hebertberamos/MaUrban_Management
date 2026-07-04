import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Estoque.css';

export default function Estoque() {
    const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const resposta = await fetch('http://localhost:8080/api/produtos');
        if (resposta.ok) {
          const dados = await resposta.json();
          setProdutos(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    buscarProdutos();
  }, []);

  // Filtro de busca por nome
  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  // Transforma "MEDIO" em "Medio", "GRANDE" em "Grande", etc.
  const formatarTamanho = (tamanho) => {
    if (!tamanho) return '';
    return tamanho.charAt(0).toUpperCase() + tamanho.slice(1).toLowerCase();
  };

  return (
    <div className="estoque-container">
      
      {/* Cabeçalho da área com botões e filtros idêntico a Clientes */}
      <div className="estoque-header">
        <div className="estoque-acoes-topo">
          <button 
            className="btn-novo-produto"
            onClick={() => navigate('/novo-produto')}
            >
                Novo produto
            </button>
        </div>
        
        <div className="estoque-filtros">
          <div className="input-com-icone">
            <span className="icone-pequeno">🔍</span>
            <select 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
              className="select-filtro"
            >
              <option value="">Filtrar</option>
              <option value="baixo_estoque">Baixo estoque</option>
              <option value="em_estoque">Em estoque</option>
            </select>
          </div>

          <div className="input-com-icone">
            <span className="icone-pequeno">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar produto..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-busca"
            />
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="estoque-lista-wrapper">
        <div className="estoque-lista-scroll">
          {produtosFiltrados.length === 0 ? (
            <p className="sem-dados">Nenhum produto encontrado.</p>
          ) : (
            produtosFiltrados.map((produto) => (
              <div key={produto.id} className="produto-item">
                
                {/* Lado Esquerdo do Card */}
                <div className="produto-info-principal">
                  <h3 className="produto-nome">
                    {produto.nome} - {formatarTamanho(produto.tamanho)}
                  </h3>
                  <span className="produto-valores">
                    Valor compra: {formatarMoeda(produto.precoAtual)} | Valor venda: {formatarMoeda(produto.precoVenda)}
                  </span>
                </div>

                {/* Lado Direito do Card */}
                <div className="produto-info-estoque">
                  <span className="produto-quantidade">
                    Estoque: {produto.quantEstoque}
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