const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  icone: { type: String },
  estoque: { type: Number, required: true }, // Quantidade atual em estoque
  estoqueMinimo: { type: Number, required: true } // Estoque mínimo para gerar alerta
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
