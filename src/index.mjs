import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnect } from "./db.mjs";
dotenv.config();
//import rutas
import routerUser from './routes/UserRouter.mjs'
import routerCategory from './routes/ProductCatRouter.mjs'
import routerShop from './routes/ShopRouter.mjs'
import routerProduct from './routes/ProductRouter.mjs'

//Configuracion
const app = express();
app.use(cors());
app.use(express.json());
//Configuracion de archivos estaticos
app.use("/uploads", express.static("src/uploads"));

//Rutas
app.use('/api', routerUser);
app.use('/api', routerCategory);
app.use('/api', routerShop);
app.use('/api', routerProduct);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
dbConnect();
