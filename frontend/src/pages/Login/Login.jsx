import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TextField, Button, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import api from '@/api/api';
import './Login.scss';

function Login({ darkMode, toggleTheme }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', senha);

    const response = await api.post('/usuarios/login', formData);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    navigate('/home');
  } catch (error) {
    console.error('Erro no login', error);
    alert('Email ou senha inválidos');
  }
};

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/images/psicologia.jpg" alt="Psicologia" />
      </div>

      <div className="login-form">
        <div>
          <img src="/images/logo.png" alt="Logo" className="logo" />
          <Typography component="h1" variant="h5" className="titulo">
            Login
          </Typography>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="btn-entrar"
            onClick={handleLogin}
          >
            Entrar
          </Button>

          <IconButton onClick={toggleTheme} color="primary" className="btn-theme">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Login;
