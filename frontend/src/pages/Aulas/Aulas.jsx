import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { List, ListItem, ListItemText, Container, Typography } from '@mui/material';

function Aulas({ darkMode, toggleTheme }) {
  return (
    <>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <Container style={{ marginTop: '30px' }}>
        <Typography variant="h4" gutterBottom>Aulas Disponíveis</Typography>
        <List>
          <ListItem button component={Link} to="/aulas/1">
            <ListItemText primary="Gestão do Estresse no Ambiente Corporativo" />
          </ListItem>
        </List>
      </Container>
    </>
  );
}

export default Aulas;
