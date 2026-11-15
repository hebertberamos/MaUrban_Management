import { useEffect, useState } from 'react';
import './ListaPagamentos.css';
import * as movimentacoesService from '../../services/movimentacoesService';
import { formatarMoeda, formatarData } from '../../utils/formatters';

export default function ListaPagamentos({ mes, ano }) {
  const [entradas, setEntradas] = useState([]);

  useEffect(() => {
    const buscarEntradas = async () => {
      try {
        const dados = await movimentacoesService.obterMovimentacoes(ano, mes, 'ENTRADA');
        setEntradas(dados || []);
      } catch (error) {
        console.error("Erro ao buscar entradas do mês:", error);
        setEntradas([]);
      }
    };

    if (mes && ano) {
      buscarEntradas();
    }
  }, [mes, ano]);

  const obterNomeMes = () => {
    const data = new Date(ano, mes - 1);
    const mesNome = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);
    return mesNome.charAt(0).toUpperCase() + mesNome.slice(1);
  };

  return (
    <div className="lista-pagamentos-container">
      <h3>Entradas do mês</h3>

      <div className="pagamentos-scroll-area">
        {entradas.length === 0 ? (
          <p className="sem-dados">Nenhuma entrada registrada para o mês de {obterNomeMes()}.</p>
        ) : (
          entradas.map((entrada) => (
            <div key={entrada.id} className="pagamento-item">
              <div className="pagamento-info">
                <span className="nome-cliente">{entrada.descricao}</span>
                <span className="valor-parcela">{formatarMoeda(entrada.valor)}</span>
              </div>
              {/* slice(0, 10) pega só "AAAA-MM-DD" e evita erro de fuso horário */}
              <div className="pagamento-data">
                {formatarData(entrada.dataMovimentacao.slice(0, 10))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}