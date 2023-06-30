import { mongoose } from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: false
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user', 'seller'],
    default: 'user'
  },

}, {
  timestamps: true,
  versionKey: false
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;