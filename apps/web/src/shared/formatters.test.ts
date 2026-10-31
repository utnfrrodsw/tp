import { describe, it, expect } from 'vitest';
import { formatearTitulo } from './formatters';

describe('formatearTitulo', () => {
  it('convierte "  fiesta de 15  " a "Fiesta De 15"', () => {
    // ARRANGE
    const entrada = '  fiesta de 15  ';

    // ACT
    const resultado = formatearTitulo(entrada);

    // ASSERT
    expect(resultado).toBe('Fiesta De 15');
  });
});
