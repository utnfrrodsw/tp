import { mongoose } from 'mongoose';

const ShopSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    about: { type: String, required: true },
    shopAdress: { type: String, required: true },
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Shop = mongoose.model('Shop', ShopSchema);

export default Shop;