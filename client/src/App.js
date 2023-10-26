import React /*, {useEffect, useState}*/ from 'react';

import { Route, Routes } from 'react-router-dom';
import InicioCliente from './components/cliente/Inicio/InicioCliente.jsx';
import Solicitudes from './components/cliente/solicitudes/Solicitudes.jsx';
import Error from './components/error/Error.jsx';
import Footer from './components/footer/Footer.jsx';
import Header from './components/header/Header.jsx';
import Home from './components/home/Home.jsx';
import Evaluaciones from './components/prestador/evaluaciones/Evaluaciones';
import InicioPrestador from './components/prestador/inicio/InicioPrestador.jsx';
import Presupuesto from './components/prestador/presupuesto/Presupuesto.jsx';
import DatosUser from './components/usuario/datosPersonales/datosUser.jsx';
import Login from './components/usuario/login/Login.jsx';
import RecuperarClave from './components/usuario/login/RecuperarClave';
import Register from './components/usuario/register/Register.jsx';

import ProtectedRoute from './components/Routes/ProtectedRoute.jsx';
import ProtectedRouteProvider from './components/Routes/ProtectedRouteProvider.jsx';
import ProtectedRouteClient from './components/Routes/ProtectedRouteClient.jsx';
import ProtectedRouteUser from './components/Routes/ProtectedRouteUser.jsx';


import './App.css';


function App() {


  return (
    <div className="App">
      <Header/>
      <div className='content'>
        <Routes>
          <Route path='/' element={<ProtectedRoute/>} >
            <Route path='/'  element={ <Home/>} />
            <Route path='/login'  element={ <Login/>}/>
            <Route path='/register'  element={ <Register/>}/>
            <Route path='/recuperarClave' element={<RecuperarClave/>} />
          </Route>
          {/*rutas protegidas user*/}
          
          <Route path='/' element={<ProtectedRouteUser/>}>
            <Route path='/user' element={<DatosUser />} />
          </Route>

          {/*prestador*/}
          <Route path='/' element={<ProtectedRouteProvider/>}>
            <Route path='/evaluations' element={<Evaluaciones />} />
            <Route path='/provider/home'  element={ <InicioPrestador/>}/>
            <Route path='/provider/budget/:id' element={<Presupuesto/>}/>
          </Route>

          {/*cliente*/}
          <Route path='/' element={<ProtectedRouteClient/>}>
            <Route path='/client/home'  element={ <InicioCliente/>}/>
            <Route path='/client/home/active'  element={ <Solicitudes estado = "activa" />}/>
            <Route path='/client/home/progress'  element={ <Solicitudes estado = "progreso" />}/> 
            <Route path='/client/home/finished'  element={ <Solicitudes estado = "terminado" />}/>
          </Route>
          
          <Route path="*" errorElement={<Error/>}/>;
        </Routes >
      </div>
      <Footer/>
    </div>
  );
}

export default App;
