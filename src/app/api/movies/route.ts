// archivo routes recibe las peticiones, invoca los controladores pasando parametro o no. No hace calculos.
import { MovieController } from "@/backend/controllers/movieController"
import { NextResponse } from "next/server"




// GET /api/movies - Obtener todas las películas
export async function GET(request: Request) {
  return MovieController.getAllMovies()
}  

  

