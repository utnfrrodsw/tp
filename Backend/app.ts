import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express';
import {orm, syncSchema} from './scr/zshare/db/orm.js';
import { RequestContext } from '@mikro-orm/core';

import { buyRouter } from './scr/buy/buy.router.js';
import { personRouter } from './scr/person/person.router.js';
import { rescueRouter } from './scr/rescue/rescue.router.js';
import { shelterRouter } from './scr/shelter/shelter.router.js';
import { animalRouter } from './scr/animal/animal.router.js';
import { productRouter } from './scr/product/product.router.js';

const app = express();
app.use(express.json());

//luego de los middlewares base
app.use((req, res, next ) => {
  RequestContext.create(orm.em, next)})

//antes de las rutas y middlewares

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

await syncSchema() //never in production*/

app.listen(3000, ()=>{
console.log('server running on http://localhost:3000/');
})
