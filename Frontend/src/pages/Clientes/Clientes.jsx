import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Clientes.css';
import * as clientesService from '../../services/clientesService';

export default function Clientes() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  // Estado para o filtro (ainda definiremos a regra de negócio no back-end)
  const [filtro, setFiltro] = useState(''); 
  const [clienteEditando, setClienteEditando] = useState(null);
  const [nomeEdicao, setNomeEdicao] = useState('');
  const [saldoInicialEdicao, setSaldoInicialEdicao] = useState('');
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const dados = await clientesService.listarClientesComDebito();
        setClientes(dados);
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

  const abrirEdicao = async (event, cliente) => {
    event.stopPropagation();
    try {
      const dados = await clientesService.obterCliente(cliente.id);
      setClienteEditando(dados);
      setNomeEdicao(dados.nome);
      setSaldoInicialEdicao(String(dados.valorDebitoInicial ?? 0));
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast.error("Não foi possível carregar os dados do cliente.");
    }
  };

  const fecharEdicao = () => {
    if (salvandoEdicao) return;
    setClienteEditando(null);
    setNomeEdicao('');
    setSaldoInicialEdicao('');
  };

  const salvarEdicao = async (event) => {
    event.preventDefault();

    if (!nomeEdicao.trim()) {
      toast.error("Insira o nome do cliente.");
      return;
    }
    if (saldoInicialEdicao === '' || parseFloat(saldoInicialEdicao) < 0) {
      toast.error("O saldo inicial não pode ser negativo.");
      return;
    }

    setSalvandoEdicao(true);
    try {
      const atualizado = await clientesService.atualizarCliente(
        clienteEditando.id,
        nomeEdicao,
        saldoInicialEdicao
      );
      setClientes((atuais) => atuais.map((cliente) =>
        cliente.id === atualizado.id
          ? { ...cliente, nome: atualizado.nome }
          : cliente
      ));
      toast.success("Cliente atualizado com sucesso!");
      setClienteEditando(null);
      setNomeEdicao('');
      setSaldoInicialEdicao('');
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar o cliente.");
    } finally {
      setSalvandoEdicao(false);
    }
  };

  return (
    <div className="clientes-container">
      
      {/* Cabeçalho da área com botões e filtros */}
      <div className="clientes-header">
        <div className="clientes-acoes-topo">
          <button 
            className="btn-novo-cliente" 
            onClick={() => navigate('/novo-cliente')}>
            Novo cliente</button>
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
              <div key={cliente.id} className="cliente-item" onClick={() => navigate(`/clientes/${cliente.id}`)} style={{ cursor: 'pointer' }}>
                
                <div className="cliente-info-principal">
                  <h3 className="cliente-nome">{cliente.nome}</h3>
                  <span className="cliente-valor-total">
                    Valor total em débito: {formatarMoeda(cliente.valorTotalDebito)}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-editar-cliente"
                  onClick={(event) => abrirEdicao(event, cliente)}
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {clienteEditando && (
        <div className="cliente-modal-overlay" onMouseDown={fecharEdicao}>
          <div className="cliente-modal" onMouseDown={(event) => event.stopPropagation()}>
            <h2>Editar cliente</h2>
            <form onSubmit={salvarEdicao}>
              <label htmlFor="nome-cliente-edicao">Nome do cliente</label>
              <input
                id="nome-cliente-edicao"
                type="text"
                value={nomeEdicao}
                onChange={(event) => setNomeEdicao(event.target.value)}
                disabled={salvandoEdicao}
              />

              <label htmlFor="saldo-inicial-edicao">Saldo inicial (R$)</label>
              <input
                id="saldo-inicial-edicao"
                type="number"
                step="0.01"
                min="0"
                value={saldoInicialEdicao}
                onChange={(event) => setSaldoInicialEdicao(event.target.value)}
                disabled={salvandoEdicao}
              />

              <div className="cliente-modal-acoes">
                <button type="button" className="btn-modal-cancelar" onClick={fecharEdicao} disabled={salvandoEdicao}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-salvar" disabled={salvandoEdicao}>
                  {salvandoEdicao ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}