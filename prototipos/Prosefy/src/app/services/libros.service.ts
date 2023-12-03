import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { AutoresService } from '../services/autores.service';
import { CategoriasService } from './categorias.service';
import { environment } from 'src/environments/environment.development';
environment

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

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private apiUrl: string = environment.apiUrlLibros;

  constructor(private http: HttpClient, private autoresService: AutoresService, private categoriasService: CategoriasService) { }

  getLibrosIds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/libros`).pipe(
      map((response: any) => response.data)
    );
  }

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

  getLibro(id: string): Observable<Libro | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => {
        console.error('Error en la solicitud de getLibro', error);
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


  /* OTROS
  
    add(libro: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/`, libro);
    }
  
    update(id: string, libro: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}`, libro);
    }
  
    remove(id: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
    */
}