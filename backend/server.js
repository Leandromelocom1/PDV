require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Importar o módulo 'path' para servir arquivos estáticos

// Iniciar o app Express
const app = express();

// Configurações de middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1); // Finalizar o processo em caso de falha na conexão
  }
};

// Chamar a função de conexão ao banco de dados
connectDB();

// Servir arquivos de imagem de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de Restaurante Funcionando');
});

// Importar as rotas de produtos
const productRoutes = require('./routes/productRoutes');
app.use('/api/produtos', productRoutes); // Certifique-se de que o prefixo '/api/produtos' esteja correto

// Importar as rotas de vendas
const saleRoutes = require('./routes/saleRoutes');
app.use('/api/vendas', saleRoutes);  // Prefixo correto para as rotas de vendas

// Importar as rotas de caixa
const caixaRoutes = require('./routes/caixaRoutes');
app.use('/api/caixa', caixaRoutes);  // Rotas de controle de caixa

// Middleware para capturar erros de rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro no servidor', error: err.message });
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
