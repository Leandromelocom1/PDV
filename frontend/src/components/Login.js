import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar o hook useNavigate
import { useAuth } from '../context/AuthContext'; // Para gerenciar o contexto de autenticação

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Função de login do contexto
  const navigate = useNavigate(); // Definir o navigate para redirecionamento

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.0.78:5000/api/auth/login', {
        username,
        password,
      });
      
      // Salvar o token ou outras informações conforme necessário
      const { token, role } = response.data;

      // Chame o login do contexto para armazenar o token e o usuário no estado global
      login(token, role);

      // Redirecionar para a página inicial (ou qualquer outra página)
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Usuário:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Senha:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Login;
