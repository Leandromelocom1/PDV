import React, { useState } from 'react';
import axios from 'axios';

const CadastroProduto = () => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [icone, setIcone] = useState('');
  const [estoque, setEstoque] = useState(''); // Novo campo de estoque
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !preco || !estoque) { // Verifique se o campo de estoque foi preenchido
      setMensagem('Preencha todos os campos.');
      return;
    }

    const novoProduto = {
      nome: nome.toUpperCase(), // Convertendo o nome para caixa alta para evitar duplicação
      preco: parseFloat(preco),
      icone,
      estoque: parseInt(estoque, 10), // Parse do estoque para número
    };

    try {
      // Verificar se o produto já existe
      const produtoExistente = await axios.get(`http://localhost:5000/api/produtos/${nome.toUpperCase()}`);
      
      if (produtoExistente.data) {
        // Se o produto já existe, atualize o estoque
        const estoqueAtualizado = produtoExistente.data.estoque + novoProduto.estoque;
        await axios.put(`http://localhost:5000/api/produtos/${produtoExistente.data._id}`, { estoque: estoqueAtualizado });
        setMensagem(`Estoque do produto ${produtoExistente.data.nome} atualizado com sucesso!`);
      } else {
        // Se o produto não existir, crie um novo
        const response = await axios.post('http://localhost:5000/api/produtos', novoProduto);
        setMensagem(`Produto ${response.data.nome} cadastrado com sucesso!`);
      }
      
      setNome('');
      setPreco('');
      setIcone('');
      setEstoque(''); // Limpar o campo de estoque
    } catch (error) {
      setMensagem('Erro ao cadastrar ou atualizar o produto. Tente novamente.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary">Cadastro de Produto / Atualização de Estoque</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome do Produto</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Preço</label>
          <input
            type="number"
            className="form-control"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Ícone (Opcional)</label>
          <input
            type="text"
            className="form-control"
            value={icone}
            onChange={(e) => setIcone(e.target.value)}
            placeholder="Ex: 🍕"
          />
        </div>
        <div className="form-group">
          <label>Quantidade no Estoque</label> {/* Campo para alimentar o estoque */}
          <input
            type="number"
            className="form-control"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {nome ? 'Cadastrar ou Atualizar Estoque' : 'Cadastrar Produto'}
        </button>
      </form>
      {mensagem && <p className="mt-3">{mensagem}</p>}
    </div>
  );
};

export default CadastroProduto;
