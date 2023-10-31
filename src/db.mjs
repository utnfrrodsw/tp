import mongoose from 'mongoose'
export const dbConnect = async () => {
  try {
    const DB_URI = process.env.DB_URI;
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });


    console.log('Conexión a la base de datos establecida');
  } catch (error) {
    console.log(`Error de conexión a la base de datos: ${error.message}`);
  }
};

const conn = mongoose.connection;

conn.on('error', () => console.error.bind(console, 'connection error'));

conn.once('open', () => console.info('Connection to Database is successful'));

export default conn;
/* export default dbConnect; */