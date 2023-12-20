import Product from "../models/ProductModel.mjs";
import Cart from "../models/ShoppingCart.mjs";

class ReqError extends Error {
    constructor(message, httpCode = 500, ...args) {
        super(...args);
        this.httpCode = httpCode;
        this.message = message;
    }
}
export const saveCart = async (req, res) => {
    const session = await Product.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };

    try {
        await session.withTransaction(async () => {
            const comprador = req.userID;
            const { productos } = req.body;
            //console.log({ comprador, productos });
            if (!comprador || !productos) {
                throw new ReqError('Solicitud incorrecta, no es posible registrar compra', 400);
            }
            for (const linea of productos) {
                if (!linea.producto) {
                    throw new ReqError('Solicitud incorrecta, no es posible registrar compra', 400);
                }
                let prod = await Product.findById(linea.producto);
                if (!prod) {
                    throw new ReqError('Solicitud incorrecta, no es posible registrar compra', 400);
                }
                prod.stock -= linea.cantidad;
                if (prod.stock < 0) {
                    throw new ReqError(`No es posible realizar la compra, no hay stock de ${prod.nombre}`, 409);
                }
                linea.precio = prod.precio;
                await prod.save();
            }
            Cart.create([{ comprador, productos }], session);
            res.status(201).json({ message: "Compra registrada" })

        }, transactionOptions)


    } catch (error) {
        //console.log(error)
        if (!(error instanceof ReqError)) {
            error.httpCode = 500;
            error.message = "Error al procesar la compra";
        }
        res.status(error.httpCode).json({

            message: error.message
        });
    }
};