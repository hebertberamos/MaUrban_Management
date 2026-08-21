import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Clientes from './pages/Clientes/Clientes';
import NovaVenda from './pages/NovaVenda/NovaVenda';
import ComprasLoja from './pages/ComprasLoja/ComprasLoja';
import NovaCompra from './pages/NovaCompra/NovaCompra';
import VendasClientes from './pages/VendasClientes/VendasClientes';
import DetalhesCliente from './pages/DetalhesCliente/DetalhesCliente';
import NovoCliente from './pages/NovoCliente/NovoCliente';
import Movimentacoes from './pages/Movimentacoes/Movimentacoes';
import NovaDespesa from './pages/NovaDespesa/NovaDespesa';
import { ConfirmProvider } from './components/ConfirmModal/ConfirmModal';

export default function App() {
  return (
    <ConfirmProvider>
      <BrowserRouter>
        <Routes>
          {/* O Layout abraça todas as rotas filhas */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="compras" element={<ComprasLoja />} />
            <Route path="vendas" element={<VendasClientes />} />
            <Route path="nova-venda" element={<NovaVenda />} />
            <Route path="nova-compra" element={<NovaCompra />} />
            <Route path="clientes/:id" element={<DetalhesCliente />} />
            <Route path="novo-cliente" element={<NovoCliente />} />
            <Route path="movimentacoes" element={<Movimentacoes />} />
            <Route path="nova-despesa" element={<NovaDespesa />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfirmProvider>
  );
}