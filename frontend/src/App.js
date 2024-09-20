import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Venda from './components/Venda';
import MenuGerencial from './components/MenuGerencial';
import RelatoriosVendas from './components/RelatoriosVendas';
import Estoque from './components/Estoque';
import Caixa from './components/Caixa';  // Importar o componente Caixa
import 'bootstrap/dist/css/bootstrap.min.css';


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
              <li className="nav-item">
                <Link className="nav-link" to="/relatorios-vendas">Relatórios de Vendas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/estoque">Estoque</Link>
              </li>
              <li className="nav-item">  {/* Novo link para Caixa */}
                <Link className="nav-link" to="/caixa">Caixa</Link>  {/* Link para Caixa */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venda" element={<Venda />} />
        <Route path="/menu-gerencial" element={<MenuGerencial />} />
        <Route path="/relatorios-vendas" element={<RelatoriosVendas />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/caixa" element={<Caixa />} />  {/* Nova rota para Caixa */}
      </Routes>
    </div>
  );
};

export default App;
