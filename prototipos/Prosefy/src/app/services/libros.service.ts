import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { AutoresService } from '../services/autores.service';
import { CategoriasService } from './categorias.service';
import { environment } from 'src/environments/environment.development';
import { HttpHeaders } from '@angular/common/http';

export interface Libro {
  _id: string;
  isbn: string;
  titulo: string;
  idioma: string;
  descripcion: string;
  precio: number;
  fecha_edicion: Date;
  autores: string[];
  editorial: string;
  categorias: string[];
  formatos: string[];
  portada: string;
  calificacion: number;
}

export interface LibroInput {
  isbn: string;
  titulo: string;
  idioma: string;
  descripcion: string;
  precio: number;
  fecha_edicion: Date;
  autores: string[];
  editorial: string;
  categorias: string[];
  formatos: string[];
  portada: string;
  calificacion: number;
  _id?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private apiUrl: string = environment.apiUrlLibros;

  constructor(private http: HttpClient, private autoresService: AutoresService, private categoriasService: CategoriasService) { }

  findByEditorial(editorialId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/editoriales/${editorialId}`);
  }

  findByAutor(autorId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/autores/${autorId}`);
  }

  findByCategoria(categoriaId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias/${categoriaId}`);
  }

  findByFormatoLibro(formatoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/formatos/${formatoId}`);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  getLibrosIds(): Observable<any[]> {
    console.log(`Solicitando IDs de libros desde ${this.apiUrl}/libros`);
    return this.http.get(`${this.apiUrl}/libros`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => {
        console.error('Error al obtener IDs de libros:', error);
        return of([]);
      })
    );
  }

  getLibro(id: string): Observable<Libro | undefined> {
    return this.http.get<{ data: Libro }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(`Error al obtener libro con ID ${id}:`, error);
        return of(undefined);
      })
    );
  }

  getIsbn(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/isbn/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getTitulo(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/titulo/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getPortada(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/portada/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getAutores(id: string): Observable<string[] | undefined> {
    return this.http.get<any>(`${this.apiUrl}/getautores/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getEditorial(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/geteditorial/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getCategorias(id: string): Observable<string[] | undefined> {
    return this.http.get<any>(`${this.apiUrl}/getcategorias/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getPrecio(id: string): Observable<number | undefined> {
    return this.http.get<any>(`${this.apiUrl}/precio/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getDescripcion(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/descripcion/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getFechaEdicion(id: string): Observable<Date | undefined> {
    return this.http.get<any>(`${this.apiUrl}/fechaEdicion/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getNombresAutores(idsAutores: string[]): Observable<string[]> {
    const observables = idsAutores.map(id => this.autoresService.getNombreCompleto(id));

    return forkJoin(observables).pipe(
      filter((nombres): nombres is string[] => nombres.every(nombre => nombre !== undefined))
    );
  }

  getAutoresObservables(idsAutores: string[]): Observable<string> {
    const observables = idsAutores.map(id => this.autoresService.getNombreCompleto(id));
    return forkJoin(observables).pipe(
      filter((nombres): nombres is string[] => nombres.every(nombre => nombre !== undefined)),
      map(nombres => nombres.join(', '))
    );
  }

  getCategoriasObservables(idsCategorias: string[]): Observable<string> {
    const observables = idsCategorias.map(id => this.categoriasService.getDescripcion(id));
    return forkJoin(observables).pipe(
      filter((descripciones): descripciones is string[] => descripciones.every(descripcion => descripcion !== undefined)),
      map(descripciones => descripciones.join(', '))
    );
  }

  registrarLibro(libro: LibroInput): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    // Asegurarse de que los campos sean arrays
    libro.autores = Array.isArray(libro.autores) ? libro.autores : [libro.autores];
    libro.categorias = Array.isArray(libro.categorias) ? libro.categorias : [libro.categorias];
    libro.formatos = Array.isArray(libro.formatos) ? libro.formatos : [libro.formatos];

    return this.http.post(this.apiUrl, libro, httpOptions).pipe(
      catchError((error: any) => {
        console.error('Error al registrar el libro:', error);
        throw error;
      })
    );
  }

  actualizarLibro(id: string, libro: Libro): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, libro);
  }

  eliminarLibro(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}