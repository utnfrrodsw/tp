import 'reflect-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { specialtyRouter } from './specialty/specialty.routes.js';
import { treatmentRouter } from './treatment/treatment.routes.js';
import { consultingRouter } from './consulting/consulting.route.js';
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/api/specialties', specialtyRouter);
app.use('/api/treatments', treatmentRouter);
app.use('/api/consulting', consultingRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
await syncSchema();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=app.js.map