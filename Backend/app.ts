import express, { NextFunction, Request, Response } from 'express';
import { product } from './scr/products/product.entity.js';
import { vet } from './scr/vet/vet.entity.js';
import { zone } from './scr/zone/zone.entity.js';
import { specie } from './scr/specie/specie.entity.js';
import { BuyRepository } from './scr/buy/buy.repository.js';

import { buyRouter } from './scr/buy/buy.router.js';
import { personRouter } from './scr/person/person.router.js';
import { rescueRouter } from './scr/rescue/rescue.router.js';
import { shelterRouter } from './scr/shelter/shelter.router.js';
import { animalRouter } from './scr/animal/animal.router.js';

const app = express();
app.use(express.json());
const buyrepository = new BuyRepository();

//buy
app.use('/api/buy', buyRouter)
//person 
app.use('/api/person', personRouter)
//rescue
app.use('/api/rescue', rescueRouter)
//shelter
app.use('/api/shelter', shelterRouter)
//animal
app.use('/api/animal', animalRouter)

//product --> /api/product/

const products = [
  new product(
    'Alimento',
    'Alimento balanceado para perro',
    100,
    '01'
  ),
];

function sanitizeproductInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedproduct = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    stock: req.body.stock
  }

  Object.keys(req.body.sanitizedproduct).forEach((key) => {
    if (req.body.sanitizedproduct[key] === undefined) {
      delete req.body.sanitizedproduct[key]
    }
  })

  next()
}


app.get('/api/product',(req,res )=>{
  res.json(products);
})


app.get('/api/product/:id',(req,res )=>{
  const product = products.find((product) => product.id === req.params.id);
  if(!product){
    return res.status(404).send({message:'ID incorrecto, no existe ningun product con ese ID' })
  }
  res.json(product)
})


app.post('/api/product', sanitizeproductInput, (req,res) => {
  const {nombre, descripcion, stock, id} = req.body

  const products2 = new product (nombre, descripcion, stock, id ); 

  products.push(products2)
  return res.status(201).send({message: 'product agregado correctamente', data: product })
})


app.put ('/api/product/:id', sanitizeproductInput, (req,res) => {
  const productIdx = products.findIndex((product) => product.id === req.params.id);
  if (productIdx === -1) {
    res.status(404).send({message:'ID incorrecto, no existe ningun product con ese ID' })
  }

  products[productIdx]= {...products[productIdx], ...req.body.sanitizedproduct };

  res.status(200).send({message: 'product modificado correctamente', data: products[productIdx] })
})


app.patch ('/api/product/:id', sanitizeproductInput, (req,res )=>{
  const productIdx = products.findIndex((product) => product.id === req.params.id);
  if (productIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun product con ese ID' })
  }

  products[productIdx]= {...products[productIdx], ...req.body.sanitizedproduct };

  res.status(200).send({message: 'product modificado correctamente', data: products[productIdx]  })
})


app.delete('/api/product/:id',(req,res )=> {
  const productIdx = products.findIndex((product) => product.id === req.params.id);
  if (productIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun product con ese ID' })
  }
  products.splice(productIdx, 1);
  return res.status(200).send({message: 'product eliminado correctamente'})
})


//vet--> /api/vet/
const vets = [
  new vet(
    'vet 1',
    'calle falsa 123',
    '1'
  )
]

function sanitizevetInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedvet = {
    nombre: req.body.nombre,
    direccion: req.body.direccion
  }

  Object.keys(req.body.sanitizedvet).forEach((key) => {
    if (req.body.sanitizedvet[key] === undefined) {
      delete req.body.sanitizedvet[key]
    }
  })

  next()
}

app.get('/api/vet',(req,res )=>{
  res.json(vets);
})

app.get('/api/vet/:id',(req,res )=>{
  const vet = vets.find((vet) => vet.id === req.params.id);
  if(!vet){
    return res.status(404).send({message:'ID incorrecto, no existe ningun vet con ese ID' })
  }
  res.json(vet)
})


app.post('/api/vet', sanitizevetInput, (req,res )=>{
  const {nombre, direccion, id} = req.body

  const vets2 = new vet (nombre, direccion, id ); 

  vets.push(vets2)
  return res.status(201).send({message: 'vet agregado correctamente', data: vet })
})


app.put ('/api/vet/:id', sanitizevetInput, (req,res )=>{
  const vetIdx = vets.findIndex((vet) => vet.id === req.params.id);
  if (vetIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun vet con ese ID' })
  }

  vets[vetIdx]= {...vets[vetIdx], ...req.body.sanitizedvet };

  return res.status(200).send({message: 'vet modificado correctamente', data:  vets[vetIdx] })
})


app.patch ('/api/vet/:id', sanitizevetInput, (req,res )=>{
  const vetIdx = vets.findIndex((vet) => vet.id === req.params.id);
  if (vetIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun vet con ese ID' })
  }

  vets[vetIdx]= {...vets[vetIdx], ...req.body.sanitizedvet };

  return res.status(200).send({message: 'vet modificado correctamente', data: vets[vetIdx] })
})


app.delete('/api/vet/:id',(req,res )=>{
  const vetIdx = vets.findIndex((vet) => vet.id === req.params.id);
  if(vetIdx === -1){
    return res.status(404).send({message:'ID incorrecto, no existe ningun vet con ese ID' })
  }
  vets.splice(vetIdx, 1);
  return res.status(200).send({message: 'vet eliminado correctamente'})
})


//specie--> /api/specie/
const species = [
  new specie(
    'Gato',
    '01'
  ),
];

function sanitizespecieInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedspecie = {
    nombre: req.body.nombre,
  }

  Object.keys(req.body.sanitizedspecie).forEach((key) => {
    if (req.body.sanitizedspecie[key] === undefined) {
      delete req.body.sanitizedspecie[key]
    }
  })

  next()
}


app.get('/api/specie',(req,res )=>{
  res.json(species);
})


app.get('/api/specie/:id',(req,res )=>{
  const specie = species.find((specie) => specie.id === req.params.id);
  if(!specie){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna specie con ese ID' })
  }
  res.json(specie)
})


app.post('/api/specie', sanitizespecieInput, (req,res )=>{
  const {nombre, id } = req.body

  const species2 = new specie (nombre, id); 

  species.push(species2)
  return res.status(201).send({message: 'specie agregada correctamente', data: specie })
})


app.put ('/api/specie/:id', sanitizespecieInput, (req,res )=>{
  const specieIdx = species.findIndex((specie) => specie.id === req.params.id);
  if (specieIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna specie con ese ID' })
  }

  species[specieIdx]= {...species[specieIdx], ...req.body.sanitizedspecie };

  return res.status(200).send({message: 'specie modificada correctamente', data:  species[specieIdx] })
})


app.patch ('/api/specie/:id', sanitizespecieInput, (req,res )=>{
  const specieIdx = species.findIndex((specie) => specie.id === req.params.id);
  if (specieIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna specie con ese ID' })
  }

  species[specieIdx]= {...species[specieIdx], ...req.body.sanitizedspecie };

  return res.status(200).send({message: 'specie modificada correctamente', data: species[specieIdx] })
})


app.delete('/api/specie/:id',(req,res )=>{
  const specieIdx = species.findIndex((specie) => specie.id === req.params.id);
  if(specieIdx === -1){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna specie con ese ID' })
  }
  species.splice(specieIdx, 1);
  return res.status(200).send({message: 'specie eliminada correctamente'})
})


// zone--> /api/zone/
const zones = [
  new zone(
    'Norte',
    '1'
  ),
];

function sanitizezoneInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedzone = {
    nombre: req.body.nombre
  }

  Object.keys(req.body.sanitizedzone).forEach((key) => {
    if (req.body.sanitizedzone[key] === undefined) {
      delete req.body.sanitizedzone[key]
    }
  })

  next()
}

app.get('/api/zone',(req,res )=>{
  res.json(zones);
})


app.get('/api/zone/:id',(req,res )=>{
  const zone = zones.find((zone) => zone.id === req.params.id);
  if(!zone){
    return res.status(404).send({message:'ID incorrecto, no existe ningun zone con ese ID' })
  }
  res.json(zone)
})


app.post('/api/zone', sanitizezoneInput, (req,res )=>{
  const {nombre, id} = req.body

  const zones2 = new zone (nombre, id ); 

  zones.push(zones2)
  return res.status(201).send({message: 'zone agregado correctamente', data: zone })
})


app.put ('/api/zone/:id', sanitizezoneInput, (req,res )=>{
  const zoneIdx = zones.findIndex((zone) => zone.id === req.params.id);
  if (zoneIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun zone con ese ID' })
  }

  zones[zoneIdx]= {...zones[zoneIdx], ...req.body.sanitizedzone };

  return res.status(200).send({message: 'zone modificado correctamente', data:  zones[zoneIdx] })
})


app.patch ('/api/zone/:id', sanitizezoneInput, (req,res )=>{
  const zoneIdx = zones.findIndex((zone) => zone.id === req.params.id);
  if (zoneIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun zone con ese ID' })
  }

  zones[zoneIdx]= {...zones[zoneIdx], ...req.body.sanitizedzone };

  return res.status(200).send({message: 'zone modificado correctamente', data: zones[zoneIdx] })
})


app.delete('/api/zone/:id',(req,res )=>{
  const zoneIdx = zones.findIndex((zone) => zone.id === req.params.id);
  if(zoneIdx === -1){
    return res.status(404).send({message:'ID incorrecto, no existe ningun zone con ese ID' })
  }
  zones.splice(zoneIdx, 1);
  return res.status(200).send({message: 'zone eliminado correctamente'})
})



//rescue --> /api/rescue/


app.listen(3000, ()=>{
console.log('server running on http://localhost:3000/');
})

//put--> se utiliza para modificar el objeto entero
// patch--> se utiliza para modificar parcialmente el objeto, osea algunos atributos "/*".
