import mongoose from 'mongoose'

const uri = "mongodb+srv://facundopicia:cYh1D99Cyr0QPSpZ@cluster0.aswzaot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

export const connectDB = async() =>{
   await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected!'))
    .catch(err => console.log('Database connection error:', err));
}

