import express from 'express'
import { eventoRouter } from './src/evento/ruta'
import {userRouter } from './src/user/user.routes'

const app = express()
app.use(express.json())

app.use('/api/eventos', eventoRouter)
app.use('/api/users', userRouter)

app.use((req, res) => {
    return res.status(404).send({message:'Recurso no encontrado'})
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/')
})