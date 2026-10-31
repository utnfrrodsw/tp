import { describe, expect, it } from 'vitest';
import { convertirRolDeBackend } from './LoginForm';

describe('convertirRolDeBackend', () => {
  it('traduce el rol "empresa" de la base a "empresa"', () => {
    // ARRANGE
    const rolDeLaBase = 'empresa';

    // ACT
    const resultado = convertirRolDeBackend(rolDeLaBase);

    // ASSERT
    expect(resultado).toBe('empresa');
  });
});
