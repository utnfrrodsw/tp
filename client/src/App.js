import React /*, {useEffect, useState}*/ from 'react';

import InicioCliente from './components/cliente/Inicio/InicioCliente.jsx';
import Solicitudes from './components/cliente/solicitudes/Solicitudes.jsx';
import Error from './components/error/Error.jsx';
import Evaluaciones from './components/evaluaciones/Evaluaciones.jsx';
import Footer from './components/footer/Footer.jsx';
import Header from './components/header/Header.jsx';
import Home from './components/home/Home.jsx';
import InicioPrestador from './components/prestador/inicio/InicioPrestador.jsx';
import DetalleServicio from './components/prestador/detalleServicio/DetalleServicio.jsx'
import { Route, Routes } from 'react-router-dom';
import './App.css';


function App() {

  /*const [backendData, setBackendData] = useState([{}]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks")
      .then(
        response => response.json()
      )
      .then(
        data => {
          setBackendData(data)
        })
      .catch(
        error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);*/

  return (
    <div className="App">
      <div className='content'>
        <Header/>
        <Routes>
          <Route path='/'  element={ <Home/>} />
          <Route path='/provider/home'  element={ <InicioPrestador/>}/>
            <Route path='/provider/adDetails' element={<DetalleServicio/>}></Route>
          <Route path='/client/home'  element={ <InicioCliente/>}>
            <Route path='requests'  element={ <Solicitudes estado = "pendiente"/>} />
            <Route path='finished'  element={ <Solicitudes estado = "terminado"/>} />
          </Route>
          <Route path='/evaluations'  element={ <Evaluaciones/>} />
          <Route path='*'  element={ <Error/>} />
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
