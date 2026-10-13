import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as despesaService from '../../services/DespesaService';
import './NovaDespesa.css';
import toast from 'react-hot-toast';

export default function NovaDespesa() {
  const navigate = useNavigate();
  
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [valor, setValor] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);

    const novaDespesa = {
      descricao: descricao,
      data: data,
      valor: parseFloat(valor)
    };

    try {
    await despesaService.criarDespesa(novaDespesa);

    toast.success("Despesa registrada com sucesso!");
    navigate(-1); // Volta para a tela anterior
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="nova-despesa-container">
      <div className="content-area">
        <h2 className="titulo-pagina">Registrar nova despesa</h2>
        
        <div className="form-card">
          <div className="section-title">Informações do Pagamento</div>
          
          <form onSubmit={handleSubmit}>
            
            {/* Linha com os inputs lado a lado */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Descrição</label>
                <input 
                  type="text" 
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Compra das sacolas"
                  required
                />
              </div>

              <div className="form-group">
                <label>Data</label>
                <input 
                  type="date" 
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Valor Total (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            {/* Linha dos botões alinhados à direita */}
            <div className="acoes-container">
              <button 
                type="button" 
                className="btn-cancelar"
                onClick={() => navigate(-1)} 
                disabled={salvando}
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                className="btn-salvar"
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar Despesa'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}