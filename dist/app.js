import express from 'express';
import { animal } from './animal.js';
const app = express();
app.use(express.json());
//midleware--> pequeños fragmentos de codigo en express que podemos incluir en 
//nuestra cadena de codigo para la resolucion de una request 
//estos van de a parte agregando, quitando y modificando la info de acuerdo a lo que sea necessario
//animal--> /api/animal/
const animales = [
    new animal('juan', 12 / 3 / 20, 12 / 3 / 20)
];
app.get('/api/animal', (req, res) => {
    res.json(animales);
});
app.get('/api/animal/:id', (req, res) => {
    const animal = animales.find((animal) => animal.id === req.params.id);
    if (!animal) {
        res.status(404).send({ message: 'ID incorrecto, no existe ningun animal con ese ID' });
    }
    res.json;
    {
        animal;
    }
});
app.post('/api/animal', (req, res) => {
    const { nombre, fechaRescate, fechaNacimientoEStimativa } = req.body;
    const animales2 = new animal(nombre, fechaRescate, fechaNacimientoEStimativa);
    animales.push(animales2);
    res.status(201).send({ message: 'animal agregado correctamente', data: animal });
});
app.listen(3000, () => {
    console.log('server running on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map