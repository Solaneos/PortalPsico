import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import api from '@/api/api';

function AulaDetalhe({ darkMode, toggleTheme }) {
  const { id } = useParams();
  const [aula, setAula] = useState(null);
  const [loading, setLoading] = useState(true);

  const carregarAula = async () => {
    try {
      const response = await api.get(`/aulas/${id}`);
      setAula(response.data);
    } catch (error) {
      console.error('Erro ao carregar aula:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAula();
  }, [id]);

  const extrairIdDoYoutube = (url) => {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <>
      <Container style={{ marginTop: '30px' }}>
        {loading ? (
          <CircularProgress />
        ) : aula ? (
          <>
            <Typography variant="h4" gutterBottom>
              {aula.nome}
            </Typography>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${extrairIdDoYoutube(aula.link)}`}
                title={aula.nome}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          </>
        ) : (
          <Typography>Aula não encontrada.</Typography>
        )}
      </Container>
    </>
  );
}

export default AulaDetalhe;
