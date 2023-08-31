import React /*, {useEffect, useState}*/ from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './components/auth/Login.jsx'; // Asegúrate de importar correctamente
import Register from './components/auth/Register.jsx'; // Asegúrate de importar correctamente
import Error from './components/error/Error.jsx';
import Footer from './components/footer/Footer.jsx';
import Header from './components/header/Header.jsx';
import Home from './components/home/Home.jsx';

function App() {
  /* ... */

  return (
    <div className="App">
      <div className='content'>
        <Header/>
        <Routes>
          <Route path='/'  element={ <Home/>} />
          {/* ...otras rutas existentes ... */}
          <Route path='/login' element={<Login />} /> {/* Ruta para iniciar sesión */}
          <Route path='/register' element={<Register />} /> {/* Ruta para registrarse */}
          <Route path='*'  element={ <Error/>} />
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default App;

