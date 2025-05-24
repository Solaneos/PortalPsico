import { useEffect, useState } from 'react';
import {
  Button, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Checkbox, FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import api from '@/api/api';

function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    max_cadastros: 1,
    ativo: true,
    emailrh: ''
  });

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes/');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleOpen = (cliente = null) => {
    if (cliente) {
      setClienteEditando(cliente);
      setForm({
        nome: cliente.nome,
        cnpj: cliente.cnpj,
        max_cadastros: cliente.max_cadastros,
        ativo: cliente.ativo,
        emailrh: cliente.emailrh
      });
    } else {
      setClienteEditando(null);
      setForm({ nome: '', cnpj: '', max_cadastros: 1, ativo: true, emailrh: ''});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSalvar = async () => {
    try {
      if (clienteEditando) {
        await api.put(`/clientes/${clienteEditando.id}`, form);
      } else {
        await api.post('/clientes/', form);
      }
      carregarClientes();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleDeletar = async (id) => {
    if (confirm('Deseja realmente desativar este cliente?')) {
      try {
        await api.delete(`/clientes/${id}`);
        carregarClientes();
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Clientes
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: 16 }}
        onClick={() => handleOpen()}
      >
        Adicionar Cliente
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Nome</b></TableCell>
              <TableCell><b>CNPJ</b></TableCell>
              <TableCell><b>Máx. Cadastros</b></TableCell>
              <TableCell><b>Ativo</b></TableCell>
              <TableCell align="right"><b>Ações</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.cnpj}</TableCell>
                <TableCell>{cliente.max_cadastros}</TableCell>
                <TableCell>{cliente.ativo ? 'Sim' : 'Não'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(cliente)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeletar(cliente.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {clientes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{clienteEditando ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            fullWidth
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="CNPJ"
            fullWidth
            value={form.cnpj}
            onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
          />
          <TextField
            label="E-mail do RH"
            variant="outlined"
            fullWidth
            margin="normal"
            value={form.emailrh}
            onChange={(e) => setForm({ ...form, emailrh: e.target.value })}
            />
          <TextField
            margin="dense"
            label="Máx. Cadastros"
            type="number"
            fullWidth
            value={form.max_cadastros}
            onChange={(e) => setForm({ ...form, max_cadastros: parseInt(e.target.value) })}
          />

          {clienteEditando && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.ativo}
                  onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                />
              }
              label="Ativo"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvar}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListaClientes;
