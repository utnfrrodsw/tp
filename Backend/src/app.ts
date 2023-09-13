import express from 'express'

const app = express()

app.use('/', (req, res) => {
  res.json({message: 'test'})
})

app.listen(3000, () => {
  console.log('servidor en 3000');
})