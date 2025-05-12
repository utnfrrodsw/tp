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
    //query select
    return [...moviesDB]; // Devolvemos copia del array
  }

  static async create(movie: Omit<Movie, 'id'>): Promise<Movie> {
    const newMovie = { 
      ...movie, 
      id: moviesDB.length > 0 ? Math.max(...moviesDB.map(m => m.id)) + 1 : 1 
    };
    moviesDB.push(newMovie);
    return newMovie;
  }

  static async getById(id: number): Promise<Movie | null> {
    const movie = moviesDB.find(m => m.id === id);
    return movie || null;
  }

}



