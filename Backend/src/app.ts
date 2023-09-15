import express from 'express'
import { employeeRouter } from './employee/employee.routes.js'
import { clientRouter } from './client/client.routes.js'

const app = express()
app.use(express.json())

app.use('/api/employees', employeeRouter)
app.use('/api/clients', clientRouter)


app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})