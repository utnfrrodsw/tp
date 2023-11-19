import React, { useState } from 'react';
import { FormLoginContainer, FormLogin, NavLogin, LoginInput, StyledH1, RegisterContainer } from './styles.js';
import { StyledLink, StyledSpan, ButtonContainer, LoginButton } from './styles.js';
import { Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice.js';
import { StyledButton } from '../../styled-components/styles.js';
import Alert from '../../styled-components/Alert/Alert.jsx';

export default function Login({ client, testing }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [goToHome, setGoToHome] = useState(false);

  if (goToHome && !testing) {
    return <Navigate to="/home" />;
  }

  const handleLogin = async () => {
    try {
      if (!name || !password) {
        setError('Please enter your username and password.');
        setSuccessMessage('');
        return;
      }

      const response = await client.post('/api/usuarios-login/', {
        nombre: name,
        password,
      });
      
      const { token, userId, nombre, isAdmin } = response.data;
      localStorage.setItem('token', token);
      
      dispatch(loginSuccess({ 
        isAuthenticated: true,
        user: { id: userId, nombre, isAdmin: isAdmin},
      }));

      setSuccessMessage('Successful login. Redirecting...');
      setError('');
      setTimeout(() => {
        setGoToHome(true);
      }, 5000);
    } catch (error) {
      setIsLoading(false);

      if (error.response) {
        if (error.response.status === 400) {
          setError('Incorrect credentials. Please verify your username and password.');
        } else {
          setError('Request error. Please try again later.');
        }
        setSuccessMessage(''); 
      } else if (error.request) {
        setError('Request error. Please try again later.');
        setSuccessMessage(''); 
      } else {
        setError('Unexpected error. Please try again later.');
        setSuccessMessage(''); 
      }
    }
  };

  const closeErrorAlert = () => {
    setError(null);
  };

  const closeSuccessAlert = () => {
    setSuccessMessage(null);
  };

  return (
    <>
      {error && !isLoading && (
        <Alert message={error} type="error" onClose={closeErrorAlert} />
      )}
      {successMessage && !isLoading && (
        <Alert message={successMessage} type="success" onClose={closeSuccessAlert} />
      )}
      <FormLoginContainer>
        <NavLogin>
          <img src={process.env.PUBLIC_URL + '/logo_nospeak.png'} alt="logo" style={{ width: '130px', height: '60%' }}/>
        </NavLogin>
        <FormLogin>
          <StyledH1>Log in to NoSpeak</StyledH1>
          <span>Username</span>
          <LoginInput value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Username" />
          <span>Password</span>
          <LoginInput value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <LoginButton onClick={handleLogin}>
            Log in
          </LoginButton>
          <RegisterContainer>
            <StyledSpan>Don't have an account?</StyledSpan>
            <StyledLink to='/register'>Sign up for NoSpeak</StyledLink>
          </RegisterContainer>
        </FormLogin>
      </FormLoginContainer>
    </>
  );
}
