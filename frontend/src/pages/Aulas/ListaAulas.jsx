import { useEffect, useState } from 'react';
import {
  Button, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Dialog,
  DialogTitle, DialogContent, TextField, DialogActions, Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import api from '@/api/api';

function ListaAulas() {
  const [aulas, setAulas] = useState([]);
  const [open, setOpen] = useState(false);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [nome, setNome] = useState('');
  const [link, setLink] = useState('');
  const [sequencia, setSequencia] = useState(1);

  const carregarAulas = async () => {
    try {
      const response = await api.get('/aulas/');
      setAulas(response.data);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
    }
  };

  useEffect(() => {
    carregarAulas();
  }, []);

  const deletarAula = async (id) => {
    if (confirm('Deseja realmente deletar esta aula?')) {
      try {
        await api.delete(`/aulas/${id}`);
        carregarAulas();
      } catch (error) {
        console.error('Erro ao deletar aula:', error);
      }
    }
  };

  const handleAdicionar = () => {
    setAulaSelecionada(null);
    setNome('');
    setLink('');
    setSequencia(1);
    setOpen(true);
  };

  const handleEditar = (aula) => {
    setAulaSelecionada(aula);
    setNome(aula.nome);
    setLink(aula.link);
    setSequencia(aula.sequencia);
    setOpen(true);
  };

  const handleSalvar = async () => {
    try {
      if (aulaSelecionada) {
        await api.put(`/aulas/${aulaSelecionada.id}`, { nome, link, sequencia });
      } else {
        await api.post('/aulas/', { nome, link, sequencia });
      }
      setOpen(false);
      carregarAulas();
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Aulas
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: 16 }}
        onClick={handleAdicionar}
      >
        Adicionar Aula
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Título</b></TableCell>
              <TableCell><b>Link</b></TableCell>
              <TableCell align="right"><b>Ações</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {aulas.map((aula) => (
              <TableRow key={aula.id}>
                <TableCell>{aula.nome}</TableCell>
                <TableCell>
                  <Link href={aula.link} target="_blank" rel="noopener noreferrer" underline="hover" color="primary">
                    {aula.link}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditar(aula)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => deletarAula(aula.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {aulas.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhuma aula encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      
      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{aulaSelecionada ? 'Editar Aula' : 'Adicionar Aula'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Título da Aula"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            label="Link do YouTube"
            fullWidth
            margin="normal"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <TextField
            label="Sequência"
            type="number"
            fullWidth
            margin="normal"
            value={sequencia}
            onChange={(e) => setSequencia(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvar}>
            {aulaSelecionada ? 'Salvar Alterações' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListaAulas;
