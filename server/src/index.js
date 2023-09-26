 //ESTE ES EL ARCHIVO QUE ARRANCA TODO, HACE ESCUCHAR AL SERVIDOR EN EL PUERTO PORT

import app from './app.js';
import { PORT } from './config.js';

app.listen(PORT)
console.log('Server corriendo en el puerto',PORT)