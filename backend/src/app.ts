import express from 'express'
import { tipo_participanteRouter } from './tipo_participante/tipo_participante.routes.js'
import { formatoRouter } from './formatos_torneo/formatos_torneo.routes.js'
import {estado_torneoRouter} from './estado_torneo/estado_torneo.routes.js'
import { localidadesRouter } from './localidades/localidades.routes.js'
import cors  from 'cors'



const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/estado_torneo', estado_torneoRouter)
app.use('/api/formatos_torneo',formatoRouter)
app.use('/api/tipo_participantes', tipo_participanteRouter)
app.use('/api/localidades', localidadesRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})

