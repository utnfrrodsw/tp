import React /*, {useEffect, useState}*/ from 'react';

import InicioCliente from './components/cliente/Inicio/InicioCliente.jsx';
import Solicitudes from './components/cliente/solicitudes/Solicitudes.jsx';
import Error from './components/error/Error.jsx';
import Footer from './components/footer/Footer.jsx';
import Header from './components/header/Header.jsx';
import Home from './components/home/Home.jsx';
import InicioPrestador from './components/prestador/inicio/InicioPrestador.jsx';
import Login from './components/usuario/login/Login.jsx';
import Register from './components/usuario/register/Register.jsx';
import DetalleServicio from './components/prestador/detalleServicio/DetalleServicio.jsx'
import { Route, Routes } from 'react-router-dom';
import './App.css';


function App() {

  return (
    <div className="App">
      <Header/>
      <div className='content'>
        <Routes>
          <Route path='/login'  element={ <Login/>}/>
          <Route path='/register'  element={ <Register/>}/>
          <Route path='/'  element={ <Home/>} />
          <Route path='/provider/home'  element={ <InicioPrestador/>}/>
          <Route path='/client/home'  element={ <InicioCliente/>}/>
          <Route path='/client/home/requests'  element={ <Solicitudes estado = "pendiente"/>}>
            {/*<Route path=':id'  element={ <details/>}/>*/}
          </Route> 
          <Route path='/client/home/progress'  element={ <Solicitudes estado = "enProgreso"/>}>

          </Route>
          <Route path='/client/home/finished'  element={ <Solicitudes estado = "terminado"/>}>

          
            <Route path='/provider/adDetails' element={<DetalleServicio/>}></Route>
          <Route path='/client/home'  element={ <InicioCliente/>}>
            <Route path='requests'  element={ <Solicitudes estado = "pendiente"/>} />
            <Route path='finished'  element={ <Solicitudes estado = "terminado"/>} />
          </Route>
          {/*<Route path='/evaluations'  element={ <Evaluaciones/>} />*/}
          <Route path='*'  element={ <Error/>} />
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default App;
