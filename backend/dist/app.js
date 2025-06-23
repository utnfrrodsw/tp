import express from 'express';
import { usuarioRouter } from './usuario/usuario.route.js';
import { tareaRouter } from './tarea/tarea.route.js';
import { servicioRouter } from './servicio/servicio.route.js';
import { turnoRouter } from './turno/turno.route.js';
import 'reflect-metadata';
import { orm, syncSchema } from './shared/db/orm.js';
<<<<<<< HEAD
import { zonaRouter } from './zona/zona.route.js';
import { RequestContext } from '@mikro-orm/core';
import { serviceTypeRouter } from './tipoServicio/tipoServ.route.js';
import { horarioRouter } from './horario/horario.routes.js';
=======
import { RequestContext } from '@mikro-orm/core';
import { serviceTypeRouter } from './tipoServicio/tipoServ.route.js';
>>>>>>> luis
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/api/serviceTypes', serviceTypeRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/tarea', tareaRouter);
app.use('/api/servicio', servicioRouter);
app.use('/api/turno', turnoRouter);
<<<<<<< HEAD
app.use('/api/horario', horarioRouter);
app.use('/api/zona', zonaRouter);
// app.use((req, res) => {
//   console.log(req)
//   return res.status(404).send({ message: 'Resource not found' });
// }); comente esto pq me tiraba error
await syncSchema(); //nunca en producción
=======
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
await syncSchema(); //nunca en producción
/* app.listen(3006, () => {
  console.log('Server runnning on http://localhost:3006/');
}); */
>>>>>>> luis
app.listen(3000, () => {
    console.log('Server runnning on http://localhost:3000/');
});
/* app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000');
}); */
//# sourceMappingURL=app.js.map