import { mongoose } from 'mongoose';

const carritoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      cantidad: { type: Number, required: true, default: 1 }
    }
  ]
},{
    timestamps:true,
    versionKey:false
});

const Carrito = mongoose.model('Carrito', carritoSchema);

export default Carrito ;