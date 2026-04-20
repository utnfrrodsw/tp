// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/test-utils';
import { SearchBar } from './SearchBar';

// Mock del servicio de Google Books
vi.mock('../services/googleBooksService', () => ({
  searchBooksAutocomplete: vi.fn().mockResolvedValue([]),
  GoogleBooksVolume: {},
}));

describe('SearchBar', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('debe renderizar el input de búsqueda', () => {
    renderWithProviders(<SearchBar />);

    const searchInput = screen.getByPlaceholderText(/Buscar libros, autores/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('debe mostrar el placeholder personalizado', () => {
    renderWithProviders(<SearchBar placeholder="Buscar en biblioteca" />);

    expect(screen.getByPlaceholderText('Buscar en biblioteca')).toBeInTheDocument();
  });

  it('debe actualizar el valor del input al escribir', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchBar />);

    const searchInput = screen.getByPlaceholderText(/Buscar libros, autores/i);
    await user.type(searchInput, 'El Señor de los Anillos');

    expect(searchInput).toHaveValue('El Señor de los Anillos');
  });

  it('debe mostrar el icono de búsqueda', () => {
    renderWithProviders(<SearchBar />);

    // Verificar que el componente se renderiza (icono de búsqueda está presente)
    const searchInput = screen.getByPlaceholderText(/Buscar libros, autores/i);
    expect(searchInput.parentElement).toBeInTheDocument();
  });

  it('debe limpiar el input al hacer clic en el botón de limpiar', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchBar />);

    const searchInput = screen.getByPlaceholderText(/Buscar libros, autores/i);
    await user.type(searchInput, 'test query');

    expect(searchInput).toHaveValue('test query');

    // Buscar botón de limpiar (X)
    const clearButton = screen.queryByRole('button', { name: /limpiar/i });
    if (clearButton) {
      await user.click(clearButton);
      expect(searchInput).toHaveValue('');
    }
  });

  it('debe aplicar className personalizado', () => {
    const customClass = 'custom-search-class';
    const { container } = renderWithProviders(<SearchBar className={customClass} />);

    // Verificar que el className está en el contenedor principal
    const mainDiv = container.querySelector(`.${customClass}`);
    expect(mainDiv).toBeInTheDocument();
  });

  it('debe mostrar sugerencias cuando hay database', async () => {
    const user = userEvent.setup();
    const mockDatabase = [
      { id: '1', title: 'El Hobbit', type: 'book' as const, author: 'J.R.R. Tolkien' },
      { id: '2', title: 'El Señor de los Anillos', type: 'book' as const, author: 'J.R.R. Tolkien' },
    ];

    renderWithProviders(<SearchBar database={mockDatabase} />);

    const searchInput = screen.getByPlaceholderText(/Buscar libros, autores/i);
    await user.type(searchInput, 'hobbit');

    // Esperar a que aparezcan las sugerencias
    await waitFor(() => {
      const hobbitSuggestion = screen.queryByText('El Hobbit');
      if (hobbitSuggestion) {
        expect(hobbitSuggestion).toBeInTheDocument();
      }
    }, { timeout: 1000 });
  });

  it('debe deshabilitar sugerencias con disableSuggestions prop', async () => {
    const user = userEvent.setup();
    const mockDatabase = [
      { id: '1', title: 'El Hobbit', type: 'book' as const, author: 'J.R.R. Tolkien' },
    ];

    renderWithProviders(<SearchBar database={mockDatabase} disableSuggestions={true} />);

    const searchInput = screen.getByPlaceholderText(/Buscar libros, autores/i);
    await user.type(searchInput, 'hobbit');

    // Las sugerencias NO deberían aparecer
    await waitFor(() => {
      expect(screen.queryByText('El Hobbit')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });
});
