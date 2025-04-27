import { Libro } from '../entities/libro.entity';
export const getLibros = async (req, res) => {
    const orm = req.app.get('orm');
    const libros = await orm.em.find(Libro, {});
    res.json(libros);
};
export const getLibroById = async (req, res) => {
    const orm = req.app.get('orm');
    const libro = await orm.em.findOne(Libro, { id: parseInt(req.params.id) });
    if (!libro)
        return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(libro);
};
export const createLibro = async (req, res) => {
    const orm = req.app.get('orm');
    const nuevoLibro = orm.em.create(Libro, req.body);
    await orm.em.persistAndFlush(nuevoLibro);
    res.status(201).json(nuevoLibro);
};
export const updateLibro = async (req, res) => {
    const orm = req.app.get('orm');
    const libro = await orm.em.findOne(Libro, { id: parseInt(req.params.id) });
    if (!libro)
        return res.status(404).json({ error: 'Libro no encontrado' });
    orm.em.assign(libro, req.body);
    await orm.em.flush();
    res.json(libro);
};
export const deleteLibro = async (req, res) => {
    const orm = req.app.get('orm');
    const libro = await orm.em.findOne(Libro, { id: parseInt(req.params.id) });
    if (!libro)
        return res.status(404).json({ error: 'Libro no encontrado' });
    await orm.em.removeAndFlush(libro);
    res.json({ mensaje: 'Libro eliminado' });
};
