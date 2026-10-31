const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const { Usuario } = require('../src/models/associations');
const { hashPassword } = require('../src/utils/password');

const ORIGIN = 'http://localhost:5173';
const ADMIN = { email: 'admin@test.com', password: 'clave-de-admin-1' };

// Base SQLite en memoria vacía, con las tablas de los modelos y un admin
const iniciarBase = async () => {
  await sequelize.sync({ force: true });
  await Usuario.create({
    email: ADMIN.email,
    passwordHash: await hashPassword(ADMIN.password),
    rol: 'admin'
  });
};

// Devuelve un agente (guarda la cookie de sesión) ya logueado
const loguear = async (email, password) => {
  const agente = request.agent(app);
  const res = await agente.post('/api/auth/login').set('Origin', ORIGIN).send({ email, password });
  if (res.status !== 200) throw new Error(`No se pudo loguear ${email}: ${res.status}`);
  return agente;
};

// Las requests que modifican datos llevan el Origin del frontend (lo exige la protección CSRF)
const conOrigen = (req) => req.set('Origin', ORIGIN);

module.exports = { app, ORIGIN, ADMIN, iniciarBase, loguear, conOrigen };
