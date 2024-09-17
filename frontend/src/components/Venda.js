import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Venda.css'; // Importar o arquivo CSS personalizado
import 'bootstrap/dist/css/bootstrap.min.css';

const Venda = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [total, setTotal] = useState(0);
  const [mostrarPagamento, setMostrarPagamento] = useState(false); // Variável utilizada para exibir modal de pagamento
  const [numeroPedido, setNumeroPedido] = useState(1); // Inicializa o número do pedido
  const [caixaAberto, setCaixaAberto] = useState(false); // Estado para verificar se o caixa está aberto

  // Função para buscar os produtos do backend
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/produtos'); // Verifica se o backend está rodando na porta correta
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();

    // Verificar se o caixa está aberto e o número de pedidos (usando localStorage)
    const caixaStatus = localStorage.getItem('caixaAberto');
    const pedidoAtual = localStorage.getItem('numeroPedidos');
    
    setCaixaAberto(caixaStatus === 'true');
    setNumeroPedido(pedidoAtual ? parseInt(pedidoAtual, 10) : 1); // Recuperar número de pedido ou iniciar em 1
  }, []);

  // Função para adicionar produto no carrinho
  const adicionarProduto = (produto) => {
    if (!caixaAberto) {
      alert('Você precisa abrir o caixa antes de adicionar produtos.');
      return;
    }

    const itemExistente = carrinho.find((item) => item._id === produto._id);

    if (produto.estoque <= 0) {
      alert(`Produto ${produto.nome} está esgotado!`);
      return;
    }

    if (produto.estoque <= produto.estoqueMinimo) {
      alert(`Atenção: Estoque baixo para o produto ${produto.nome}.`);
    }

    if (itemExistente) {
      alert(`Produto ${produto.nome} já está no carrinho.`);
      return;
    }

    setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    setTotal(total + produto.preco);
  };

  // Função para alterar a quantidade de produtos no carrinho
  const alterarQuantidade = (produto, novaQuantidade) => {
    const novaQuantidadeNumerica = parseInt(novaQuantidade, 10);
    if (novaQuantidadeNumerica > produto.estoque) {
      alert(`Quantidade excede o estoque disponível de ${produto.nome}. Estoque atual: ${produto.estoque}`);
      return;
    }
    if (novaQuantidadeNumerica >= 1) {
      const novoCarrinho = carrinho.map((item) =>
        item._id === produto._id ? { ...item, quantidade: novaQuantidadeNumerica } : item
      );
      const totalAtualizado = novoCarrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
      setCarrinho(novoCarrinho);
      setTotal(totalAtualizado);
    }
  };

  // Função para remover produto do carrinho
  const removerProduto = (produto) => {
    const novoCarrinho = carrinho.filter((item) => item._id !== produto._id);
    setCarrinho(novoCarrinho);
    setTotal(total - produto.preco * produto.quantidade);
  };

  // Função para finalizar a compra
  const finalizarCompra = () => {
    if (!caixaAberto) {
      alert('Você precisa abrir o caixa antes de realizar vendas.');
      return;
    }

    if (carrinho.length > 0) {
      setMostrarPagamento(true);
    } else {
      alert('Carrinho está vazio!');
    }
  };

  // Função para confirmar pagamento e enviar dados para o backend
  const confirmarPagamento = async (metodoPagamento) => {
    try {
      const venda = {
        produtos: carrinho.map(item => ({
          nome: item.nome,
          preco: item.preco,
          quantidade: item.quantidade
        })),
        total,
        metodoPagamento,
        numeroPedido,  // Enviar o número do pedido
      };

      console.log('Enviando venda:', venda);  // Log para depuração

      // Enviar os dados para o backend
      const response = await axios.post('http://localhost:5000/api/vendas', venda);

      console.log('Resposta do backend:', response.data);
      setCarrinho([]);
      setTotal(0);
      setMostrarPagamento(false);

      const novoNumeroPedido = numeroPedido + 1;
      setNumeroPedido(novoNumeroPedido);  // Incrementar o número do pedido
      localStorage.setItem('numeroPedidos', novoNumeroPedido); // Persistir número do pedido no localStorage

      alert(`Compra finalizada com pagamento via: ${metodoPagamento}`);
    } catch (error) {
      console.error('Erro ao salvar a venda:', error.response?.data || error.message);
      alert('Erro ao finalizar a compra, verifique os dados e tente novamente.');
    }
  };

  // Função para cancelar a compra
  const cancelarCompra = () => {
    setCarrinho([]);
    setTotal(0);
  };

  // Função para fechar o modal de pagamento
  const fecharModalPagamento = () => {
    setMostrarPagamento(false);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 mb-4">
          <h2 className="text-primary">Produtos Disponíveis</h2>
          <div className="row">
            {produtos.length === 0 ? (
              <p>Nenhum produto disponível.</p>
            ) : (
              produtos.map((produto) => (
                <div key={produto._id} className="col-md-4 mb-4">
                  <div
                    className={`card shadow-sm h-100 ${produto.estoque === 0 ? 'apagado' : ''}`}
                    onClick={() => adicionarProduto(produto)}
                    style={{ cursor: produto.estoque > 0 ? 'pointer' : 'not-allowed' }}
                  >
                    <div className="card-body text-center">
                      <span style={{ fontSize: '3rem' }}>{produto.estoque > 0 ? produto.icone : '❌'}</span>
                      <h5 className="card-title mt-3">{produto.nome}</h5>
                      <p className="card-text">R$ {produto.preco.toFixed(2)}</p>
                      <p className="text-danger">
                        {produto.estoque === 0 ? 'Estoque esgotado!' : (produto.estoque <= produto.estoqueMinimo ? 'Estoque baixo!' : '')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-lg p-3 mb-5 bg-white rounded">
            <h3 className="text-primary">Pedido #{numeroPedido}</h3>
            {carrinho.length === 0 ? (
              <p className="text-muted">Carrinho vazio</p>
            ) : (
              <ul className="list-group list-group-flush mb-3">
                {carrinho.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      {item.nome} - R$ {item.preco.toFixed(2)}
                      <input
                        type="number"
                        min="1"
                        value={item.quantidade}
                        onChange={(e) => alterarQuantidade(item, e.target.value)}
                        className="ml-2 form-control d-inline-block"
                        style={{ width: '60px' }}
                      />
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removerProduto(item)}
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <h4 className="font-weight-bold">Valor Total: R$ {total.toFixed(2)}</h4>
            <button className="btn btn-success btn-block mb-2" onClick={finalizarCompra}>
              Receber e Finalizar
            </button>
            <button className="btn btn-secondary btn-block" onClick={cancelarCompra}>
              Cancelar
            </button>
          </div>

          {/* Modal de Pagamento */}
          {mostrarPagamento && (
            <div className="pagamento-modal bg-light p-4 position-relative">
              <button
                className="btn-close position-absolute top-0 end-0"
                aria-label="Fechar"
                onClick={fecharModalPagamento}
              ></button>
              <h2>Forma de Pagamento</h2>
              <button className="btn btn-primary mb-2" onClick={() => confirmarPagamento('Dinheiro')}>Dinheiro</button>
              <button className="btn btn-secondary mb-2" onClick={() => confirmarPagamento('Cartão de Crédito')}>Cartão de Crédito</button>
              <button className="btn btn-success mb-2" onClick={() => confirmarPagamento('Cartão de Débito')}>Cartão de Débito</button>
              <button className="btn btn-warning mb-2" onClick={() => confirmarPagamento('Mumbuca')}>Mumbuca</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Venda;
