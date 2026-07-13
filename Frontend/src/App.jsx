import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Clientes from './pages/Clientes/Clientes';
import NovaVenda from './pages/NovaVenda/NovaVenda';
import Estoque from './pages/Estoque/Estoque';
import NovoProduto from './pages/NovoProduto/NovoProduto';
import ComprasLoja from './pages/ComprasLoja/ComprasLoja';
import NovaCompra from './pages/NovaCompra/NovaCompra';
import VendasClientes from './pages/VendasClientes/VendasClientes';
import DetalhesCliente from './pages/DetalhesCliente/DetalhesCliente';
import NovoCliente from './pages/NovoCliente/NovoCliente';
import Movimentacoes from './pages/Movimentacoes/Movimentacoes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* O Layout abraça todas as rotas filhas */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="compras" element={<ComprasLoja />} />
          <Route path="vendas" element={<VendasClientes />} />
          <Route path="nova-venda" element={<NovaVenda />} />
          <Route path="novo-produto" element={<NovoProduto />} />
          <Route path="nova-compra" element={<NovaCompra />} />
          <Route path="clientes/:id" element={<DetalhesCliente />} />
          <Route path="novo-cliente" element={<NovoCliente />} />
          <Route path="movimentacoes" element={<Movimentacoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}