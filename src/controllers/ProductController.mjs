import ProductModel from '../models/ProductModel.mjs'
import {
    upload
} from '../middlewares/uploadImg.mjs'
import multer from 'multer';



export const createProduct = async (req, res) => {
    upload(req, res, async function (err) {
        /* console.log(req.body);
        console.log(req.files); */
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'ERRROr' });
        }
        else if (err) {
            return res.status(500).json({ error: 'Error al cargar imágenes' });
        }
        try {
            //Creacion de departamento
            const {
                tienda,
                categoria,
                nombre,
                descripcion,
                precio,
                stock,
            } = req.body;
            let fotos = [] //para crear departamentos sin imagenes
            if (req.files) {
                fotos = req.files.map(file => file.path.replace(/\\/g, '/')); // Obtén las rutas de las imágenes
            }
            const product = new ProductModel({
                tienda,
                categoria,
                nombre,
                descripcion,
                precio,
                stock,
                fotos
            });
            await product.save();
            res.status(201).json({
                message: 'Producto creado creado',
                product
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: 'Error al crear departamento'
            });
        }
    })
};

export const getAll = async (req, res) => {
    try {
        //Creacion de filtros
        let filters = {};
        // if (req.query.ciudad || req.query.provincia || req.query.pais) {
        //     filters = {
        //         'ciudad': req.query.ciudad,
        //         'provincia': req.query.provincia,
        //         'pais': req.query.pais,
        //     };
        // }
        //Busca Productos
        let products = await ProductModel.find(filters, req.query.fields).exec();
        res.status(200).json({
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener Productos'
        });
    }
};
