import { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';

function CadastroAula() {
  const [nome, setNome] = useState('');
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/aulas/', { nome, link });
      navigate('/aulas');
    } catch (error) {
      console.error('Erro ao cadastrar aula:', error);
      alert('Erro ao cadastrar aula.');
    }
  };

  return (
    <Paper style={{ padding: 20, maxWidth: 500, margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Cadastrar Nova Aula
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Título da Aula"
          fullWidth
          margin="normal"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <TextField
          label="Link da Aula"
          fullWidth
          margin="normal"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Cadastrar
        </Button>
      </form>
    </Paper>
  );
}

export default CadastroAula;
