import express, { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { serviceTypeRouter } from './tipoServicio/tipoServ.route.js';

const app = express();

app.use(express.json());

app.use((req, res, next: NextFunction) => {
  RequestContext.create(orm.em, next);
});

app.use('/api/serviceTypes', serviceTypeRouter);

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' });
});

await syncSchema(); //nunca en producción

app.listen(3006, () => {
  console.log('Server runnning on http://localhost:3006/');
});
