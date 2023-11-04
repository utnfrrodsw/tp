import { LibroRepository } from "./Libro.repository.js";
import { Libro } from "./Libro.js";
const repository = new LibroRepository();
async function sanitizeInput(req, res, next) {
    req.body.sanitizedInput = {
        id: req.body.id,
        isbn: req.body.isbn,
        titulo: req.body.titulo,
        idioma: req.body.idioma,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        fecha_edicion: req.body.fecha_edicion,
        autores: req.body.autores,
        editorial: req.body.editorial,
        categorias: req.body.categorias,
        formatos: req.body.formatos,
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
    const libro = await repository.findOne({ id });
    if (!libro) {
        return res.status(404).send({ message: "no funciona" });
    }
    return res.json({ data: libro });
}
async function add(req, res) {
    //console.log(req.body.sanitizedInput)
    const input = req.body.sanitizedInput;
    const libroInput = new Libro(input.id, input.isbn, input.titulo, input.idioma, input.descripcion, input.precio, input.fecha_edicion, input.autores, input.editorial, input.categorias, input.formatos);
    const libro = await repository.add(libroInput);
    res.status(201).send({ message: '...', data: libro });
}
async function update(req, res) {
    const libro = await repository.update(req.params.id, req.body.sanitizedInput);
    if (!libro) {
        return res.status(404).send({ message: "no funciona" });
    }
    return res.status(200).send({ message: '...', data: libro });
}
async function remove(req, res) {
    const id = req.params.id;
    const libro = await repository.delete({ id });
    if (!libro) {
        res.status(404).send({ message: "no funciona" });
    }
    res.status(204).send({ message: 'Borrado' });
}
export { sanitizeInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=Libro.controler.js.map