import { useEffect, useState } from 'react';
import './Movimentacoes.css';
import * as movimentacoesService from '../../services/movimentacoesService';

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [tipo, setTipo] = useState('ALL');

  const anos = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);
  const meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  useEffect(() => {
    const buscar = async () => {
      try {
        const dados = await movimentacoesService.obterMovimentacoes(ano, mes, tipo);
        setMovimentacoes(dados);
      } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
      }
    };

    buscar();
  }, [ano, mes, tipo]);

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  return (
    <div className="movimentacoes-container">
      <div className="movimentacoes-header">
        <div className="filtros-topo">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))}>
            {meses.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <select value={ano} onChange={(e) => setAno(Number(e.target.value))}>
            {anos.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="ALL">Todos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>
        </div>
      </div>

      <div className="movimentacoes-list">
        {movimentacoes.length === 0 ? (
          <p className="sem-dados">Nenhuma movimentação encontrada para o mês selecionado.</p>
        ) : (
          movimentacoes.map(item => (
            <div key={item.id} className="mov-item">
              <div className="mov-descricao">{item.descricao}</div>
              <div className="mov-detalhes">
                <span className="mov-valor">{formatarMoeda(item.valor)}</span>
                <span className="mov-tipo">{item.tipoMovimentacao}</span>
                <span className="mov-data">{new Date(item.dataMovimentacao).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
