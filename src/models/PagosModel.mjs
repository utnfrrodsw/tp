import { mongoose } from 'mongoose';
const pagosSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orden: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    metodoPago: { type: String, required: true },
    cantidad: { type: Number, required: true },
    dia: { type: Date, default: Date.now }
  },{
    timestamps:true,
    versionKey:false
});

const Pagos = mongoose.model('Pagos', pagosSchema);

export default Pagos ;