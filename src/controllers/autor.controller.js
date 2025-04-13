import { Autor } from '../entities/autor.entity';
export const getAutores = async (req, res) => {
    const orm = req.app.get('orm');
    const autores = await orm.em.find(Autor, {});
    res.json(autores);
};
