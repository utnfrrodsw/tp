 //ARCHIVO PRINCIPAL QUE INICIA EL SERVIDOR EXPRESS en un determinado PORT

import app from './app.js';
import { PORT } from './config.js';

app.listen(PORT)
console.log('Server corriendo en el puerto',PORT)