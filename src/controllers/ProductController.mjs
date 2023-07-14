import ProductModel from '../models/ProductModel.mjs'
import userModel from '../models/UserModel.mjs'
import shopModel from '../models/ShopModel.mjs'
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
            //busca idvendedor
            const userId = req.userID;
            console.log(userId)
            // Verificar si el usuario existe
            const user = await userModel.findById(userId);
            if (!user) {
            return res.status(404).json({
                message: 'El usuario no existe'
            });
            }
            //Creacion de producto
            const {
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
                tienda: user.tienda,
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
        const { categoria, orden } = req.query;

        let filters = {
            habilitado: true
        };

        // Agregar filtro por categoría si se proporciona
        if (categoria) {
            filters.categoria = categoria;
        }

        // Buscar productos y aplicar filtros y ordenamiento
        let query = ProductModel.find(filters, req.query.fields);

        // Ordenar productos según la dirección especificada (ascendente o descendente)
        if (orden === 'asc') {
            query = query.sort({ precio: 1 });
        } else if (orden === 'desc') {
            query = query.sort({ precio: -1 });
        }

        let products = await query.exec();

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

export const getAllByShop = async (req, res) => {
    try {
        const { tiendaId } = req.params;

        // Buscar la tienda por su ID
        const tienda = await shopModel.findById(tiendaId).exec();

        if (!tienda) {
            return res.status(404).json({
                error: 'No se encontró la tienda'
            });
        }

        // Filtrar productos por la tienda
        const products = await ProductModel.find({ tienda: tiendaId }, req.query.fields).exec();

        res.status(200).json({
            data:products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener Productos'
        });
    }
};