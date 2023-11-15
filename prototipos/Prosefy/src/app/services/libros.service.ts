import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Libro {
  id: number;
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
  private apiUrl = 'http://localhost:3000/api/libros';

  constructor(private http: HttpClient) { }

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
        return throwError(error); // Puedes devolver un valor por defecto aquí si lo prefieres
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