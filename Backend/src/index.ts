import app from "./app.js";
import {connectDB} from "./database/db.js"
import cors from "cors"

//Solucionar problemas de cors
app.use(cors())

const PORT = process.env.PORT || 3000
connectDB()
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
})