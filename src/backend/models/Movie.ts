export interface Movie {
    id: number;
    title: string;
    director: string;
    year: number;
    genre: string[];
  }
  
  export type MovieCreate = Omit<Movie, 'id'>;
  export type MovieUpdate = Partial<MovieCreate>;