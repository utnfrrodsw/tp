import { describe, it, expect } from 'vitest';
import { esEmailValido } from './validators';

describe('esEmailValido', () => {
  it('devuelve true para un email bien formado', () => {
    // ARRANGE
    const email = 'usuario@planit.com';

    // ACT
    const resultado = esEmailValido(email);

    // ASSERT
    expect(resultado).toBe(true);
  });

  it('devuelve false si el email no tiene arroba o dominio', () => {
    expect(esEmailValido('usuario.com')).toBe(false);
    expect(esEmailValido('usuario@')).toBe(false);
    expect(esEmailValido('')).toBe(false);
  });
});
