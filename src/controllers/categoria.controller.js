import { Categoria } from '../entities/categoria.entity';
export const getCategorias = async (req, res) => {
    const orm = req.app.get('orm');
    const categorias = await orm.em.find(Categoria, {});
    res.json(categorias);
};
