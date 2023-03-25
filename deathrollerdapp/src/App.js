import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Navbar from './Components/Navbar';
import Dashboard from './Pages/Dashboard';
import Docs from './Pages/Docs';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Navbar><Dashboard /></Navbar>} />
        <Route path="/docs" element={<Navbar><Docs /></Navbar>} />
      </Routes>
    </Router>
  );
}

export default App;

