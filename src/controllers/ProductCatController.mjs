import categoryModel from '../models/ProductCatModel.mjs'


export const createCategory = async (req, res) => {
    const {
        descripcion
    } = req.body;
    try {
        // Creacion de categoria
        const category = new categoryModel({
            descripcion
        });
        await category.save();


        res.status(201).json({
            message: 'Categoria creada',

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al crear categoria'
        });
    }
};
export const getByID = async (req, res) => {
    const categoriaId = req.params.id; // Obtener el id del departamento
    try {
        // Busca departamento por Id
        const categoria = await categoryModel.findById(categoriaId)
            .sort({
                createdAt: -1
            });
        if (!categoria) {
            return res.status(404).json({
                error: 'Categoria no encontrada'
            });
        }
        res.status(200).json({
            data: categoria
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener categoria'
        });
    }
};

export const getAll = async (req, res) => {
    try {

        let categorias = await categoryModel.find()
            .sort({
                createdAt: -1
            })
            .exec();
        res.status(200).json({
            data: categorias
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener categorias'
        });
    }
};

export const UpdateCategory = async (req, res) => {
    try {
        const categoriaId = req.params.id;
        const updateData = req.body;
        // Verificar si la categoria existe
        const categoria = await categoryModel.findById(categoriaId);
        if (!categoria) {
            return res.status(404).json({
                message: 'La categoria no existe'
            });
        }

        // Actualizar categoria
        const categoriaUpdate = await categoryModel.findByIdAndUpdate(categoriaId, updateData, {
            new: true
        });

        res.status(200).json({
            message: 'Categoria actualizada',
            data: categoriaUpdate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al actualizar la categoria'
        });
    }
}

export const deleteById = async (req, res) => {
    const id = req.params.id; // Obtener el id del registro a eliminar
    try {
        const result = await categoryModel.deleteOne({
            _id: id
        }); // Eliminar el registro
        res.status(200).json({
            message: "Categoria eliminada"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar la categoria"
        });
    }
};

/* export default {
    createCategory,
    getByID,
    getAll,
    UpdateCategory,
    deleteById
} */