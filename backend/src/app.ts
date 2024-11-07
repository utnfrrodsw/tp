import 'reflect-metadata'
import express from 'express'
import { tipo_participanteRouter } from './tipo_participante/tipo_participante.routes.js'
import { formatoRouter } from './formatos_torneo/formatos_torneo.routes.js'
import { estado_torneoRouter } from './estado_torneo/estado_torneo.routes.js'
import { localidadesRouter } from './localidades/localidades.routes.js'
import { sucursalesRouter } from './sucursal/sucursal.routes.js'
import { torneosRouter } from './torneo/torneo.routes.js'
import { adminsRouter } from './admin/admin.routes.js'
import { participantesRouter } from './participante/participante.routes.js'
import { equiposRouter } from './equipo/equipo.routes.js'
import { partidosRouter } from './partido/partido.routes.js'
import cors  from 'cors'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'

const app = express()
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/estado_torneo', estado_torneoRouter)
app.use('/api/formatos_torneo',formatoRouter)
app.use('/api/tipo_participantes', tipo_participanteRouter)
app.use('/api/localidades', localidadesRouter)
app.use('/api/sucursales', sucursalesRouter)
app.use('/api/torneos', torneosRouter)
app.use('/api/admins', adminsRouter)
app.use('/api/participantes', participantesRouter)
app.use('/api/equipos', equiposRouter)
app.use('/api/partidos', partidosRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema() //nunca en produccion 

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})