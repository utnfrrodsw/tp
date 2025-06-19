// Tiene los metodos para manejar las peticiones de la API y la logica del negocio. Valida parametros.
import { NextResponse } from "next/server";
import { MovieDAO } from "../dao/MovieDao";
import { Movie } from "../models/Movie";

export class MovieController {
  static async getAllMovies() {
    try {
      const movies = await MovieDAO.getAll();
      return NextResponse.json(movies);
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  static async createMovie(movieData: Movie) {
    {
      try {
        
        const newMovie = await MovieDAO.create(movieData);
        return NextResponse.json(newMovie);
      } catch (error) {
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }
  }
}
