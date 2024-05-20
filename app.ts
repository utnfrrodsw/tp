import express from 'express';
//import { animal } from './animalK.js';

//animal--> /api/animal/
//const animales = [
  //new animal(
    //'juan',
    //12/3/20,
   // 12/3/20,
 // )
//];

const app = express();

app.use('./',(req,res )=>{
  res.send('hola');
})

 app.listen(3000, ()=>{
  console.log('server running on http://localhost:3000/');
 })
 