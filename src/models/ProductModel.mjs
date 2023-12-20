import { mongoose } from 'mongoose';
const productSchema = new mongoose.Schema({
  tienda: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  reseña: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: false }],
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