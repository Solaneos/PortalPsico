import Navbar from '../../components/Navbar';

function Home({ darkMode, toggleTheme }) {
  return (
    <>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Bem-vindo ao Portal Psicologia!</h1>
        <p>Este é o menu inicial.</p>
      </div>
    </>
  );
}

export default Home;
