import { mongoose } from 'mongoose';

const CartSchema = new mongoose.Schema({
    comprador: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    fPago: { type: Date, default: Date.now },
    productos: [{ productos: mongoose.Schema.Types.ObjectId, cantidad: Number, precio: Number }] //id,cant,precio
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;