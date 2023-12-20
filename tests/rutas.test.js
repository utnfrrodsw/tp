import supertest from 'supertest';
import app from '../src/index.mjs'; // Archivo principal de la aplicación Express

const request = supertest(app);


test('Iniciar sesión', async () => {
  const response = await request.post('/api/login').send({"email":"userprueba@gmail.com",
    "password":"123456" });
  expect(response.status).toBe(200);
});