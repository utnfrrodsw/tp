import React, {useEffect, useState} from 'react';

function App() {

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("../api/tasks")
      .then(
        res => res.json()
      )
      .then(
        data => setBackendData(data)
      )
      .catch(
        error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  return (
    <div className="App">
      {(typeof backendData.users !== 'undefined') ? (
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
