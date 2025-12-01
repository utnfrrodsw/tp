import Borrower from './components/Borrower/Borrower';
import Homepage from './components/Homepage/Homepage';
import Login from './pages/about/App_login';
import Recovery from './pages/about/recovery';
import Registration from './pages/about/registration';
import './App.css';
import TurnHistory from './components/TurnHistory/TurnHistory';
import About from './pages/about/about';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Servicios from './pages/about/Servicios';
import Dashboard from './pages/dashboard/dashboard-p';
import ChangePassword from './components/recoverycard/changepassword';
import StripeCreate from './components/Stripe/stripe';
import PerfilUsuario from './components/perfilUsuario/perfilUsuario';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/prestatario/:id/:servicio?/:Tarea?/:horario?/:dia?/:montofinall?/:open?"
            element={<Borrower />}
          />
          <Route path="/Servicios" element={<Servicios />} />
          <Route
            path="/login/:id?/:servicio?/:Tarea?/:horario?/:dia?/:montofinall?"
            element={<Login />}
          />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/historial/:estado?" element={<TurnHistory />} />
          <Route path="/dashboard/:estado?" element={<Dashboard />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/stripe/crear-cuenta" element={<StripeCreate />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
