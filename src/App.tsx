import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Movimientos from './pages/Movimientos';
import Metas from './pages/Metas';

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/metas" element={<Metas />} />
        </Routes>
        <footer className="app-footer">
          <p>
            MiPresupuesto CR — Proyecto académico de Desarrollo Web
          </p>
          <p style={{ marginTop: '0.25rem' }}>
            Colegio Técnico Profesional de Mercedes Norte • Eduardo, Jorge y Pablo
          </p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;