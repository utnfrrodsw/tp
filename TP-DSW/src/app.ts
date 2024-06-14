import express from 'express';

const app = express();
app.use(express.json());

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
