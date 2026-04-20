import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from '../contexts/AuthContext'; // TODO: Agregar cuando exista

/**
 * Wrapper personalizado con providers comunes
 */
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <BrowserRouter>
      {/* <AuthProvider> TODO: Descomentar cuando exista */}
        {children}
      {/* </AuthProvider> */}
    </BrowserRouter>
  );
};

/**
 * Render personalizado que incluye providers
 * Uso: renderWithProviders(<MiComponente />)
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Re-exportar todo de testing-library
 */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
