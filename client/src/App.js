import React, {useEffect, useState} from 'react';
import Header from './components/Header/Header.js';

function App() {

  const [backendData, setBackendData] = useState([{}]);

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
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ):(
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
    </div>
  );
}

export default App;
