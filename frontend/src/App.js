import React from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Venda from './components/Venda';
import MenuGerencial from './components/MenuGerencial';
import RelatoriosVendas from './components/RelatoriosVendas';
import Estoque from './components/Estoque';
import Caixa from './components/Caixa';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente para proteger as rotas que requerem autenticação
const PrivateRoute = ({ element: Element, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Se o usuário não estiver logado, redirecionar para a tela de login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Se o usuário não tiver o papel necessário, redirecionar para a página inicial
    return <Navigate to="/" />;
  }

  return <Element />;
};

const App = () => {
  const { user, logout } = useAuth(); // Pegamos o logout do contexto de autenticação

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">PDV</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/venda">Venda</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/menu-gerencial">Menu Gerencial</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/relatorios-vendas">Relatórios de Vendas</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/estoque">Estoque</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/caixa">Caixa</Link>
                  </li>
                  {/* Botão de logoff */}
                  <li className="nav-item">
                    <button className="btn btn-danger nav-link" onClick={logout}>Logoff</button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Definição de rotas */}
      <Routes>
        {/* Rota de login sem proteção */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route path="/" element={<PrivateRoute element={Home} allowedRoles={['admin', 'vendedor']} />} />
        <Route path="/venda" element={<PrivateRoute element={Venda} allowedRoles={['admin', 'vendedor']} />} />
        <Route path="/menu-gerencial" element={<PrivateRoute element={MenuGerencial} allowedRoles={['admin']} />} />
        <Route path="/relatorios-vendas" element={<PrivateRoute element={RelatoriosVendas} allowedRoles={['admin']} />} />
        <Route path="/estoque" element={<PrivateRoute element={Estoque} allowedRoles={['admin']} />} />
        <Route path="/caixa" element={<PrivateRoute element={Caixa} allowedRoles={['admin', 'vendedor']} />} />
      </Routes>
    </div>
  );
};

// RootApp encapsula o AuthProvider para que o contexto de autenticação seja acessível em todo o app
const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
