import React, { useState } from 'react';
import {FormLoginContainer, FormLogin, NavLogin, LoginButton, LoginInput, StyledH1,
RegisterContainer} from './styles.js';
import {StyledLink, StyledSpan} from './styles.js';
import {Navigate} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice.js';


export default function Login({client}) {

  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [goToHome, setGoToHome] = useState(false);

  if (goToHome) {
    return <Navigate to="/home" />;
  }

  const handleLogin = async () => {
    try {
      const response = await client.post('/nospeak-app/api/login/', {
        username: name,
        password,
      });
      
      const { token, user_id, username } = response.data;
      localStorage.setItem('token', token);
      
      dispatch(loginSuccess({ 
        isAuthenticated: true,
        user: { id: user_id, username },
      }));
      
      setGoToHome(true);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <FormLoginContainer>
      <NavLogin>
        <img src="https://1000logos.net/wp-content/uploads/2017/08/Spotify-symbol.jpg" alt="Logo de spotify" />
      </NavLogin>
      <FormLogin>
        <StyledH1>Log in to NoSpeak</StyledH1>
        <span>Username</span>
        <LoginInput value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Username"/>
        <span>Password</span>
        <LoginInput value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"  />
        <LoginButton onClick={handleLogin}>
          Log in
        </LoginButton>
        <br/>
        <RegisterContainer>
          <StyledSpan>Don't have an account?</StyledSpan>
          <StyledLink to='/register'>Sign up for NoSpeak</StyledLink>
        </RegisterContainer>
      </FormLogin>
    </FormLoginContainer>
  );
}