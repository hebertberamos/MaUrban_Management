import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Clientes from './Clientes';
import NovaVenda from './NovaVenda';
import Estoque from './Estoque';
import NovoProduto from './NovoProduto';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* O Layout abraça todas as rotas filhas */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="compras" element={<div>Tela de Compras</div>} />
          <Route path="vendas" element={<div>Tela de Vendas</div>} />
          <Route path="/nova-venda" element={<NovaVenda />} />
          <Route path="/novo-produto" element={<NovoProduto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}