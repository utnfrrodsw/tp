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
import routerReview from './routes/ReviewRouter.mjs'
import routerCart from "./routes/ShoppingCartRouter.mjs";

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
app.use('/api', routerReview);
app.use('/api', routerCart);


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
dbConnect();


export default app;