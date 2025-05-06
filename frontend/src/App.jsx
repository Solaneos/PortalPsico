import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Aulas from './pages/Aulas/Aulas';
import AulaDetalhe from './pages/Aulas/AulaDetalhe';

function App({ darkMode, toggleTheme }) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login darkMode={darkMode} toggleTheme={toggleTheme} />} />
        <Route path="/home" element={<Home darkMode={darkMode} toggleTheme={toggleTheme} />} />
        <Route path="/aulas" element={<Aulas darkMode={darkMode} toggleTheme={toggleTheme} />} />
        <Route path="/aulas/:id" element={<AulaDetalhe darkMode={darkMode} toggleTheme={toggleTheme} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
