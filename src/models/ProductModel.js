import { mongoose } from 'mongoose';
const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  fotos: [{ type: String, required: false }],
  habilitado: { type: Boolean, default: true }
}, {
  timestamps: true,
  versionKey: false
});
const Product = mongoose.model('Product', productSchema);

export default Product;