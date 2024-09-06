import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express';
import {orm, syncSchema} from './scr/zshare/db/orm.js';
import { RequestContext } from '@mikro-orm/core';

import { animalRouter } from './scr/animal/animal.router.js';
import { breedRouter } from './scr/breed/breed.router.js';

const app = express();
app.use(express.json());

//luego de los middlewares base
app.use((req, res, next ) => {
  RequestContext.create(orm.em, next)
})

//antes de las rutas y middlewares

app.use('/api/breed', breedRouter)
app.use('/api/animal', animalRouter)

await syncSchema() //never in production*/

app.listen(3000, ()=>{
console.log('server running on http://localhost:3000/');
})
