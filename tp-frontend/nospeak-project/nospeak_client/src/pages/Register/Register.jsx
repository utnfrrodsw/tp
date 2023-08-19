import React, { useState } from 'react';
import {FormLogin, FormLoginContainer, NavLogin, LoginButton, LoginInput, StyledH1} from '../Login/styles';
import { Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice.js';



export default function Register({client}) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [goToHome, setGoToHome] = useState(false);
  if (goToHome) {
    return <Navigate to="/home" />;
  }

  const handleRegister = async () => {
    try {
      const response_register = await client.post('/nospeak-app/api/register/', {
        username: name,
        password,
      });
    }
    catch (error) {
      console.error('Error al registrarse:', error);
    }
    try{
      const response_login = await client.post('/nospeak-app/api/login/', {
        username: name,
        password,
      });
      
      const { token, user_id, username } = response_login.data;
      localStorage.setItem('token', token);
      
      dispatch(loginSuccess({ 
        isAuthenticated: true,
        user: { id: user_id, username },
      }));
      
      setGoToHome(true);
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <FormLoginContainer>
      <NavLogin>
        <img src="https://1000logos.net/wp-content/uploads/2017/08/Spotify-symbol.jpg" alt="Logo de spotify" />
      </NavLogin>
      <FormLogin>
        <StyledH1>Sign up for NoSpeak</StyledH1>
        <span>What’s your email address?</span>
        <LoginInput value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email"/>
        <span>What should we call you?</span>
        <LoginInput value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Username"/>
        <span>Create a password</span>
        <LoginInput value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password"  />
        <span>Repeat password</span>
        <LoginInput value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password"  />
        <LoginButton onClick={(e) => {handleRegister(e);}}>
          Sign up
        </LoginButton>
      </FormLogin>
    </FormLoginContainer>
    
  );
}