import express from 'express';
import { animal } from './animal.js';

//animal--> /api/animal/
const animales = [
  new animal(
    'juan',
    12/3/20,
    12/3/20,
  )
];

const app = express();

app.get('/api/animal',(req,res )=>{
  res.json(animales);
})

 app.listen(3000, ()=>{
  console.log('server running on http://localhost:3000/');
 })
