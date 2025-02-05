const request = require('supertest');
const express = require('express');
const { getTechnicians, getTechnician, updateTechnician, createTechnician, deleteTechnician } = require('../controllers/technicians');
const { sequelize, Technician, Group, Task } = require('../sequelize'); // Cambia la ruta a la correcta
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.get('/technicians', getTechnicians);
app.get('/technicians/:id', getTechnician);
app.put('/technicians/:id', updateTechnician);
app.post('/technicians', createTechnician);
app.delete('/technicians/:id', deleteTechnician);

jest.mock('../sequelize'); // Cambia la ruta a la correcta

require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SIGNATURE, { expiresIn: '1h' });
};

describe('Technician Controller with JWT', () => {
  let token;

  beforeAll(async () => {
    token = generateToken(1); // Assuming user ID 1 for testing
    sequelize.options.logging = false; // Desactiva el logging de Sequelize durante las pruebas
    await sequelize.sync(); // Asegúrate de que la sincronización de Sequelize se complete antes de las pruebas
  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // Espera un poco antes de cerrar la conexión
    await sequelize.close(); // Cierra la conexión a la base de datos después de todas las pruebas
  });

  describe('getTechnicians', () => {
    it('should return a list of technicians', async () => {
      const technicians = [{ id: 1, name: 'John Doe' }];
      Technician.findAndCountAll.mockResolvedValue({ rows: technicians, count: 1 });

      const res = await request(app).get('/technicians').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalItems', 1);
      expect(res.body).toHaveProperty('items', technicians);
    });

    it('should handle errors', async () => {
      Technician.findAndCountAll.mockRejectedValue(new Error('Some error'));

      const res = await request(app).get('/technicians').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message', 'Some error occurred while retrieving technicians.');
    });
  });

  describe('getTechnician', () => {
    it('should return a technician by id', async () => {
      const technician = { id: 1, name: 'John Doe' };
      Technician.findByPk.mockResolvedValue(technician);

      const res = await request(app).get('/technicians/1').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(technician);
    });

    it('should handle errors', async () => {
      Technician.findByPk.mockRejectedValue(new Error('Some error'));

      const res = await request(app).get('/technicians/1').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual('Ups! Error');
    });
  });

  describe('updateTechnician', () => {
    it('should update a technician', async () => {
      const technician = { id: 1, name: 'John Doe', date_born: '1990-01-01' };
      Technician.update.mockResolvedValue([1]);

      const res = await request(app).put('/technicians/1').send(technician).set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([1]);
    });

    it('should handle errors', async () => {
      Technician.update.mockRejectedValue(new Error('Some error'));

      const res = await request(app).put('/technicians/1').send({ name: 'John Doe', dateBorn: '1990-01-01' }).set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual('Ups! Error');
    });
  });

  describe('createTechnician', () => {
    it('should create a new technician', async () => {
      const technician = { id: 1, name: 'John Doe', date_born: '1990-01-01' };
      Technician.create.mockResolvedValue(technician);

      const res = await request(app).post('/technicians').send(technician).set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(technician);
    });

    it('should handle errors', async () => {
      Technician.create.mockRejectedValue(new Error('Some error'));

      const res = await request(app).post('/technicians').send({ name: 'John Doe', date_born: '1990-01-01' }).set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual('Ups! Error');
    });
  });

  describe('deleteTechnician', () => {
    it('should delete a technician', async () => {
      const technician = { id: 1, name: 'John Doe', groups: [] };
      Technician.findByPk.mockResolvedValue(technician);
      Technician.destroy.mockResolvedValue(1);

      const res = await request(app).delete('/technicians/1').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(technician);
    });

    it('should handle errors', async () => {
      Technician.findByPk.mockRejectedValue(new Error('Some error'));

      const res = await request(app).delete('/technicians/1').set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual('Ups! Error');
    });
  });
});