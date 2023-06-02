import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db.js";
dotenv.config();
//import rutas
import routerUser from './routes/UserRouter.js'
import routerCategory from './routes/ProductCatRouter.js'

//Configuracion
const app = express();
app.use(cors());
app.use(express.json());
//Configuracion de archivos estaticos
app.use("/uploads", express.static("src/uploads"));

//Rutas
app.use('/api', routerUser);
app.use('/api', routerCategory);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
dbConnect();
