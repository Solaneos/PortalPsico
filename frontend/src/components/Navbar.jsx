import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Menu,
  MenuItem, Button
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function Navbar({ toggleTheme, darkMode }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [isMaster, setIsMaster] = useState(false);
  const open = Boolean(anchorEl);
  const adminOpen = Boolean(adminAnchorEl);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.tipo === 'MASTER') {
          setIsMaster(true);
        }
      } catch (error) {
        console.error('Erro ao decodificar token', error);
      }
    }
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleAdminClick = (event) => setAdminAnchorEl(event.currentTarget);
  const handleAdminClose = () => setAdminAnchorEl(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Button
          color="inherit"
          onClick={() => navigate('/home')}
          sx={{ textTransform: 'none' }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Portal Psicologia
          </Typography>
        </Button>

        <div style={{ flexGrow: 1 }} />

        <Button
          color="inherit"
          startIcon={<MenuBookIcon />}
          onClick={handleClick}
        >
          Aulas
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { handleClose(); navigate('/aulas'); }}>
            Todas as Aulas
          </MenuItem>
          {/* <MenuItem onClick={handleClose}>Meus Cursos</MenuItem>
          <MenuItem onClick={handleClose}>Favoritos</MenuItem> */}
        </Menu>

        {isMaster && (
          <>
            <Button
              color="inherit"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={handleAdminClick}
            >
              Administração
            </Button>

            <Menu
              anchorEl={adminAnchorEl}
              open={adminOpen}
              onClose={handleAdminClose}
            >
              <MenuItem onClick={() => { handleAdminClose(); navigate('/clientes-lista'); }}>
                Clientes
              </MenuItem>
              <MenuItem onClick={() => { handleAdminClose(); navigate('/usuarios-lista'); }}>
                Usuários
              </MenuItem>
              <MenuItem onClick={() => { handleAdminClose(); navigate('/aulas-lista'); }}>
                Aulas
              </MenuItem>
            </Menu>
          </>
        )}

        <IconButton color="inherit" onClick={toggleTheme}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>

    </AppBar>
  );
}

export default Navbar;
