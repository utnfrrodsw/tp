import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Login from '../Login/Login.jsx';
import { MemoryRouter } from 'react-router-dom';

const mockStore = configureStore();

test('Renderiza el componente Login', () => {
  const store = mockStore({});
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

  const usernameInput = screen.getByPlaceholderText('Username');
  const passwordInput = screen.getByPlaceholderText('Password');
  const loginButton = screen.getByText('Log in');

  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});

test('Muestra un mensaje de error cuando no se proporcionan credenciales', async () => {
    const store = mockStore({});
    render(
      <Provider store={store}>
        <MemoryRouter>
            <Login testing={true} />
        </MemoryRouter>
      </Provider>
    );
  
    const loginButton = screen.getByText('Log in');
    userEvent.click(loginButton);
  
    // Espera hasta que el mensaje de error aparezca en el DOM
    await waitFor(() => {
      const errorMessage = screen.queryByText('Please enter your username and password.');
      expect(errorMessage).toBeInTheDocument();
    });
  });
  
  

test('Realiza el inicio de sesión con credenciales válidas', async () => {
  const mockClient = {
    post: jest.fn().mockResolvedValue({ data: { token: 'mockToken', userId: 'mockUserId', nombre: 'mockUser' } }),
  };

  const store = mockStore({});
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login client={mockClient} />
      </MemoryRouter>
    </Provider>
  );

  const usernameInput = screen.getByPlaceholderText('Username');
  const passwordInput = screen.getByPlaceholderText('Password');
  const loginButton = screen.getByText('Log in');

  userEvent.type(usernameInput, 'testuser');
  userEvent.type(passwordInput, 'testpassword');
  userEvent.click(loginButton);

  await waitFor(() => {
    expect(mockClient.post).toHaveBeenCalledTimes(1);
  });

  const successMessage = await screen.findByText('Successful login. Redirecting...');
  expect(successMessage).toBeInTheDocument();
});
