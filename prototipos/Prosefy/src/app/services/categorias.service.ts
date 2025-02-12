import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

export interface Categoria {
  _id: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl: string = environment.apiUrlCategorias;

  constructor(private http: HttpClient) { }

  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  getCategoria(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getDescripcion(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/descripcion/${id}`);
  }

  obtenerDescripcionesCategoria(): Observable<any> {
    return this.http.get(`${this.apiUrl}/descripciones`);
  }

  registrarCategoria(categoria: any): Observable<any> {
    return this.http.post(this.apiUrl, categoria);
  }

  actualizarCategoria(id: string, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }

  eliminarCategoria(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}