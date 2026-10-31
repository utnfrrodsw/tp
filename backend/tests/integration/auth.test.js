import { beforeAll, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const request = require('supertest');
const { app, ORIGIN, ADMIN, iniciarBase, loguear } = require('../helpers');

beforeAll(iniciarBase);

describe('POST /api/auth/login', () => {
  it('con credenciales correctas responde el usuario y setea la cookie httpOnly', async () => {
    const res = await request(app).post('/api/auth/login').set('Origin', ORIGIN).send(ADMIN);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ email: ADMIN.email, rol: 'admin' });
    expect(res.body.passwordHash).toBeUndefined();
    const cookie = res.headers['set-cookie'].join(';');
    expect(cookie).toMatch(/token=/);
    expect(cookie).toMatch(/HttpOnly/i);
  });

  it('da el mismo 401 si la contraseña es incorrecta o el email no existe', async () => {
    const mala = await request(app)
      .post('/api/auth/login')
      .set('Origin', ORIGIN)
      .send({ email: ADMIN.email, password: 'incorrecta-123' });
    const inexistente = await request(app)
      .post('/api/auth/login')
      .set('Origin', ORIGIN)
      .send({ email: 'nadie@test.com', password: 'incorrecta-123' });

    expect(mala.status).toBe(401);
    expect(inexistente.status).toBe(401);
    expect(mala.body.message).toBe(inexistente.body.message);
  });
});

describe('sesión y permisos', () => {
  it('GET /api/auth/me sin cookie da 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me con la sesión iniciada devuelve el usuario', async () => {
    const agente = await loguear(ADMIN.email, ADMIN.password);
    const res = await agente.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(ADMIN.email);
  });

  it('rechaza con 403 un POST que viene de un origen no permitido (CSRF)', async () => {
    const agente = await loguear(ADMIN.email, ADMIN.password);
    const res = await agente
      .post('/api/especialidades')
      .set('Origin', 'http://sitio-malicioso.com')
      .send({ nombre: 'Yoga' });
    expect(res.status).toBe(403);
  });

  it('logout borra la sesión', async () => {
    const agente = await loguear(ADMIN.email, ADMIN.password);
    await agente.post('/api/auth/logout').set('Origin', ORIGIN);
    const res = await agente.get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
