import React /*, {useEffect, useState}*/ from 'react';

import Home from './components/home/Home.jsx';
import InicioCliente from './components/cliente/Inicio/InicioCliente.jsx';
import Error from './components/error/Error.jsx';
import Solicitudes from './components/cliente/solicitudes/Solicitudes.jsx';

import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import './App.css';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>,
    errorElement: <Error/>
  },
  {
    path: '/client/home',
    element: <InicioCliente />,
    children: [ 
      {
      path: 'requests/:id',
      element: <Solicitudes estado = "pendiente"/>
      },
      {
        path: 'finished/:id',
        element: <Solicitudes estado = "termiado"/>
        },
    ]
  }

]);

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
      <RouterProvider router={router}/>

      <Link to="/client/home">ver home clientes</Link>

    </div>
  );
}

export default App;
