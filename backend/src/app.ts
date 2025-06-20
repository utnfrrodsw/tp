import 'reflect-metadata'
import express from 'express'
import { usuarioRouter }  from './usuario/usuario.route.js';
import { tareaRouter } from './tarea/tarea.route.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { servicioRouter } from './servicio/servicio.route.js';
import { turnoRouter } from './turno/turno.route.js'

const app = express()
app.use(express.json())

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})
//antes de las rutas y middlewares de negocio

app.use('/api/usuario', usuarioRouter)
app.use('/api/tarea', tareaRouter)
app.use('/api/servicio', servicioRouter)
app.use('/api/turno',turnoRouter)

app.use((req, res, next) => {
  res.status(404).send({ message: 'Resource not found' });
});


await syncSchema() //never in production

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})
