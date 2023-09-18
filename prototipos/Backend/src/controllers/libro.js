// Importar lm y otras dependencias
const lm = require("../models/libro");
const { validationResult } = require("express-validator");
const { handleError, response, sanitizeInputParams } = require("../utils/helpers");
const { isValidID } = require("../utils/validators");

class LibroController {

    async getLibros(req, res) {
	    try {
		    const libros = await lm.getLibros();
		    if (!libros) {
			    return res
                    .status(404)
                    .json(response(false, null, "No existen libros"));
		    }
		    res.json(response(true, libros));
	    } catch (error) {
            console.log(error);
		    handleError(res, error.toString());
	    }
    }

    async getLibro(req, res) {
	    const id = req.params.id;
        if (!isValidID(id)) {
            return res.status(400)
                .json(response(false, null, "ID inválido"));
        }
	    try {
		    const libro = await lm.getLibro(id);
		    if (!libro) {
			    res.status(404).json({
			        success: false,
				    msg: "No existe el libro",
			    });
			    return;
		    }
		    res.json(response(true, libro));
	    } catch (error) {
            console.log(error);
            handleError(res, error);
	    }
    }

    async createLibro(req, res) {
        const errors = validationResult(req);
	    if (!errors.isEmpty()) {
		    return res
			    .status(400)
			    .json(response(false, null, "Datos de entrada inválidos"));
	    }

        const {
            isbn,
            titulo,
            id_editorial,
            idioma,
            descripcion,
            precio,
            fecha
        } = req.body;

        const toCreate = sanitizeInputParams({
            isbn,
            titulo,
            id_editorial,
            idioma,
            descripcion,
            precio,
            fecha
        });

	    try {
		    const id = await lm.create(toCreate);
		    res.json(response(true, null, `Libro ${id} creado con éxito`));
	    } catch (error) {
            console.log(error);
		    handleError(res, "Error al crear el libro");
	    }
    }

    async updateLibro(req, res) {
		const id = req.params.id;
        if (!isValidID(id)) {
            return res
                .status(400)
                .json(response(false, null, "ID inválido"));
        }

        const {
            isbn,
            titulo,
            id_editorial,
            idioma,
            descripcion,
            precio,
            fecha
        } = req.body;

        const toUpdate = sanitizeInputParams({
            isbn,
            titulo,
            id_editorial,
            idioma,
            descripcion,
            precio,
            fecha
        });

		try {
			const result = await lm.update(id, toUpdate);

            if (result === null) {
 				return res
                    .status(400)
                    .json(response(false, null, "No hay campos para actualizar")); 
            }

			if (result === 0) {
				return res
                    .status(404)
                    .json(response(false, null, "No existe el libro indicado"));
			}
			res.json(response(true, null, "Libro actualizado con éxito"));
		} catch (error) {
			handleError(res, error.toString());
		}
    }

    async deleteLibro(req, res) {
        const id = req.params.id;
        if (!isValidID(id)) {
            return res
                .status(400)
                .json(response(false, null, "ID inválido"));
        }
		try {
			const result = await lm.delete(id);
			if (!result) {
				return res.status(404).json(
					response(false, null, "No existe el libro indicado")
				);
			}
			res.json(response(true, null, "Libro borrado con éxito"));
		} catch (error) {
            console.log(error);
			handleError(res, "Error al borrar el libro");
		}
    }

}

module.exports = new LibroController();
