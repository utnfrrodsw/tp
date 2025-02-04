const jwt = require('jsonwebtoken');
const request = require('supertest');
const express = require('express');
const techniciansController = require('../routes/technicians'); // Ajusta la ruta según tu estructura
const { sequelize } = require('../sequelize'); // Ajusta la ruta según tu configuración

const app = express();
app.use(express.json());

// Verificar que techniciansController es un Router antes de usarlo

let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNzM4MTY1MjY3LCJleHAiOjE3Mzg3NzAwNjd9.yH0oOLx_8cdNkX9yWcqVekxsRB86J7EsSPhodH1eNGE"
if (techniciansController && techniciansController.use) {
    app.use('/api/technicians', techniciansController);
} else {
    throw new Error("❌ techniciansController no es un Router válido");
}

describe('Technicians Controller', () => {
    let token; // Variable para almacenar el token JWT

    beforeAll(async () => {
        try {
            // Conectar a la base de datos
            await sequelize.authenticate();
            console.log('✅ Database connected successfully');

            // Sincronizar modelos (si es necesario)
            await sequelize.sync(); // Asegúrate de que esto se ejecute antes de cerrar la conexión

            // Generar el token manualmente
            const user = { id: 1, name: 'Test User' }; // Usuario de prueba
            token = jwt.sign(user, 'your-secret-key', { expiresIn: '1h' }); // Generación del token
        } catch (error) {
            console.error('❌ Failed to connect to database:', error);
        }
    });

    afterAll(async () => {
        await sequelize.close(); // Cerrar la conexión después de completar todas las operaciones
    });

    it('should get all technicians', async () => {
        const res = await request(app)
            .get('/api/technicians')
            .set('Authorization', `Bearer ${token}`); // Pasar el token en el encabezado

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('items');
        expect(Array.isArray(res.body.items)).toBe(true);
    });

    it('should create a new technician', async () => {
        const newTechnician = { name: 'John Doe' };

        const res = await request(app)
            .post('/api/technicians')
            .set('Authorization', `Bearer ${token}`) // Pasar el token en el encabezado
            .send(newTechnician); // Enviar los datos del nuevo técnico

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('technician');
        expect(res.body.technician).toHaveProperty('id');
    });
});
