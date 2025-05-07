// src/components/Login.tsx

//import React, { useState } from 'react';
//import { saveTokens } from '../Servicios/authService'; // Importa el servicio

//const Login = () => {
  //const [email, setEmail] = useState('');
  //const [password, setPassword] = useState('');
  
  //const handleSubmit = async (e: React.FormEvent) => {
    //e.preventDefault();
    
    //const response = await fetch('http://localhost:3000/api/login', {
     // method: 'POST',
      //headers: {
        //'Content-Type': 'application/json',
      //},
      //body: JSON.stringify({ email, password }),
    //});

    //const data = await response.json();
    
    //if (response.ok) {
      //saveTokens(data.accessToken, data.refreshToken); // Guarda los tokens
      // Redirige al dashboard o página de inicio
    //} else {
      //console.error('Error al iniciar sesión');
    //}
  //};

  //return (
    //<form onSubmit={handleSubmit}>
      //<input 
        //type="email" 
        //value={email} 
        //onChange={(e) => setEmail(e.target.value)} 
        //required 
      ///>
      //<input 
        //type="password" 
        //value={password} 
        //onChange={(e) => setPassword(e.target.value)} 
        //required 
      ///>
      //<button type="submit">Login</button>
    //</form>
  //);
//};

//export default Login;
