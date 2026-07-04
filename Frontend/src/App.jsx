import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Clientes from './Clientes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* O Layout abraça todas as rotas filhas */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          {/* Crie e adicione as outras telas aqui depois */}
          <Route path="produtos" element={<div>Tela de Produtos</div>} />
          <Route path="estoque" element={<div>Tela de Estoque</div>} />
          <Route path="compras" element={<div>Tela de Compras</div>} />
          <Route path="vendas" element={<div>Tela de Vendas</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}