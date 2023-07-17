const config = require('./configs/config')
const { connectDB } = require('./configs/db')
const express = require('express')
const cors = require('cors')

const app = express()

connectDB()

app.use(cors())

app.use(express.json({ extended: true }))

const PORT = config.app.port || 4000

// app.use('/api/tecnicos', require('./routes/tecnicos'))
// app.use('/api/tareas', require('./routes/tareas'))
// app.use('/api/tareas', require('./routes/tareas'))
// app.use('/api/grupos', require('./routes/grupos'))
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
