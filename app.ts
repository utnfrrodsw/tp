import express, { NextFunction, Request, Response } from 'express';
import { animal } from './clases/animal.js';
import { especie } from './clases/especie.js';
import { persona } from './clases/persona.js';
import { refugio } from './clases/refugio.js';
import { producto } from './clases/producto.js';
import { veterinaria } from './clases/veterinaria.js';
import { compra } from './clases/compra.js';
import { zona } from './clases/zona.js';
import { rescate } from './clases/rescate.js';


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

//PRODUCTO --> /api/producto/

const productos = [
  new producto(
    'Alimento',
    'Alimento balanceado para perro',
    100,
    '01'
  ),
];

function sanitizeProductoInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedProducto = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    stock: req.body.stock
  }

  Object.keys(req.body.sanitizedProducto).forEach((key) => {
    if (req.body.sanitizedProducto[key] === undefined) {
      delete req.body.sanitizedProducto[key]
    }
  })

  next()
}


app.get('/api/producto',(req,res )=>{
  res.json(productos);
})


app.get('/api/producto/:id',(req,res )=>{
  const producto = productos.find((producto) => producto.id === req.params.id);
  if(!producto){
    return res.status(404).send({message:'ID incorrecto, no existe ningun producto con ese ID' })
  }
  res.json(producto)
})


app.post('/api/producto', sanitizeProductoInput, (req,res) => {
  const {nombre, descripcion, stock, id} = req.body

  const productos2 = new producto (nombre, descripcion, stock, id ); 

  productos.push(productos2)
  return res.status(201).send({message: 'Producto agregado correctamente', data: producto })
})


app.put ('/api/producto/:id', sanitizeProductoInput, (req,res) => {
  const productoIdx = productos.findIndex((producto) => producto.id === req.params.id);
  if (productoIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun producto con ese ID' })
  }

  productos[productoIdx]= {...productos[productoIdx], ...req.body.sanitizedProducto };

  res.status(200).send({message: 'Producto modificado correctamente', data: productos[productoIdx] })
})


app.patch ('/api/producto/:id', sanitizeProductoInput, (req,res )=>{
  const productoIdx = productos.findIndex((producto) => producto.id === req.params.id);
  if (productoIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun producto con ese ID' })
  }

  productos[productoIdx]= {...productos[productoIdx], ...req.body.sanitizedProducto };

  res.status(200).send({message: 'Producto modificado correctamente', data: productos[productoIdx]  })
})


app.delete('/api/producto/:id',(req,res )=> {
  const productoIdx = productos.findIndex((producto) => producto.id === req.params.id);
  if (productoIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun producto con ese ID' })
  }
  productos.splice(productoIdx, 1);
  res.status(200).send({message: 'Producto eliminado correctamente'})
})


//Veterinaria--> /api/Veterinaria/
const veterinarias = [
  new veterinaria(
    'veterinaria 1',
    'calle falsa 123',
    '1'
  )
]

function sanitizeveterinariaInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedveterinaria = {
    nombre: req.body.nombre,
    direccion: req.body.direccion
  }

  Object.keys(req.body.sanitizedveterinaria).forEach((key) => {
    if (req.body.sanitizedveterinaria[key] === undefined) {
      delete req.body.sanitizedveterinaria[key]
    }
  })

  next()
}

app.get('/api/veterinaria',(req,res )=>{
  res.json(veterinarias);
})

app.get('/api/veterinaria/:id',(req,res )=>{
  const veterinaria = veterinarias.find((veterinaria) => veterinaria.id === req.params.id);
  if(!veterinaria){
    return res.status(404).send({message:'ID incorrecto, no existe ningun veterinaria con ese ID' })
  }
  res.json(veterinaria)
})


app.post('/api/veterinaria', sanitizeveterinariaInput, (req,res )=>{
  const {nombre, direccion, id} = req.body

  const veterinarias2 = new veterinaria (nombre, direccion, id ); 

  veterinarias.push(veterinarias2)
  return res.status(201).send({message: 'veterinaria agregado correctamente', data: veterinaria })
})


app.put ('/api/veterinaria/:id', sanitizeveterinariaInput, (req,res )=>{
  const veterinariaIdx = veterinarias.findIndex((veterinaria) => veterinaria.id === req.params.id);
  if (veterinariaIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun veterinaria con ese ID' })
  }

  veterinarias[veterinariaIdx]= {...veterinarias[veterinariaIdx], ...req.body.sanitizedveterinaria };

  res.status(200).send({message: 'veterinaria modificado correctamente', data:  veterinarias[veterinariaIdx] })
})


app.patch ('/api/veterinaria/:id', sanitizeveterinariaInput, (req,res )=>{
  const veterinariaIdx = veterinarias.findIndex((veterinaria) => veterinaria.id === req.params.id);
  if (veterinariaIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun veterinaria con ese ID' })
  }

  veterinarias[veterinariaIdx]= {...veterinarias[veterinariaIdx], ...req.body.sanitizedveterinaria };

  res.status(200).send({message: 'veterinaria modificado correctamente', data: veterinarias[veterinariaIdx] })
})


app.delete('/api/veterinaria/:id',(req,res )=>{
  const veterinariaIdx = veterinarias.findIndex((veterinaria) => veterinaria.id === req.params.id);
  if(veterinariaIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ningun veterinaria con ese ID' })
  }
  veterinarias.splice(veterinariaIdx, 1);
  res.status(200).send({message: 'veterinaria eliminado correctamente'})
})

//Refugio--> /api/Refugio/

const refugios = [
  new refugio(
    'patas alegres',
    'avellaneda',
    10,
    '2'
  ),
];


function sanitizeRefugioInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedRefugio = {
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    capacidadMaxima: req.body.capacidadMaxima
  }

  Object.keys(req.body.sanitizedRefugio).forEach((key) => {
    if (req.body.sanitizedRefugio[key] === undefined) {
      delete req.body.sanitizedRefugio[key]
    }
  })

  next()
}

app.get('/api/refugio',(req,res )=>{
  res.json(refugios);
})

app.get('/api/refugio/:id',(req,res )=>{
  const refugio = refugios.find((refugio) => refugio.id === req.params.id);
  if(!refugio){
    return res.status(404).send({message:'ID incorrecto, no existe ningun refugio con ese ID' })
  }
  res.json(refugio)
})


app.post('/api/refugio', sanitizeRefugioInput, (req,res )=>{
  const {nombre, direccion, capacidadMaxima, id} = req.body

  const refugio2 = new refugio (nombre, direccion, capacidadMaxima, id ); 

  refugios.push(refugio2)
  return res.status(201).send({message: 'Sucursal de refugio agregada correctamente', data: refugio2 })
})


app.put ('/api/refugio/:id', sanitizeRefugioInput, (req,res )=>{
  const refugioIdx = refugios.findIndex((refugio) => refugio.id === req.params.id);
  if (refugioIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }

  refugios[refugioIdx]= {...refugios[refugioIdx], ...req.body.sanitizedRefugio };

  res.status(200).send({message: 'refugio modificado correctamente', data:  refugios[refugioIdx] })
})


app.patch ('/api/refugio/:id', sanitizeRefugioInput, (req,res )=>{
  const refugioIdx = refugios.findIndex((refugio) => refugio.id === req.params.id);
  if (refugioIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun refugio con ese ID' })
  }

  refugios[refugioIdx]= {...refugios[refugioIdx], ...req.body.sanitizedRefugio };

  res.status(200).send({message: 'refugio modificado correctamente', data: refugios[refugioIdx] })
})


app.delete('/api/refugio/:id',(req,res )=>{
  const refugioIdx = refugios.findIndex((refugio) => refugio.id === req.params.id);
  if(refugioIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ningun refugio con ese ID' })
  }
  refugios.splice(refugioIdx, 1);
  res.status(200).send({message: 'refugio eliminado correctamente'})
})

//persona --> /api/persona/

const personas = [
  new persona(
    'Persona',
    'Falsa',
    'DNI',
    23213213,
    'telefono falso',
    '01/02/2002',
    'calle falsa',
    23213213342,
    '01'
  ),
];

function sanitizePersonaInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedPersona = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    tipoDoc: req.body.tipoDoc,
    nroDoc: req.body.nroDoc,
    contacto: req.body.contacto,
    fechaNacimiento: req.body.fechaNacimiento,
    domicilio: req.body.domicilio,
    nroCuit: req.body.nroCuit
  }

  Object.keys(req.body.sanitizedPersona).forEach((key) => {
    if (req.body.sanitizedPersona[key] === undefined) {
      delete req.body.sanitizedPersona[key]
    }
  })

  next()
}


app.get('/api/persona',(req,res )=>{
  res.json(personas);
})


app.get('/api/persona/:id',(req,res )=>{
  const persona = personas.find((persona) => persona.id === req.params.id);
  if(!persona){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna persona con ese ID' })
  }
  res.json(persona)
})


app.post('/api/persona', sanitizePersonaInput, (req,res )=>{
  const {nombre, apellido, tipoDoc, nroDoc, contacto, fechaNacimiento, domicilio, nroCuit, id } = req.body

  const personas2 = new persona (nombre, apellido, tipoDoc, nroDoc, contacto, fechaNacimiento, domicilio, nroCuit, id ); 

  personas.push(personas2)
  return res.status(201).send({message: 'Persona agregada correctamente', data: persona })
})


app.put ('/api/persona/:id', sanitizePersonaInput, (req,res )=>{
  const personaIdx = personas.findIndex((persona) => persona.id === req.params.id);
  if (personaIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ninguna persona con ese ID' })
  }

  personas[personaIdx]= {...personas[personaIdx], ...req.body.sanitizedPersona };

  res.status(200).send({message: 'Persona modificada correctamente', data:  personas[personaIdx] })
})


app.patch ('/api/persona/:id', sanitizePersonaInput, (req,res )=>{
  const personaIdx = personas.findIndex((persona) => persona.id === req.params.id);
  if (personaIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna persona con ese ID' })
  }

  personas[personaIdx]= {...personas[personaIdx], ...req.body.sanitizedPersona };

  res.status(200).send({message: 'Persona modificada correctamente', data: personas[personaIdx] })
})


app.delete('/api/persona/:id',(req,res )=>{
  const personaIdx = personas.findIndex((persona) => persona.id === req.params.id);
  if(personaIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ninguna persona con ese ID' })
  }
  personas.splice(personaIdx, 1);
  res.status(200).send({message: 'Persona eliminada correctamente'})
})

//especie--> /api/especie/
const especies = [
  new especie(
    'Gato',
    '01'
  ),
];

function sanitizeEspecieInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedEspecie = {
    nombre: req.body.nombre,
  }

  Object.keys(req.body.sanitizedEspecie).forEach((key) => {
    if (req.body.sanitizedEspecie[key] === undefined) {
      delete req.body.sanitizedEspecie[key]
    }
  })

  next()
}


app.get('/api/especie',(req,res )=>{
  res.json(especies);
})


app.get('/api/especie/:id',(req,res )=>{
  const especie = especies.find((especie) => especie.id === req.params.id);
  if(!especie){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna especie con ese ID' })
  }
  res.json(especie)
})


app.post('/api/especie', sanitizeEspecieInput, (req,res )=>{
  const {nombre, id } = req.body

  const especies2 = new especie (nombre, id); 

  especies.push(especies2)
  return res.status(201).send({message: 'Especie agregada correctamente', data: especie })
})


app.put ('/api/especie/:id', sanitizeEspecieInput, (req,res )=>{
  const especieIdx = especies.findIndex((especie) => especie.id === req.params.id);
  if (especieIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ninguna especie con ese ID' })
  }

  especies[especieIdx]= {...especies[especieIdx], ...req.body.sanitizedEspecie };

  res.status(200).send({message: 'Especie modificada correctamente', data:  especies[especieIdx] })
})


app.patch ('/api/especie/:id', sanitizeEspecieInput, (req,res )=>{
  const especieIdx = especies.findIndex((especie) => especie.id === req.params.id);
  if (especieIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna especie con ese ID' })
  }

  especies[especieIdx]= {...especies[especieIdx], ...req.body.sanitizedEspecie };

  res.status(200).send({message: 'Especie modificada correctamente', data: especies[especieIdx] })
})


app.delete('/api/especie/:id',(req,res )=>{
  const especieIdx = especies.findIndex((especie) => especie.id === req.params.id);
  if(especieIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ninguna especie con ese ID' })
  }
  especies.splice(especieIdx, 1);
  res.status(200).send({message: 'Especie eliminada correctamente'})
})


// zona--> /api/zona/
const zonas = [
  new zona(
    'Norte',
    '1'
  ),
];

function sanitizeZonaInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedZona = {
    nombre: req.body.nombre
  }

  Object.keys(req.body.sanitizedZona).forEach((key) => {
    if (req.body.sanitizedZona[key] === undefined) {
      delete req.body.sanitizedZona[key]
    }
  })

  next()
}

app.get('/api/zona',(req,res )=>{
  res.json(zonas);
})


app.get('/api/zona/:id',(req,res )=>{
  const zona = zonas.find((zona) => zona.id === req.params.id);
  if(!zona){
    return res.status(404).send({message:'ID incorrecto, no existe ningun zona con ese ID' })
  }
  res.json(zona)
})


app.post('/api/zona', sanitizeZonaInput, (req,res )=>{
  const {nombre, id} = req.body

  const zonas2 = new zona (nombre, id ); 

  zonas.push(zonas2)
  return res.status(201).send({message: 'zona agregado correctamente', data: zona })
})


app.put ('/api/zona/:id', sanitizeZonaInput, (req,res )=>{
  const zonaIdx = zonas.findIndex((zona) => zona.id === req.params.id);
  if (zonaIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun zona con ese ID' })
  }

  zonas[zonaIdx]= {...zonas[zonaIdx], ...req.body.sanitizedZona };

  res.status(200).send({message: 'zona modificado correctamente', data:  zonas[zonaIdx] })
})


app.patch ('/api/zona/:id', sanitizeZonaInput, (req,res )=>{
  const zonaIdx = zonas.findIndex((zona) => zona.id === req.params.id);
  if (zonaIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun zona con ese ID' })
  }

  zonas[zonaIdx]= {...zonas[zonaIdx], ...req.body.sanitizedZona };

  res.status(200).send({message: 'zona modificado correctamente', data: zonas[zonaIdx] })
})


app.delete('/api/zona/:id',(req,res )=>{
  const zonaIdx = zonas.findIndex((zona) => zona.id === req.params.id);
  if(zonaIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ningun zona con ese ID' })
  }
  zonas.splice(zonaIdx, 1);
  res.status(200).send({message: 'zona eliminado correctamente'})
})

const compras = [
  new compra(
    10000,
    12,
    '12/12/2022',
    '12',
)];

function sanitizeCompraInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedCompra = {
    total: req.body.total,
    cantidad: req.body.cantidad,
    fechaCompra: req.body.fechaCompra,
    id: req.body.id,
  }

  Object.keys(req.body.sanitizedCompra).forEach((key) => {
    if (req.body.sanitizedCompra[key] === undefined) {
      delete req.body.sanitizedCompra[key]
    }
  })

  next()
}


app.get('/api/compra',(req,res )=>{
  res.json(compras);
})


app.get('/api/compra/:id',(req,res )=>{
  const compra = compras.find((compra) => compra.id === req.params.id);
  if(!compra){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna compra con ese ID' })
  }
  res.json(compra)
})


app.post('/api/compra', sanitizeCompraInput, (req,res )=>{
  const {total, cantidad, fechaCompra, id } = req.body

  const compras2 = new compra (total, cantidad, fechaCompra, id ); 

  compras.push(compras2)
  return res.status(201).send({message: 'Nueva compra agregada correctamente', data: compra })
})


app.put ('/api/compra/:id', sanitizeCompraInput, (req,res )=>{
  const compraIdx = compras.findIndex((compra) => compra.id === req.params.id);
  if (compraIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ninguna persona con ese ID' })
  }

  compras[compraIdx]= {...compras[compraIdx], ...req.body.sanitizedCompra };

  res.status(200).send({message: 'Compra modificada correctamente', data:  compras[compraIdx] })
})


app.patch ('/api/compra/:id', sanitizeCompraInput, (req,res )=>{
  const compraIdx = compras.findIndex((compra) => compra.id === req.params.id);
  if (compraIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna compra con ese ID' })
  }

  compras[compraIdx]= {...compras[compraIdx], ...req.body.sanitizedCompra };

  res.status(200).send({message: 'Compra modificada correctamente', data: compras[compraIdx] })
})


app.delete('/api/compra/:id',(req,res )=>{
  const compraIdx = compras.findIndex((compra) => compra.id === req.params.id);
  if(compraIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ninguna compra con ese ID' })
  }
  compras.splice(compraIdx, 1);
  res.status(200).send({message: 'compra eliminada correctamente'})
})


//RESCATE --> /api/rescate/

const rescates = [
  new rescate(
    '10-04-2024',
    'Perro solitario',
    'el carnicero de la esquina le daba comida',
    '1'
  ),
];

function sanitizeRescateInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedRescate = {
    fechaRescate: req.body.fechaRescate,
    descripcion: req.body.descripcion,
    comentario: req.body.comentario
  }

  Object.keys(req.body.sanitizedRescate).forEach((key) => {
    if (req.body.sanitizedRescate[key] === undefined) {
      delete req.body.sanitizedRescate[key]
    }
  })

  next()
}

app.get('/api/rescate',(req,res )=>{
  res.json(rescates);
})


app.get('/api/rescate/:id',(req,res )=>{
  const rescate = rescates.find((rescate) => rescate.id === req.params.id);
  if(!rescate){
    return res.status(404).send({message:'ID incorrecto, no existe ningun rescate con ese ID' })
  }
  res.json(rescate)
})


app.post('/api/rescate', sanitizeRescateInput, (req,res )=>{
  const rescates2 = { ...req.body.sanitizedRescate, id: req.body.id }; 
  rescates.push(rescates2)
  return res.status(201).send({message: 'rescate agregado correctamente', data: rescate })
})


app.put ('/api/rescate/:id', sanitizeRescateInput, (req,res )=>{
  const rescateIdx = rescates.findIndex((rescate) => rescate.id === req.params.id);
  if (rescateIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun rescate con ese ID' })
  }

  rescates[rescateIdx]= {...rescates[rescateIdx], ...req.body.sanitizedRescate };

  res.status(200).send({message: 'rescate modificado correctamente', data:  rescates[rescateIdx] })
})


app.patch ('/api/rescate/:id', sanitizeRescateInput, (req,res )=>{
  const rescateIdx = rescates.findIndex((rescate) => rescate.id === req.params.id);
  if (rescateIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun rescate con ese ID' })
  }

  rescates[rescateIdx]= {...rescates[rescateIdx], ...req.body.sanitizedRescate };

  res.status(200).send({message: 'rescate modificado correctamente', data: rescates[rescateIdx] })
})


app.delete('/api/rescate/:id',(req,res )=>{
  const rescateIdx = rescates.findIndex((rescate) => rescate.id === req.params.id);
  if(rescateIdx === -1){
    res.status(404).send({message:'ID incorrecto, no existe ningun rescate con ese ID' })
  }
  rescates.splice(rescateIdx, 1);
  res.status(200).send({message: 'rescate eliminado correctamente'})
})


app.listen(3000, ()=>{
console.log('server running on http://localhost:3000/');
})

//put--> se utiliza para modificar el objeto entero
// patch--> se utiliza para modificar parcialmente el objeto, osea algunos atributos "/*".