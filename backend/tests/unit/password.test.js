import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { validatePassword, hashPassword, verifyPassword } = require('../../src/utils/password');

describe('validatePassword', () => {
  it('acepta una contraseña de 8 a 72 bytes', () => {
    expect(validatePassword('12345678')).toBeNull();
    expect(validatePassword('a'.repeat(72))).toBeNull();
  });

  it('rechaza las muy cortas, las muy largas y las que no son texto', () => {
    expect(validatePassword('corta')).toMatch(/al menos 8/);
    expect(validatePassword('a'.repeat(73))).toMatch(/demasiado larga/);
    expect(validatePassword(undefined)).toMatch(/obligatoria/);
  });
});

describe('hashPassword / verifyPassword', () => {
  it('verifica la contraseña correcta y rechaza la incorrecta', async () => {
    const hash = await hashPassword('mi-clave-segura');
    expect(hash).not.toBe('mi-clave-segura');
    expect(await verifyPassword('mi-clave-segura', hash)).toBe(true);
    expect(await verifyPassword('otra-clave', hash)).toBe(false);
  });

  it('rechaza cuando no hay hash (usuario inexistente)', async () => {
    expect(await verifyPassword('lo-que-sea', undefined)).toBe(false);
  });
});
