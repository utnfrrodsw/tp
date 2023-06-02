import { mongoose } from 'mongoose';
const orderSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productos: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  total: { type: Number, required: true },
  direccion: { type: String, required: true },
  estado: { type: String, enum: ['Pendiente', 'Enviado', 'Entregado'], default: 'Pendiente' }
  },{
    timestamps:true,
    versionKey:false
});

const Orden = mongoose.model('Order', orderSchema);

export default Orden ;