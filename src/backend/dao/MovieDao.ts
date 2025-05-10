// Accede a la BD. Hace los Query
import { Movie } from "../models/Movie";


// "Base de datos" en memoria
const moviesDB: Movie[] = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genre: ["Sci-Fi", "Action"]
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genre: ["Drama"]
  }
];




export class MovieDAO {

  
  static async getAll(): Promise<Movie[]> {
    //query
    return [...moviesDB]; // Devolvemos copia del array
  }
}

