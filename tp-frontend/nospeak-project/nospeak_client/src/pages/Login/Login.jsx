import React, { useState } from 'react';
import {FormLoginContainer, FormLogin, NavLogin, LoginButton, LoginInput, StyledH1,
RegisterContainer} from './styles.js';
import {StyledLink, StyledSpan, ButtonContainer} from './styles.js';
import {Navigate} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice.js';
import { StyledButton } from '../../styled-components/styles.js';
import Alert from '../../styled-components/Alert/Alert.jsx';


export default function Login({client}) {

  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [goToHome, setGoToHome] = useState(false);

  if (goToHome) {
    return <Navigate to="/home" />;
  }

  const handleLogin = async () => {
    try {

      if (!name || !password) {
        setError('Por favor, ingrese su usuario y contraseña.');
        return;
      }

         
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

      setSuccessMessage('Inicio de sesión exitoso. Redireccionando...');
      setTimeout(() => {
        setGoToHome(true);
      }, 5000);
      
    } catch (error) {
        setIsLoading(false);
        
        if (error.response) {
          if (error.response.status === 400 ) { // Bad Request pero deberia ser 401
            setError('Credenciales incorrectas. Por favor, verifique su usuario y contraseña.');
          } else {
            setError('Error en la solicitud. Por favor, inténtelo nuevamente más tarde.');
          }
        } else if (error.request) {
          setError('Error en la solicitud. Por favor, inténtelo nuevamente más tarde.');
        } else {
          setError('Error inesperado. Por favor, inténtelo nuevamente más tarde.');
        }
    }
  };

  const closeAlert = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <>
      {error && !isLoading && (
        <Alert message={error} type="error" onClose={closeAlert} />
      )}
      {successMessage && !isLoading && (
        <Alert message={successMessage} type="success" onClose={closeAlert} />
      )}
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
          <ButtonContainer>
            <StyledButton onClick={handleLogin}>
              Log in
            </StyledButton>
          </ButtonContainer>
          <br/>
          <RegisterContainer>
            <StyledSpan>Don't have an account?</StyledSpan>
            <StyledLink to='/register'>Sign up for NoSpeak</StyledLink>
          </RegisterContainer>
        </FormLogin>
      </FormLoginContainer>
    </>
  );
}