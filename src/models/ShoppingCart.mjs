import { mongoose } from 'mongoose';

const CartSchema = new mongoose.Schema({
    comprador: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    fPago: { type: Date, default: Date.now },
    productos: [{ producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, cantidad: Number, precio: Number }] //id,cant,precio
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;