import express from 'express';
import cors from 'cors';
import routes from './api/endPoints.js';
import dotenv from 'dotenv';
import userRoutes from './api/routes/user.routes.js'; 
import authRoutes from './api/routes/auth.routes.js';
import failRoutes from './api/routes/fail.routes.js'
import paymentsRoutes from './api/routes/payment.routes.js';
import clientRoutes from './api/routes/client.routes.js';
dotenv.config();

const app = express();
const port = 3000;

app.use(cors(
    {
        origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
    }
));        // ← sin {} adentro si no pasás opciones
app.use(express.json()); // ← necesario para leer el body en POST
app.use(express.urlencoded({ extended: true })); // ← necesario para leer el body en POST con form-data 
app.use('/', routes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes); 
app.use('/failures', failRoutes)
app.use('/clients', clientRoutes);
app.use('/payments', paymentsRoutes); 


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});