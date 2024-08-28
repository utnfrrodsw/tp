import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoute from "./routers/user.routes"
import userEvent from "./routers/event.routes"

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/user", userRoute)
app.use("/api/event", userEvent)

export default app;