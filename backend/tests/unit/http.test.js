import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { toPositiveInt, isValidEmail, esErrorDeReferencia } = require('../../src/utils/http');

describe('toPositiveInt', () => {
  it('acepta enteros positivos como número o texto', () => {
    expect(toPositiveInt(5)).toBe(5);
    expect(toPositiveInt(' 42 ')).toBe(42);
  });

  it.each([undefined, null, '', 'abc', '1.5', '-3', 0, '0', '12abc'])('rechaza %j', (valor) => {
    expect(toPositiveInt(valor)).toBeNull();
  });
});

describe('isValidEmail', () => {
  it('acepta emails con formato válido', () => {
    expect(isValidEmail('ana@correo.com')).toBe(true);
  });

  it.each(['', 'ana', 'ana@', '@correo.com', 'ana@correo', 'a b@correo.com', null, 42])(
    'rechaza %j',
    (valor) => {
      expect(isValidEmail(valor)).toBe(false);
    }
  );
});

describe('esErrorDeReferencia', () => {
  it('reconoce los errores de clave foránea de Postgres', () => {
    expect(esErrorDeReferencia({ parent: { code: '23503' } })).toBe(true);
    expect(esErrorDeReferencia({ parent: { code: '23001' } })).toBe(true);
    expect(esErrorDeReferencia({ name: 'SequelizeForeignKeyConstraintError' })).toBe(true);
  });

  it('ignora otros errores', () => {
    expect(esErrorDeReferencia(new Error('otro'))).toBe(false);
    expect(esErrorDeReferencia(undefined)).toBe(false);
  });
});
