import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Estoque = () => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [icone, setIcone] = useState('');
  const [estoque, setEstoque] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');

  // Função para buscar os produtos cadastrados no backend
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  // Função para cadastrar ou atualizar um produto
  const cadastrarOuAtualizarProduto = async (e) => {
    e.preventDefault();

    try {
      const produtoData = {
        nome: nome.toUpperCase(), // Sempre enviar o nome em caixa alta
        preco: parseFloat(preco),
        icone,
        estoque: parseInt(estoque, 10),
        estoqueMinimo: parseInt(estoqueMinimo, 10),
      };

      if (produtoSelecionado) {
        // Atualizar o produto existente
        const response = await axios.put(`http://localhost:5000/api/produtos/${produtoSelecionado}`, produtoData);
        setMensagem(`Produto ${response.data.nome} atualizado com sucesso!`);
      } else {
        // Cadastrar um novo produto
        const response = await axios.post('http://localhost:5000/api/produtos', produtoData);
        setMensagem(`Produto ${response.data.nome} cadastrado com sucesso!`);
        setProdutos([...produtos, response.data]); // Atualiza a lista de produtos
      }

      // Limpar campos do formulário
      setNome('');
      setPreco('');
      setIcone('');
      setEstoque('');
      setEstoqueMinimo('');
      setProdutoSelecionado('');

    } catch (error) {
      // Mostrar mensagem de erro se o produto já existir ou houver outro problema
      if (error.response && error.response.data.message) {
        setMensagem(error.response.data.message);
      } else {
        setMensagem('Erro ao processar o produto.');
      }
    }
  };

  // Função para selecionar um produto existente do dropdown
  const selecionarProduto = (e) => {
    const produtoId = e.target.value;
    const produto = produtos.find(p => p._id === produtoId);

    if (produto) {
      setNome(produto.nome);
      setPreco(produto.preco);
      setIcone(produto.icone);
      setEstoque(produto.estoque);
      setEstoqueMinimo(produto.estoqueMinimo);
      setProdutoSelecionado(produtoId);
    } else {
      setNome('');
      setPreco('');
      setIcone('');
      setEstoque('');
      setEstoqueMinimo('');
      setProdutoSelecionado('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary">Gerenciamento de Estoque</h2>

      {/* Dropdown de produtos existentes */}
      <div className="form-group">
        <label>Selecione um Produto Cadastrado</label>
        <div className="d-flex">
          <select className="form-control" onChange={selecionarProduto} value={produtoSelecionado}>
            <option value="">-- Selecione um Produto --</option>
            {produtos.map(produto => (
              <option key={produto._id} value={produto._id}>
                {produto.nome}
              </option>
            ))}
          </select>
          {/* Botão para adicionar um novo produto */}
          <button
            type="button"
            className="btn btn-success ml-2"
            onClick={() => setProdutoSelecionado('')}
          >
            + Novo Produto
          </button>
        </div>
      </div>

      {/* Formulário para cadastro/atualização de produto */}
      <form onSubmit={cadastrarOuAtualizarProduto}>
        <div className="form-group">
          <label>Nome do Produto</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Preço</label>
          <input
            type="number"
            className="form-control"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Ícone (Opcional)</label>
          <input
            type="text"
            className="form-control"
            value={icone}
            onChange={(e) => setIcone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Estoque</label>
          <input
            type="number"
            className="form-control"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Estoque Mínimo</label>
          <input
            type="number"
            className="form-control"
            value={estoqueMinimo}
            onChange={(e) => setEstoqueMinimo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {produtoSelecionado ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </button>
      </form>

      {mensagem && <p className="mt-3">{mensagem}</p>}
    </div>
  );
};

export default Estoque;
