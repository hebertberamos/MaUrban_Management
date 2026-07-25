import React, { useEffect, useState } from 'react';
import * as dashboardService from '../../services/dashboardService';
import './DebitoMensal.css';

export default function DebitoMensal({ mes, ano }) {
  const [debitos, setDebitos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const buscarDebitos = async () => {
      setCarregando(true);
      try {
        const dados = await dashboardService.obterDebitosMensais(ano, mes);
        setDebitos(dados);
      } catch (error) {
        console.error("Erro ao buscar débitos mensais:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (mes && ano) {
      buscarDebitos();
    }
  }, [mes, ano]);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="debito-mensal-container">
      <h3>Débito mensal</h3>
      
      <div className="debito-lista">
        {carregando ? (
          <p className="debito-vazio">Carregando...</p>
        ) : debitos.length === 0 ? (
          <p className="debito-vazio">Nenhum débito para este mês.</p>
        ) : (
          debitos.map((debito, index) => (
            <div key={index} className="debito-card">
              <div className="debito-info-esquerda">
                <span className="debito-nome-cartao">{debito.cartao}</span>
                <span className="debito-valor">{formatarMoeda(debito.valorTotal)}</span>
              </div>
              
              <div className={`debito-status ${debito.pago ? 'status-pago' : 'status-nao-pago'}`}>
                {debito.pago ? 'Pago' : 'Não pago'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}