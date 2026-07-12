import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Clientes from './Clientes';
import NovaVenda from './NovaVenda';
import Estoque from './Estoque';
import NovoProduto from './NovoProduto';
import ComprasLoja from './ComprasLoja';
import NovaCompra from './NovaCompra';
import VendasClientes from './VendasClientes';
import DetalhesCliente from './DetalhesCliente';
import NovoCliente from './NovoCliente';
import Movimentacoes from './Movimentacoes';

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