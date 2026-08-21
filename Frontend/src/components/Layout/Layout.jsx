import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MaUrbanIcon from '../../assets/MaUrban-icon.svg';
import './Layout.css'; 

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fechar o menu mobile ao redimensionar para larguras maiores que 800px
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 800 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  // Uma forma simples de mudar o título do Header baseado na URL atual
  const titulos = {
    '/': 'Dashboard',
    '/clientes': 'Clientes',
    '/compras': 'Compras Loja',
    '/vendas': 'Vendas Clientes', 
    '/nova-venda': 'Nova Venda',
    '/nova-compra': 'Nova Compra',
    '/novo-cliente': 'Novo Cliente',
    '/movimentacoes': 'Movimentações'
  };

  const tituloAtual = titulos[location.pathname] || 'Sistema';

  const handleLinkClick = () => {
    // Fecha o menu mobile quando o usuário navega
    if (mobileMenuOpen) setMobileMenuOpen(false)
  }

  return (
    <div className="layout-container">
      {/* Menu Lateral */}
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="logo-placeholder">
          <img src={MaUrbanIcon} alt="MaUrban" className="logo-icon" />
          <span>MaUrban</span>
        </div>
        <nav className="menu">
          <Link to="/" onClick={handleLinkClick} className={location.pathname === '/' ? 'ativo' : ''}>Dashboard</Link>
          <Link to="/clientes" onClick={handleLinkClick} className={location.pathname === '/clientes' ? 'ativo' : ''}>Clientes</Link>
          <Link to="/compras" onClick={handleLinkClick} className={location.pathname === '/compras' ? 'ativo' : ''}>Compras loja</Link>
          <Link to="/vendas" onClick={handleLinkClick} className={location.pathname === '/vendas' ? 'ativo' : ''}>Vendas clientes</Link>
          <Link to="/movimentacoes" onClick={handleLinkClick} className={location.pathname === '/movimentacoes' ? 'ativo' : ''}>Movimentações</Link>
        </nav>
      </aside>

      {/* Backdrop para o menu mobile */}
      <div className={`sidebar-backdrop ${mobileMenuOpen ? 'show' : ''}`} onClick={() => setMobileMenuOpen(false)} />

      {/* Área Principal */}
      <main className="main-content">
        {/* Cabeçalho */}
        <header className="top-header">
          {/* Botão para abrir/fechar o menu em telas pequenas */}
          <button
            className="menu-toggle"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            {/* ícone hamburguer simples */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 12h18" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 18h18" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

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
