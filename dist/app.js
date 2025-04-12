import express from 'express';
import { deporteRouter } from './deporte/deporte.routes';
const app = express();
app.use(express.json());
app.use('/api/deportes', deporteRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log('Server runnning on http://localhost:27017/');
});
//# sourceMappingURL=app.js.map