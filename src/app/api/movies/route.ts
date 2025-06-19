// archivo routes recibe las peticiones, invoca los controladores pasando parametro o no. No hace calculos.
import { MovieController } from "@/backend/controllers/movieController"
import { Movie } from "@/backend/models/Movie";
import { NextResponse } from "next/server"




//Read del CRUD
// GET /api/movies - Obtener todas las películas
export async function GET(request: Request) {
  return MovieController.getAllMovies()
}  


// POST /api/movies - Crear una pelicula
export async function POST(request: Request) {
  const { title, director, year, genre } = await request.json();
        console.log( title, director, year, genre);
        const movieData: Movie = {
          id: 0, // Assuming the ID is auto-generated
          title,
          director,
          year,
          genre,
        };
  return MovieController.createMovie(movieData)
}






