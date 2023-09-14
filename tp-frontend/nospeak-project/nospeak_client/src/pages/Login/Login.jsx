import React, { useState } from 'react';
import { FormLoginContainer, FormLogin, NavLogin, LoginButton, LoginInput, StyledH1, RegisterContainer } from './styles.js';
import { StyledLink, StyledSpan, ButtonContainer } from './styles.js';
import { Navigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/userSlice.js';
import { StyledButton } from '../../styled-components/styles.js';
import Alert from '../../styled-components/Alert/Alert.jsx';

export default function Login({ client }) {
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
        setError('Please enter your username and password.');
        setSuccessMessage('');
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
        setSuccessMessage(''); // Limpiar el mensaje de éxito
      } else if (error.request) {
        setError('Request error. Please try again later.');
        setSuccessMessage(''); // Limpiar el mensaje de éxito
      } else {
        setError('Unexpected error. Please try again later.');
        setSuccessMessage(''); // Limpiar el mensaje de éxito
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
          <img src="https://1000logos.net/wp-content/uploads/2017/08/Spotify-symbol.jpg" alt="Spotify logo" />
        </NavLogin>
        <FormLogin>
          <StyledH1>Log in to NoSpeak</StyledH1>
          <span>Username</span>
          <LoginInput value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Username" />
          <span>Password</span>
          <LoginInput value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <ButtonContainer>
            <StyledButton onClick={handleLogin}>
              Log in
            </StyledButton>
          </ButtonContainer>
          <br />
          <RegisterContainer>
            <StyledSpan>Don't have an account?</StyledSpan>
            <StyledLink to='/register'>Sign up for NoSpeak</StyledLink>
          </RegisterContainer>
        </FormLogin>
      </FormLoginContainer>
    </>
  );
}
