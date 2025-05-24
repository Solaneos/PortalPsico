import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Container, Typography } from '@mui/material';
import api from '@/api/api';
import { createTheme } from '@mui/material/styles';
import { Link as MuiLink } from '@mui/material';

function Aulas({ darkMode, toggleTheme }) {
  const [aulas, setAulas] = useState([]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          ...(darkMode && {
            background: {
              default: '#121212',
              paper: '#1d1d1d',
            },
            primary: {
              main: '#90caf9',
            },
            text: {
              primary: '#ffffff',
              secondary: '#b0b0b0',
            },
          }),
        },
      }),
    [darkMode]
  );


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

  return (
    <>
      <Container style={{ marginTop: '30px' }}>
        <Typography variant="h4" gutterBottom>
          Aulas Disponíveis
        </Typography>
        <List>
          {aulas.map((aula) => (
            <ListItem key={aula.id} button component={Link} to={`/aulas/${aula.id}`}>
              <ListItemText
                primary={
                  <MuiLink
                    component="span"
                    underline="hover"
                    sx={{ color: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black' }}
                  >
                    {aula.nome}
                  </MuiLink>
                }
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}

export default Aulas;
