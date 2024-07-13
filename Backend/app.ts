import express, { NextFunction, Request, Response } from 'express';
import { animal } from './scr/animal/animal.entity.js';
import { buy } from './scr/buy/buy.entity.js';
import { person} from './scr/person/person.entity.js';
import { shelter } from './scr/shelter/shelter.entity.js';
import { product } from './scr/products/product.entity.js';
import { vet } from './scr/vet/vet.entity.js';
import { zone } from './scr/zone/zone.entity.js';
import { rescue } from './scr/rescue/rescue.entity.js';
import { specie } from './scr/specie/specie.entity.js';


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
    fecharescue: req.body.fecharescue,
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
  const {nombre, fecharescue, fechaNacimientoEStimativa, id} = req.body

  const animales2 = new animal (nombre, fecharescue, fechaNacimientoEStimativa, id ); 

  animales.push(animales2)
  return res.status(201).send({message: 'animal agregado correctamente', data: animal })
})


app.put ('/api/animal/:id', sanitizeAnimalInput, (req,res )=>{
  const animalIdx = animales.findIndex((animal) => animal.id === req.params.id);
  if (animalIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }

  animales[animalIdx]= {...animales[animalIdx], ...req.body.sanitizedAnimal };

  return res.status(200).send({message: 'animal modificado correctamente', data:  animales[animalIdx] })
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
    return res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }
  animales.splice(animalIdx, 1);
  return res.status(200).send({message: 'animal eliminado correctamente'})
})

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

//shelter--> /api/shelter/

const shelters = [
  new shelter(
    'patas alegres',
    'avellaneda',
    10,
    '2'
  ),
];


function sanitizeshelterInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedshelter = {
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    capacidadMaxima: req.body.capacidadMaxima
  }

  Object.keys(req.body.sanitizedshelter).forEach((key) => {
    if (req.body.sanitizedshelter[key] === undefined) {
      delete req.body.sanitizedshelter[key]
    }
  })

  next()
}

app.get('/api/shelter',(req,res )=>{
  res.json(shelters);
})

app.get('/api/shelter/:id',(req,res )=>{
  const shelter = shelters.find((shelter) => shelter.id === req.params.id);
  if(!shelter){
    return res.status(404).send({message:'ID incorrecto, no existe ningun shelter con ese ID' })
  }
  res.json(shelter)
})


app.post('/api/shelter', sanitizeshelterInput, (req,res )=>{
  const {nombre, direccion, capacidadMaxima, id} = req.body

  const shelter2 = new shelter (nombre, direccion, capacidadMaxima, id ); 

  shelters.push(shelter2)
  return res.status(201).send({message: 'Sucursal de shelter agregada correctamente', data: shelter2 })
})


app.put ('/api/shelter/:id', sanitizeshelterInput, (req,res )=>{
  const shelterIdx = shelters.findIndex((shelter) => shelter.id === req.params.id);
  if (shelterIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun animal con ese ID' })
  }

  shelters[shelterIdx]= {...shelters[shelterIdx], ...req.body.sanitizedshelter };

  return res.status(200).send({message: 'shelter modificado correctamente', data:  shelters[shelterIdx] })
})


app.patch ('/api/shelter/:id', sanitizeshelterInput, (req,res )=>{
  const shelterIdx = shelters.findIndex((shelter) => shelter.id === req.params.id);
  if (shelterIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun shelter con ese ID' })
  }

  shelters[shelterIdx]= {...shelters[shelterIdx], ...req.body.sanitizedshelter };

  return res.status(200).send({message: 'shelter modificado correctamente', data: shelters[shelterIdx] })
})


app.delete('/api/shelter/:id',(req,res )=>{
  const shelterIdx = shelters.findIndex((shelter) => shelter.id === req.params.id);
  if(shelterIdx === -1){
    return res.status(404).send({message:'ID incorrecto, no existe ningun shelter con ese ID' })
  }
  shelters.splice(shelterIdx, 1);
  return res.status(200).send({message: 'shelter eliminado correctamente'})
})

//person --> /api/person/

const people = [
  new person(
    'person',
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

function sanitizepersonInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedperson = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    tipoDoc: req.body.tipoDoc,
    nroDoc: req.body.nroDoc,
    contacto: req.body.contacto,
    fechaNacimiento: req.body.fechaNacimiento,
    domicilio: req.body.domicilio,
    nroCuit: req.body.nroCuit
  }

  Object.keys(req.body.sanitizedperson).forEach((key) => {
    if (req.body.sanitizedperson[key] === undefined) {
      delete req.body.sanitizedperson[key]
    }
  })

  next()
}


app.get('/api/person',(req,res )=>{
  res.json(people);
})


app.get('/api/person/:id',(req,res )=>{
  const person = people.find((person) => person.id === req.params.id);
  if(!person){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna person con ese ID' })
  }
  res.json(person)
})


app.post('/api/person', sanitizepersonInput, (req,res )=>{
  const {nombre, apellido, tipoDoc, nroDoc, contacto, fechaNacimiento, domicilio, nroCuit, id } = req.body

  const people2 = new person (nombre, apellido, tipoDoc, nroDoc, contacto, fechaNacimiento, domicilio, nroCuit, id ); 

  people.push(people2)
  return res.status(201).send({message: 'person agregada correctamente', data: person })
})


app.put ('/api/person/:id', sanitizepersonInput, (req,res )=>{
  const personIdx = people.findIndex((person) => person.id === req.params.id);
  if (personIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna person con ese ID' })
  }

  people[personIdx]= {...people[personIdx], ...req.body.sanitizedperson };

  return res.status(200).send({message: 'person modificada correctamente', data:  people[personIdx] })
})


app.patch ('/api/person/:id', sanitizepersonInput, (req,res )=>{
  const personIdx = people.findIndex((person) => person.id === req.params.id);
  if (personIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna person con ese ID' })
  }

  people[personIdx]= {...people[personIdx], ...req.body.sanitizedperson };

  return res.status(200).send({message: 'person modificada correctamente', data: people[personIdx] })
})


app.delete('/api/person/:id',(req,res )=>{
  const personIdx = people.findIndex((person) => person.id === req.params.id);
  if(personIdx === -1){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna person con ese ID' })
  }
  people.splice(personIdx, 1);
  return res.status(200).send({message: 'person eliminada correctamente'})
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

const buys = [
  new buy(
    10000,
    12,
    '12/12/2022',
    '12',
)];

function sanitizebuyInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedbuy = {
    total: req.body.total,
    cantidad: req.body.cantidad,
    fechabuy: req.body.fechabuy,
    id: req.body.id,
  }

  Object.keys(req.body.sanitizedbuy).forEach((key) => {
    if (req.body.sanitizedbuy[key] === undefined) {
      delete req.body.sanitizedbuy[key]
    }
  })

  next()
}


app.get('/api/buy',(req,res )=>{
  res.json(buys);
})


app.get('/api/buy/:id',(req,res )=>{
  const buy = buys.find((buy) => buy.id === req.params.id);
  if(!buy){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna buy con ese ID' })
  }
  res.json(buy)
})


app.post('/api/buy', sanitizebuyInput, (req,res )=>{
  const {total, cantidad, fechabuy, id } = req.body

  const buys2 = new buy (total, cantidad, fechabuy, id ); 

  buys.push(buys2)
  return res.status(201).send({message: 'Nueva buy agregada correctamente', data: buy })
})


app.put ('/api/buy/:id', sanitizebuyInput, (req,res )=>{
  const buyIdx = buys.findIndex((buy) => buy.id === req.params.id);
  if (buyIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna person con ese ID' })
  }

  buys[buyIdx]= {...buys[buyIdx], ...req.body.sanitizedbuy };

  return res.status(200).send({message: 'buy modificada correctamente', data:  buys[buyIdx] })
})


app.patch ('/api/buy/:id', sanitizebuyInput, (req,res )=>{
  const buyIdx = buys.findIndex((buy) => buy.id === req.params.id);
  if (buyIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ninguna buy con ese ID' })
  }

  buys[buyIdx]= {...buys[buyIdx], ...req.body.sanitizedbuy };

  return res.status(200).send({message: 'buy modificada correctamente', data: buys[buyIdx] })
})


app.delete('/api/buy/:id',(req,res )=>{
  const buyIdx = buys.findIndex((buy) => buy.id === req.params.id);
  if(buyIdx === -1){
    return res.status(404).send({message:'ID incorrecto, no existe ninguna buy con ese ID' })
  }
  buys.splice(buyIdx, 1);
  return res.status(200).send({message: 'buy eliminada correctamente'})
})


//rescue --> /api/rescue/

const rescues = [
  new rescue(
    '10-04-2024',
    'Perro solitario',
    'el carnicero de la esquina le daba comida',
    '1'
  ),
];

function sanitizerescueInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedrescue = {
    fecharescue: req.body.fecharescue,
    descripcion: req.body.descripcion,
    comentario: req.body.comentario
  }

  Object.keys(req.body.sanitizedrescue).forEach((key) => {
    if (req.body.sanitizedrescue[key] === undefined) {
      delete req.body.sanitizedrescue[key]
    }
  })

  next()
}

app.get('/api/rescue',(req,res )=>{
  res.json(rescues);
})


app.get('/api/rescue/:id',(req,res )=>{
  const rescue = rescues.find((rescue) => rescue.id === req.params.id);
  if(!rescue){
    return res.status(404).send({message:'ID incorrecto, no existe ningun rescue con ese ID' })
  }
  res.json(rescue)
})


app.post('/api/rescue', sanitizerescueInput, (req,res )=>{
  const rescues2 = { ...req.body.sanitizedrescue, id: req.body.id }; 
  rescues.push(rescues2)
  return res.status(201).send({message: 'rescue agregado correctamente', data: rescue })
})


app.put ('/api/rescue/:id', sanitizerescueInput, (req,res )=>{
  const rescueIdx = rescues.findIndex((rescue) => rescue.id === req.params.id);
  if (rescueIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun rescue con ese ID' })
  }

  rescues[rescueIdx]= {...rescues[rescueIdx], ...req.body.sanitizedrescue };

  return res.status(200).send({message: 'rescue modificado correctamente', data:  rescues[rescueIdx] })
})


app.patch ('/api/rescue/:id', sanitizerescueInput, (req,res )=>{
  const rescueIdx = rescues.findIndex((rescue) => rescue.id === req.params.id);
  if (rescueIdx === -1) {
    return res.status(404).send({message:'ID incorrecto, no existe ningun rescue con ese ID' })
  }

  rescues[rescueIdx]= {...rescues[rescueIdx], ...req.body.sanitizedrescue };

  return res.status(200).send({message: 'rescue modificado correctamente', data: rescues[rescueIdx] })
})


app.delete('/api/rescue/:id',(req,res )=>{
  const rescueIdx = rescues.findIndex((rescue) => rescue.id === req.params.id);
  if(rescueIdx === -1){
    return res.status(404).send({message:'ID incorrecto, no existe ningun rescue con ese ID' })
  }
  rescues.splice(rescueIdx, 1);
  return res.status(200).send({message: 'rescue eliminado correctamente'})
})


app.listen(3000, ()=>{
console.log('server running on http://localhost:3000/');
})

//put--> se utiliza para modificar el objeto entero
// patch--> se utiliza para modificar parcialmente el objeto, osea algunos atributos "/*".