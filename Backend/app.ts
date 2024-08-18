import express, { NextFunction, Request, Response } from 'express';

import { buyRouter } from './scr/buy/buy.router.js';
import { personRouter } from './scr/person/person.router.js';
import { rescueRouter } from './scr/rescue/rescue.router.js';
import { shelterRouter } from './scr/shelter/shelter.router.js';
import { animalRouter } from './scr/animal/animal.router.js';
import { productRouter } from './scr/product/product.router.js';

const app = express();
app.use(express.json());

//buy
app.use('/api/buy', buyRouter)
//person 
app.use('/api/person', personRouter)
//product
app.use('/api/product', productRouter)
//rescue
app.use('/api/rescue', rescueRouter)
//shelter
app.use('/api/shelter', shelterRouter)
//animal
app.use('/api/animal', animalRouter)

app.listen(3000, ()=>{
console.log('server running on http://localhost:3000/');
})
