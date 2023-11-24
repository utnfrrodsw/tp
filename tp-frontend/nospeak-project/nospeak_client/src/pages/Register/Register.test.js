import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Register from '../Register/Register.jsx';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore();

test('Renderiza el componente Register', () => {
  const store = mockStore({});
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    </Provider>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const usernameInput = screen.getByPlaceholderText('Username');
  const passwordInputs = screen.getAllByPlaceholderText(/Password/i); 
  const signUpButton = screen.getByText('Sign up');

  expect(emailInput).toBeInTheDocument();
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInputs[0]).toBeInTheDocument();
  expect(passwordInputs[1]).toBeInTheDocument();
  expect(signUpButton).toBeInTheDocument();
});

test('Muestra mensajes de error cuando no se proporcionan credenciales en el registro', async () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
            <Register testing={true} />
        </MemoryRouter>
      </Provider>
    );
  
    const signUpButton = screen.getByText('Sign up');
    userEvent.click(signUpButton);
  
    await waitFor(async () => {
      const emailErrorMessage = screen.queryByText('Please enter an email');
      const usernameErrorMessage = screen.queryByText('Please enter a username');
      const passwordErrorMessage = screen.queryByText('Please enter a password');
      const repeatPasswordErrorMessage = screen.queryByText('Please repeat the password');
      
      expect(emailErrorMessage).toBeInTheDocument();
      expect(usernameErrorMessage).toBeInTheDocument();
      expect(passwordErrorMessage).toBeInTheDocument();
      expect(repeatPasswordErrorMessage).toBeInTheDocument();
    });
});

test('Muestra mensaje de error al registrar con contraseñas que no coinciden', async () => {
  const store = mockStore({});
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Register testing={true} />
      </MemoryRouter>
    </Provider>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const usernameInput = screen.getByPlaceholderText('Username');
  const passwordInputs = screen.getAllByPlaceholderText(/Password/i); 
  const signUpButton = screen.getByText('Sign up');

  userEvent.type(emailInput, 'test@example.com');
  userEvent.type(usernameInput, 'testuser');
  userEvent.type(passwordInputs[0], 'testpassword'); 
  userEvent.type(passwordInputs[1], 'differentpassword'); 
  userEvent.click(signUpButton);

  await waitFor(async () => {
    const passwordErrorMessages = screen.getAllByText('Passwords do not match');
    expect(passwordErrorMessages.length).toBe(2);
    const passwordErrorMessage = passwordErrorMessages[0];
    const repeatPasswordErrorMessage = passwordErrorMessages[1];
    expect(passwordErrorMessage).toBeInTheDocument();
    expect(repeatPasswordErrorMessage).toBeInTheDocument();
  });
});


