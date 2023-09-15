import { categoriaRepository } from "./categoria.repository.js";
import { Categoria } from "./categoria.entity.js";
const repository = new categoriaRepository();
//satinizacion de datos
function sanitizeCategoriaInput(req, res, next) {
    req.body.sanitizedInput = {
        IdCategoria: req.body.IdCategoria,
        NombreCategoria: req.body.NombreCategoria,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] == undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
//GET
function findAll(req, res) {
    res.json({ data: repository.findAll() });
}
;
//Get X id
function findOne(req, res) {
    const categoriaEncontrada = repository.findOne({ id: req.params.id });
    if (!categoriaEncontrada) {
        res.status(404).send({ message: 'Categoria no encontrada' });
    }
    res.json({ data: categoriaEncontrada });
}
;
//Post
function add(req, res) {
    const input = req.body.sanitizedInput;
    const categoriaNueva = new Categoria(input.IdCategoria, input.NombreCategoria);
    const categoria = repository.add(categoriaNueva);
    res.status(201).send({ message: 'Categoria creada', data: Categoria });
}
;
//Put actualizar una categoria completa
function update(req, res) {
    req.body.sanitizedInput.IdCategoria = req.params.id;
    const categoria = repository.update(req.body.sanitizedInput);
    if (!categoria) {
        return res.status(404).send({ message: 'Categoria no encontrada' });
    }
    return res.status(200).send({ message: 'Categoria actualizada', data: categoria });
}
;
//Delete eliminar una categoria
function remove(req, res) {
    const categoriaID = repository.delete({ id: req.params.id });
    if (!categoriaID) {
        res.status(404).send({ message: 'Categoria no encontrada' });
    }
    else {
        res.status(200).send({ message: 'Categoria eliminada' });
    }
}
;
export { sanitizeCategoriaInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=categoria.controler.js.map