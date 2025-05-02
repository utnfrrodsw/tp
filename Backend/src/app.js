import express from 'express';
import { usuarioRoutes } from './routes/usuario.routes'; // Asegúrate de que las rutas estén importadas correctamente
const app = express();
app.use(express.json()); // Para procesar cuerpos JSON en las peticiones
// Registra las rutas en el servidor
app.use('/api', usuarioRoutes); // Las rutas de usuario estarán disponibles bajo '/api'
// Inicia el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});
