import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css'; 

export default function Layout() {
  const location = useLocation();

  // Uma forma simples de mudar o título do Header baseado na URL atual
  const titulos = {
    '/': 'Dashboard',
    '/clientes': 'Clientes',
    '/estoque': 'Estoque',
    '/compras': 'Compras Loja',
    '/vendas': 'Vendas Clientes',
  };

  const tituloAtual = titulos[location.pathname] || 'Sistema';

  return (
    <div className="layout-container">
      {/* Menu Lateral */}
      <aside className="sidebar">
        <div className="logo-placeholder">MU MaUrban</div>
        <nav className="menu">
          <Link to="/" className={location.pathname === '/' ? 'ativo' : ''}>Dashboard</Link>
          <Link to="/clientes" className={location.pathname === '/clientes' ? 'ativo' : ''}>Clientes</Link>
          <Link to="/estoque" className={location.pathname === '/estoque' ? 'ativo' : ''}>Estoque</Link>
          <Link to="/compras" className={location.pathname === '/compras' ? 'ativo' : ''}>Compras loja</Link>
          <Link to="/vendas" className={location.pathname === '/vendas' ? 'ativo' : ''}>Vendas clientes</Link>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="main-content">
        {/* Cabeçalho */}
        <header className="top-header">
          <h1>{tituloAtual}</h1>
        </header>

        {/* Aqui é onde o conteúdo de cada tela será renderizado */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}