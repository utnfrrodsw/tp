import express from 'express';
import { specialtyRouter } from './specialty/specialty.routes.js';
import { consultingRouter } from './consulting/consulting.route.js';
import { treatmentRouter } from './treatment/treatment.routes.js';
import { userRouter } from './user/user.routes.js';
const app = express();
app.use(express.json());
app.use('/api/specialty', specialtyRouter);
app.use('/api/consulting', consultingRouter);
app.use('/api/treatment', treatmentRouter);
app.use('/api/user', userRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=app.js.map