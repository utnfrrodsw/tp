import { beforeAll, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ADMIN, iniciarBase, loguear, conOrigen } = require('../helpers');
const { hoy } = require('../../src/utils/membresia');

// Fecha de hoy +/- días, en AAAA-MM-DD
const enDias = (dias) =>
  new Date(Date.parse(`${hoy()}T00:00:00Z`) + dias * 86400000).toISOString().slice(0, 10);

let admin;
let cliente;
let profesor;

const nuevoCliente = (dni, extra = {}) =>
  conOrigen(admin.post('/api/clientes')).send({
    dni,
    nombre: 'Ana',
    apellido: 'Gomez',
    email: `cliente${dni}@test.com`,
    ...extra
  });

const nuevaMembresia = (datos) =>
  conOrigen(admin.post('/api/membresias')).send({
    dniCliente: 100,
    fechaPago: enDias(-5),
    fechaInicio: enDias(-5),
    fechaVencimiento: enDias(25),
    valor: 15000,
    ...datos
  });

beforeAll(async () => {
  await iniciarBase();
  admin = await loguear(ADMIN.email, ADMIN.password);

  // Cada alta crea también la cuenta, con el DNI como contraseña inicial
  expect((await nuevoCliente(100)).status).toBe(201);
  const alta = await conOrigen(admin.post('/api/profesores')).send({
    dni: 500,
    nombre: 'Pablo',
    apellido: 'Ruiz',
    telefono: '1111',
    email: 'profe500@test.com'
  });
  expect(alta.status).toBe(201);

  cliente = await loguear('cliente100@test.com', '100');
  profesor = await loguear('profe500@test.com', '500');
});

describe('alta de clientes', () => {
  it('crea la cuenta con la contraseña inicial = DNI y pide cambiarla', async () => {
    const res = await cliente.get('/api/auth/me');
    expect(res.body).toMatchObject({ rol: 'cliente', debeCambiarPassword: true });
  });

  it('rechaza un DNI repetido con 409', async () => {
    const res = await nuevoCliente(100, { email: 'otro@test.com' });
    expect(res.status).toBe(409);
  });

  it('rechaza un email inválido con 400', async () => {
    const res = await nuevoCliente(101, { email: 'no-es-un-email' });
    expect(res.status).toBe(400);
  });

  it('el cliente no puede crear otros clientes', async () => {
    const res = await conOrigen(cliente.post('/api/clientes')).send({ dni: 102 });
    expect(res.status).toBe(403);
  });
});

describe('membresías', () => {
  it('calcula el estado a partir de las fechas', async () => {
    const activa = await nuevaMembresia({});
    expect(activa.status).toBe(201);
    expect(activa.body.estado).toBe('Activa');

    const porVencer = await nuevaMembresia({ fechaVencimiento: enDias(3) });
    expect(porVencer.body.estado).toBe('Por vencer');

    const vencida = await nuevaMembresia({
      fechaInicio: enDias(-40),
      fechaVencimiento: enDias(-10)
    });
    expect(vencida.body.estado).toBe('Vencida');
  });

  it('rechaza fechas inexistentes y valores negativos con 400', async () => {
    expect((await nuevaMembresia({ fechaVencimiento: '2026-02-30' })).status).toBe(400);
    expect((await nuevaMembresia({ valor: -5 })).status).toBe(400);
  });

  it('el profesor no puede ver las membresías (403)', async () => {
    expect((await profesor.get('/api/membresias')).status).toBe(403);
  });

  it('el cliente ve solo las suyas', async () => {
    await nuevoCliente(200);
    await nuevaMembresia({ dniCliente: 200 });

    const propias = await cliente.get('/api/membresias');
    expect(propias.status).toBe(200);
    expect(propias.body.length).toBeGreaterThan(0);
    expect(propias.body.every((m) => m.dniCliente === 100)).toBe(true);
  });
});

describe('listado de clientes', () => {
  it('el admin ve la membresía en curso de cada cliente', async () => {
    const res = await admin.get('/api/clientes');
    const ana = res.body.find((c) => c.dni === 100);
    expect(['Activa', 'Por vencer']).toContain(ana.membresia.estado);
  });

  it('un cliente sin membresías tiene membresia null', async () => {
    await nuevoCliente(300);
    const res = await admin.get('/api/clientes/300');
    expect(res.body.membresia).toBeNull();
  });

  it('el profesor ve los clientes pero sin el campo membresia', async () => {
    const res = await profesor.get('/api/clientes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((c) => !('membresia' in c))).toBe(true);
  });
});

describe('baja de clientes', () => {
  it('borra también sus membresías y su cuenta', async () => {
    await nuevoCliente(400);
    await nuevaMembresia({ dniCliente: 400 });

    const baja = await conOrigen(admin.delete('/api/clientes/400'));
    expect([200, 204]).toContain(baja.status);

    const membresias = await admin.get('/api/membresias');
    expect(membresias.body.some((m) => m.dniCliente === 400)).toBe(false);
    const usuarios = await admin.get('/api/usuarios');
    expect(usuarios.body.some((u) => u.email === 'cliente400@test.com')).toBe(false);
  });
});
