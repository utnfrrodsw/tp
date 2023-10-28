import { CategoriaRepository } from "./Categoria.repository.js";
import { Categoria } from "./Categoria.js";
const repository = new CategoriaRepository();
async function sanitizeInput(req, res, next) {
    req.body.sanitizedInput = {
        id: req.body.id,
        descripcion: req.body.descripcion,
    };
    Object.keys(req.body.sanitizedInput).forEach(key => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    res.json({ data: await repository.findAll() });
}
async function findOne(req, res) {
    const id = req.params.id;
    const categoria = await repository.findOne({ id });
    if (!categoria) {
        return res.status(404).send({ message: "no funciona" });
    }
    return res.json({ data: categoria });
}
async function add(req, res) {
    //console.log(req.body.sanitizedInput)
    const input = req.body.sanitizedInput;
    const categoriaInput = new Categoria(input.id, input.descripcion);
    const categoria = await repository.add(categoriaInput);
    res.status(201).send({ message: '...', data: categoria });
}
async function update(req, res) {
    const categoria = await repository.update(req.params.id, req.body.sanitizedInput);
    if (!categoria) {
        return res.status(404).send({ message: "no funciona" });
    }
    return res.status(200).send({ message: '...', data: categoria });
}
async function remove(req, res) {
    const id = req.params.id;
    const categoria = await repository.delete({ id });
    if (!categoria) {
        res.status(404).send({ message: "no funciona" });
    }
    res.status(204).send({ message: 'Borrado' });
}
export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Categoria.controler.js.map