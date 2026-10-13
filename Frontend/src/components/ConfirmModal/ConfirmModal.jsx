// src/components/ConfirmModal/ConfirmModal.jsx
//
// Substitui o window.confirm() nativo do navegador por um modal customizado.
// Funciona com a mesma "forma" de uso: você chama uma função e recebe
// true/false de volta — só que aqui a resposta vem via Promise, então o
// uso precisa de `await`.
//
// Uso em qualquer componente:
//   const confirmar = useConfirm();
//   const ok = await confirmar("Tem certeza?", "Título opcional");
//   if (!ok) return;

import { createContext, useCallback, useContext, useState } from 'react';
import './ConfirmModal.css';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  // estado guarda a mensagem/título atuais + a função "resolve" da Promise
  // pendente. Quando não há confirmação em andamento, fica null e o modal
  // não é renderizado.
  const [estado, setEstado] = useState(null);

  const confirmar = useCallback((mensagem, titulo = 'Confirmar ação') => {
    return new Promise((resolve) => {
      setEstado({ mensagem, titulo, resolve });
    });
  }, []);

  const handleFechar = (resultado) => {
    if (estado?.resolve) {
      estado.resolve(resultado); // resolve a Promise que o "await" está esperando
    }
    setEstado(null);
  };

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}

      {estado && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-modal">
            <h3 className="confirm-titulo">{estado.titulo}</h3>
            <p className="confirm-mensagem">{estado.mensagem}</p>
            <div className="confirm-acoes">
              <button className="btn-outline" onClick={() => handleFechar(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar-perigo" onClick={() => handleFechar(true)}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm precisa ser usado dentro de <ConfirmProvider>');
  }
  return context;
}