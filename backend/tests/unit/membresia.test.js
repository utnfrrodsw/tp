import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { fechaValida, valorValido, calcularEstado } = require('../../src/utils/membresia');

describe('fechaValida', () => {
  it('acepta fechas reales con formato AAAA-MM-DD', () => {
    expect(fechaValida('2026-10-16')).toBe('2026-10-16');
    expect(fechaValida('2028-02-29')).toBe('2028-02-29');
  });

  it.each(['2026-02-30', '2027-02-29', '2026-13-01', '16/10/2026', '2026-1-1', '', null, 20261016])(
    'rechaza %j',
    (valor) => {
      expect(fechaValida(valor)).toBeNull();
    }
  );
});

describe('valorValido', () => {
  it('acepta números y textos numéricos, redondeando a 2 decimales', () => {
    expect(valorValido(1500)).toBe(1500);
    expect(valorValido('1500.5')).toBe(1500.5);
    expect(valorValido(10.126)).toBe(10.13);
    expect(valorValido(0)).toBe(0);
  });

  it.each([-1, 100000000, NaN, Infinity, '', 'abc', null, undefined, true])(
    'rechaza %j',
    (valor) => {
      expect(valorValido(valor)).toBeNull();
    }
  );
});

describe('calcularEstado', () => {
  const hoy = '2026-10-16';

  it('está Pendiente si todavía no empezó', () => {
    expect(calcularEstado({ fechaInicio: '2026-10-20', fechaVencimiento: '2026-11-20' }, hoy)).toBe(
      'Pendiente'
    );
  });

  it('está Activa si vence en más de 7 días', () => {
    expect(calcularEstado({ fechaInicio: '2026-10-01', fechaVencimiento: '2026-11-01' }, hoy)).toBe(
      'Activa'
    );
  });

  it('está Por vencer si vence dentro de los próximos 7 días (incluido hoy)', () => {
    expect(calcularEstado({ fechaInicio: '2026-10-01', fechaVencimiento: '2026-10-23' }, hoy)).toBe(
      'Por vencer'
    );
    expect(calcularEstado({ fechaInicio: '2026-10-01', fechaVencimiento: hoy }, hoy)).toBe(
      'Por vencer'
    );
  });

  it('está Vencida si la fecha de vencimiento ya pasó', () => {
    expect(calcularEstado({ fechaInicio: '2026-09-01', fechaVencimiento: '2026-10-15' }, hoy)).toBe(
      'Vencida'
    );
  });
});
