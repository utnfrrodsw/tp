import { Usuario } from '../entities/usuario.entity';
export const getUsuarios = async (req, res) => {
    const orm = req.app.get('orm');
    const usuarios = await orm.em.find(Usuario, {});
    res.json(usuarios);
};
export const getUsuarioById = async (req, res) => {
    const orm = req.app.get('orm');
    const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
    if (!usuario)
        return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
};
export const createUsuario = async (req, res) => {
    const orm = req.app.get('orm');
    const nuevoUsuario = orm.em.create(Usuario, req.body);
    await orm.em.persistAndFlush(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
};
export const updateUsuario = async (req, res) => {
    const orm = req.app.get('orm');
    const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
    if (!usuario)
        return res.status(404).json({ error: 'Usuario no encontrado' });
    orm.em.assign(usuario, req.body);
    await orm.em.flush();
    res.json(usuario);
};
export const deleteUsuario = async (req, res) => {
    const orm = req.app.get('orm');
    const usuario = await orm.em.findOne(Usuario, { id: parseInt(req.params.id) });
    if (!usuario)
        return res.status(404).json({ error: 'Usuario no encontrado' });
    await orm.em.removeAndFlush(usuario);
    res.json({ mensaje: 'Usuario eliminado' });
};
