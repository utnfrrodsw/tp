import 'reflec-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/orm.js';
import { RequestContext } from '@mikro-orm/core';

const app = express();
app.use(express.json());


app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

//app.use('/api/users/')

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' });
});

await syncSchema();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

