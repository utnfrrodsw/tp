const config = require('./configs/config')
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')


app.use(cors())
app.use(express.json({ extended: true }))
app.use(cookieParser())

const PORT = config.app.port || 4000

app.use('/api/tasks', require('./routes/tasks'))
app.use('/api/groups', require('./routes/groups'))
app.use('/api/technicians', require('./routes/technicians'))
app.use('/api/group_technicians', require('./routes/group_technicians'))
app.use('/api/group_tasks', require('./routes/group_tasks'))
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
