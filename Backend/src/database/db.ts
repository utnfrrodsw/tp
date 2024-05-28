import mongoose from 'mongoose'


export const connectDB = async() =>{
    if(!process.env.MONGODB_URL){
        throw new Error("No se encuntra el archivo MONGODB_URL");
    }
   await mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('BD conectado!'))
    .catch(err => console.log('Error de conexión:', err));
}

