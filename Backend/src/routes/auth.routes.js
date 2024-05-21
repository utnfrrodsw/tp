import { Router } from "express";
import {login, register} from "../controllers/auth.controller.js"
const ruta = Router()

ruta.post('/register', register)
ruta.post('/login', login)


export default ruta