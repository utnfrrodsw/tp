// Tiene los metodos para manejar las peticiones de la API y la logica del negocio. Valida parametros.
import { NextResponse } from 'next/server';
import { MovieDAO } from '../dao/MovieDao';



export class MovieController {

  
  static async getAllMovies() {
    try {
      const movies = await MovieDAO.getAll();
      return NextResponse.json(movies);
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }

}