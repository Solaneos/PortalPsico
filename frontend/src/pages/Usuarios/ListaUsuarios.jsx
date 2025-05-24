import { useEffect, useState } from 'react';
import {
  Button, IconButton, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import api from '@/api/api';

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    tipo: 'FUNC',
    data_nasc: '',
    cliente_id: '',
  });

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios/');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const carregarClientes = async () => {
    try {
      const response = await api.get('/clientes/');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  useEffect(() => {
    carregarUsuarios();
    carregarClientes();
  }, []);

  const handleOpen = (usuario = null) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setForm({
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        senha: '',
        tipo: usuario.tipo,
        data_nasc: usuario.data_nasc || '',
        cliente_id: usuario.cliente_id || '',
      });
    } else {
      setUsuarioEditando(null);
      setForm({
        nome: '',
        cpf: '',
        email: '',
        senha: '',
        tipo: 'FUNC',
        data_nasc: '',
        cliente_id: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSalvar = async () => {
    try {
      const payload = { ...form };
      if (!payload.cliente_id) payload.cliente_id = null;
      if (usuarioEditando) {
        await api.put(`/usuarios/${usuarioEditando.id}`, payload);
      } else {
        await api.post('/usuarios/', payload);
      }
      carregarUsuarios();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleDeletar = async (id) => {
    if (confirm('Deseja realmente excluir este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Usuários
      </Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        style={{ marginBottom: 16 }}
        onClick={() => handleOpen()}
      >
        Adicionar Usuário
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Nome</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>CPF</b></TableCell>
              <TableCell><b>Tipo</b></TableCell>
              <TableCell><b>Cliente</b></TableCell>
              <TableCell align="right"><b>Ações</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {usuarios.map((usuario) => {
              const cliente = clientes.find(c => c.id === usuario.cliente_id);
              return (
                <TableRow key={usuario.id}>
                  <TableCell>{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.cpf}</TableCell>
                  <TableCell>{usuario.tipo}</TableCell>
                  <TableCell>{cliente ? cliente.nome : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(usuario)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeletar(usuario.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}

            {usuarios.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/*  Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{usuarioEditando ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
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
            label="CPF"
            fullWidth
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Senha"
            type="password"
            fullWidth
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Data de Nascimento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.data_nasc}
            onChange={(e) => setForm({ ...form, data_nasc: e.target.value })}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Tipo</InputLabel>
            <Select
              value={form.tipo}
              label="Tipo"
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            >
              <MenuItem value="MASTER">MASTER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="FUNC">FUNC</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Cliente</InputLabel>
            <Select
              value={form.cliente_id || ''}
              label="Cliente"
              onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
            >
              <MenuItem value=""><i>Sem Cliente</i></MenuItem>
              {clientes.map(cliente => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvar}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListaUsuarios;
