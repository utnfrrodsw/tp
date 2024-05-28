import express from 'express'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(express.json()) //convertir la req en formato JSON
app.use('/api',authRoutes)


export default app;
