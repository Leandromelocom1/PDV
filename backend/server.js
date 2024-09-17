require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Iniciar o app Express
const app = express();

// Configurações de middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB');
}).catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de Restaurante Funcionando');
});

// Importar as rotas de produtos
const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

// Importar as rotas de vendas
const saleRoutes = require('./routes/saleRoutes');
app.use('/api/vendas', saleRoutes);  // Prefixo correto para as rotas de vendas

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
