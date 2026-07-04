import { useEffect, useState } from 'react';
import './Clientes.css';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  // Estado para o filtro (ainda definiremos a regra de negócio no back-end)
  const [filtro, setFiltro] = useState(''); 

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const resposta = await fetch('http://localhost:8080/api/clientes/debito/total');
        if (resposta.ok) {
          const dados = await resposta.json();
          setClientes(dados);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    buscarClientes();
  }, []);

  // Filtra a lista baseada no texto digitado no input de busca
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="clientes-container">
      
      {/* Cabeçalho da área com botões e filtros */}
      <div className="clientes-header">
        <div className="clientes-acoes-topo">
          <button className="btn-novo-cliente">Novo cliente</button>
        </div>
        
        <div className="clientes-filtros">
          {/* O dropdown de filtro */}
          <div className="input-com-icone">
            <span className="icone-pequeno">🔍</span>
            <select 
              value={filtro} 
              onChange={(e) => setFiltro(e.target.value)}
              className="select-filtro"
            >
              <option value="">Filtrar</option>
              <option value="inadimplentes">Com atraso</option>
              <option value="em_dia">Em dia</option>
            </select>
          </div>

          {/* O campo de busca de texto */}
          <div className="input-com-icone">
            <span className="icone-pequeno">🔍</span>
            <input 
              type="text" 
              placeholder="Bucas cliente..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-busca"
            />
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="clientes-lista-wrapper">
        <div className="clientes-lista-scroll">
          {clientesFiltrados.length === 0 ? (
            <p className="sem-dados">Nenhum cliente encontrado.</p>
          ) : (
            clientesFiltrados.map((cliente) => (
              <div key={cliente.id} className="cliente-item">
                
                <div className="cliente-info-principal">
                  <h3 className="cliente-nome">{cliente.nome}</h3>
                  {/* Agora o valor vem real da sua API */}
                  <span className="cliente-valor-total">
                    Valor total em débito: {formatarMoeda(cliente.valorTotalDebito)}
                  </span>
                </div>

                {/* O bloco da direita foi completamente removido, seguindo o novo protótipo */}

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}