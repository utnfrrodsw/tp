import app from "./app.js";
import {connectDB} from "./db.js"

const PORT = 3000
connectDB()
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
})