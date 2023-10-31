import Product from "../models/ProductModel.mjs";
import Cart from "../models/ShoppingCart.mjs";
import conn from "../db.mjs";

class ReqError extends Error {
    constructor(message, httpCode = 500, ...args) {
        super(...args);
        this.httpCode = httpCode;
        this.message = message;
    }
}

export const saveCart = async (req, res) => {
    const session = await conn.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    try {
        const { comprador, productos } = req.body;
        //console.log({ comprador, productos });
        if (!comprador || !productos) {
            throw new ReqError('Solicitud incorrecta, no es posible registrar compra', 400);
        }
        session.startTransaction(transactionOptions);
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
            await prod.save({ session });
        }
        //const Compra = new Cart({ comprador, productos });
        //await Compra.save({ session });
        Cart.create([{ comprador, productos }], session);
        await session.commitTransaction();
        res.status(201).json({ message: "Compra registrada" });
    } catch (error) {
        await session.abortTransaction();
        if (!(error instanceof ReqError)) {
            error.httpCode = 500;
            error.message = "Error al procesar la compra";
        }
        res.status(error.httpCode).json({
            message: error.message
        });
    } finally {
        await session.endSession();
    }
};