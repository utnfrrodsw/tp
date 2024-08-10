import express from "express";
import { userRouter } from "./user/user.routes.js";
import { eventoRouter } from "./event/event.routes.js";
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors());

app.use("/api/users", userRouter)
app.use("/api/evento", eventoRouter)

app.use((req, res) => {
    res.status(404).send({ message: "Resource not found" })
})

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000/")
})