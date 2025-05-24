import { useMemo, useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Aulas from './pages/Aulas/Aulas';
import AulaDetalhe from './pages/Aulas/AulaDetalhe';
import ListaAulas from './pages/Aulas/ListaAulas';
import Navbar from './components/Navbar';
import ListaUsuarios from './pages/Usuarios/ListaUsuarios';
import ListaClientes from './pages/Clientes/ListaClientes';

function AppWrapper() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
      </Router>
    </ThemeProvider>
  );
}

function AppRoutes({ darkMode, toggleTheme }) {
  const location = useLocation();
  const hideNavbar = location.pathname === '/';

  return (
    <>
      {!hideNavbar && (
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      )}

      <Routes>
        <Route path="/" element={<Login darkMode={darkMode} toggleTheme={toggleTheme} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/usuarios-lista" element={<ListaUsuarios />} />
        <Route path="/clientes-lista" element={<ListaClientes />} />
        <Route path="/aulas-lista" element={<ListaAulas />} />
        <Route path="/aulas" element={<Aulas />} />
        <Route path="/aulas/:id" element={<AulaDetalhe />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
