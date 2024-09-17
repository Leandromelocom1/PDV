import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Venda from './components/Venda';
import MenuGerencial from './components/MenuGerencial';
// import CadastroProduto from './components/CadastroProduto';
import RelatoriosVendas from './components/RelatoriosVendas';  // Importando o componente de Relatórios de Vendas
import Estoque from './components/Estoque';  // Importando o componente de Estoque

const App = () => {
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
              <li className="nav-item">
                <Link className="nav-link" to="/venda">Venda</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/menu-gerencial">Menu Gerencial</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/cadastro-produto">Cadastro de Produto</Link>
              </li> */}
              <li className="nav-item">
                <Link className="nav-link" to="/relatorios-vendas">Relatórios de Vendas</Link>
              </li>
              <li className="nav-item">  {/* Novo link para Estoque */}
                <Link className="nav-link" to="/estoque">Estoque</Link>  {/* Link para Estoque */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venda" element={<Venda />} />
        <Route path="/menu-gerencial" element={<MenuGerencial />} />
        {/* <Route path="/cadastro-produto" element={<CadastroProduto />} /> */}
        <Route path="/relatorios-vendas" element={<RelatoriosVendas />} />
        <Route path="/estoque" element={<Estoque />} />  {/* Nova rota para Estoque */}
      </Routes>
    </div>
  );
};

export default App;
