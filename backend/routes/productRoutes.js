const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Rota para cadastrar produtos no estoque
router.post('/produtos', async (req, res) => {
  try {
    const { nome, preco, icone, estoque, estoqueMinimo } = req.body;
    const novoProduto = new Product({
      nome,
      preco,
      icone,
      estoque,
      estoqueMinimo
    });

    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar o produto', error });
  }
});

// Rota para atualizar um produto existente
router.put('/produtos/:id', async (req, res) => {
  try {
    const { nome, preco, icone, estoque, estoqueMinimo } = req.body;
    const produtoAtualizado = await Product.findByIdAndUpdate(
      req.params.id,
      { nome, preco, icone, estoque, estoqueMinimo },
      { new: true }
    );

    if (!produtoAtualizado) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o produto', error });
  }
});

// Rota para buscar todos os produtos disponíveis
router.get('/produtos', async (req, res) => {
  try {
    const produtos = await Product.find();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
});

module.exports = router;
