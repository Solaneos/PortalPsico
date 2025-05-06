import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Container, Typography } from '@mui/material';

function AulaDetalhe({ darkMode, toggleTheme }) {
  const { id } = useParams();

  return (
    <>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <Container style={{ marginTop: '30px' }}>
        <Typography variant="h4" gutterBottom>Aula {id}: Gestão do Estresse</Typography>
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src="https://www.youtube.com/embed/2g1_FIGjuvc"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          ></iframe>
        </div>
      </Container>
    </>
  );
}

export default AulaDetalhe;
