<<<<<<< HEAD
import './App.css';
import { Formulario } from './components/Formulario';
import { Home } from './components/Home';
import { useState } from 'react';
=======
import React, {useEffect, useState} from 'react';
import Header from './components/Header/Header.js';
import InicioCliente from './Cliente/Inicio/InicioCliente.js';
import './App.css';
>>>>>>> pre-main


function App() {

const[user,setUser]= useState([])

<<<<<<< HEAD
return (
<div className="App">
{
  !user. length > 0
  ? <Formulario setUser={setUser} />
  :<Home user={user} setUser={setUser} />
=======
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
  }, []);

  return (
    <div className="App">
      <Header />
      <InicioCliente />


      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ):(
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
    </div>
  );
>>>>>>> pre-main
}

  
</div>

)

}



export default App;
