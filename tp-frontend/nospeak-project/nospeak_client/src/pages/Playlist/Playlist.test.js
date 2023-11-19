import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Playlist from '../Playlist/Playlist'; // Asegúrate de proporcionar la ruta correcta
import { createMemoryHistory } from 'history';

const mockStore = configureStore();

// Mock de funciones asincrónicas para simular llamadas a la API
const mockGet = jest.fn();
const mockPatch = jest.fn();
const mockDelete = jest.fn();

const mockClient = {
  get: mockGet,
  patch: mockPatch,
  delete: mockDelete,
};

describe('Playlist Component', () => {
  it('Renderiza el componente Playlist', async () => {
    const store = mockStore({});
    const history = createMemoryHistory();
    history.push('/playlist/playlistId'); // Ajusta la ruta según tu enrutador

    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/playlist/playlistId']}>
            <Route path="/playlist/:playlistId">
              <Playlist client={mockClient} />
            </Route>
          </MemoryRouter>
        </Provider>
      );
    });

    // Agrega aserciones para verificar que los elementos esperados estén presentes
    const titleElement = screen.getByText('My Playlist');
    expect(titleElement).toBeInTheDocument();
  });

  it('Muestra la confirmación de eliminación de canción', () => {
    // Simula la llamada a la API mock
    mockGet.mockResolvedValue({ data: [] });

    const store = mockStore({});
    const history = createMemoryHistory();
    history.push('/playlist/playlistId'); // Ajusta la ruta según tu enrutador

    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/playlist/playlistId']}>
            <Route path="/playlist/:playlistId">
              <Playlist client={mockClient} />
            </Route>
          </MemoryRouter>
        </Provider>
      );
    });

    const deletePlaylistButton = screen.getByText('Delete Playlist');
    userEvent.click(deletePlaylistButton);

    // Agrega aserciones para verificar que la confirmación de eliminación esté visible
    const confirmationElement = screen.getByText('Are you sure you want to delete the playlist');
    expect(confirmationElement).toBeInTheDocument();
  });

  it('Añade canciones a la playlist', async () => {
    // Simula la llamada a la API mock y la selección de canciones
    mockGet.mockResolvedValue({ data: [] });
    mockPatch.mockResolvedValue({});
    mockDelete.mockResolvedValue({});

    const store = mockStore({});
    const history = createMemoryHistory();
    history.push('/playlist/playlistId'); // Ajusta la ruta según tu enrutador

    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/playlist/playlistId']}>
            <Route path="/playlist/:playlistId">
              <Playlist client={mockClient} />
            </Route>
          </MemoryRouter>
        </Provider>
      );
    });

    const addSongsButton = screen.getByText('Add Songs');
    userEvent.click(addSongsButton);

    // Simula la selección de canciones para agregar
    const songCheckbox = screen.getByTestId('song-checkbox'); // Ajusta el selector adecuado
    userEvent.click(songCheckbox);

    const saveButton = screen.getByText('Save');
    userEvent.click(saveButton);

    // Agrega aserciones para verificar que las canciones se hayan agregado
    await waitFor(() => {
      const playlistElement = screen.getByText('Song 1'); // Ajusta el texto adecuado
      expect(playlistElement).toBeInTheDocument();
    });
  });
});
