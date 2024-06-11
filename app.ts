import express, { NextFunction, Request, Response } from 'express';
import { animal } from './animal.js';


const app = express();
app.use(express.json());

//midleware--> pequeños fragmentos de codigo en express que podemos incluir en 
//nuestra cadena de codigo para la resolucion de una request 
//estos van de a parte agregando, quitando y modificando la info de acuerdo a lo que sea necessario


//animal--> /api/animal/
const animales = [
  new animal(
    'juan',
    '2020-12-03',
    '2020-12-03',
    '1'
  ),
];

function sanitizeAnimalInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedAnimal = {
    nombre: req.body.nombre,
    fechaRescate: req.body.fechaRescate,
    fechaNacimientoEStimativa: req.body.fechaNacimientoEStimativa
  }

  Object.keys(req.body.sanitizedAnimal).forEach((key) => {
    if (req.body.sanitizedAnimal[key] === undefined) {
      delete req.body.sanitizedAnimal[key]
    }
  })

  next()
}

app.get('/api/animal',(req,res )=>{
  res.json(animales);
})


app.get('/api/animal/:id',(req,res )=>{
  const animal = animales.find((animal) => animal.id === req.params.id);
  if(!animal){
    return res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }
  res.json(animal)
})


app.post('/api/animal', sanitizeAnimalInput, (req,res )=>{
  const {nombre, fechaRescate, fechaNacimientoEStimativa, id} = req.body

  const animales2 = new animal (nombre, fechaRescate, fechaNacimientoEStimativa, id ); 

  animales.push(animales2)
  return res.status(201).send({message: 'animal agregado correctamente', data: animal })
})


app.put ('/api/animal/:id', sanitizeAnimalInput, (req,res )=>{
  const animalIdx = animales.findIndex((animal) => animal.id === req.params.id);
  if (animalIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }

  animales[animalIdx]= {...animales[animalIdx], ...req.body.sanitizedAnimal };

  res.status(200).send({message: 'animal modificado correctamente', data:  animales[animalIdx] })
})


app.patch ('/api/animal/:id', sanitizeAnimalInput, (req,res )=>{
  const animalIdx = animales.findIndex((animal) => animal.id === req.params.id);
  if (animalIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }

  animales[animalIdx]= {...animales[animalIdx], ...req.body.sanitizedAnimal };

  res.status(200).send({message: 'animal modificado correctamente', data: animales[animalIdx] })
})


app.delete('/api/animal/:id',(req,res )=>{
  const animalIdx = animales.findIndex((animal) => animal.id === req.params.id);
  if(animalIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }
  animales.splice(animalIdx, 1);
  res.status(200).send({message: 'animal eliminado correctamente'})
})

app.listen(3000, ()=>{
console.log('server running on http://localhost:3000/');
})

 //put--> se utiliza para modificar el objeto entero
   // patch--> se utiliza para modificar parcialmente el objeto, osea algunos atributos "/*".