import express from 'express';
import authRoutes from "./src/routes/auth"
import cors from "cors"

const PORT = 3000
const app = express();
app.use(express.json()) //convertir la req en formato JSON
app.use(cors())

app.use('/api',authRoutes)


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
