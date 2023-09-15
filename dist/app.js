import express from 'express';
import { modoEnvioRouter } from './modoEnvio/modoEnvio.routes.js';
import { Categoriarouter } from './categoria/categoria.routes.js';
import { Localidadrouter } from './localidad/localidad.routes.js';
const app = express();
app.use(express.json());
app.use('/api/modosEnvio', modoEnvioRouter);
app.use('/api/categoria', Categoriarouter);
app.use('/api/localidad', Localidadrouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log('Server runnning on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map