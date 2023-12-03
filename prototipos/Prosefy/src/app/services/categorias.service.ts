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

  getCategorias() {
    return this.http.get<Categoria[]>(`${this.apiUrl}/descripciones`);
  }

  getDescripcion(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/descripcion/${id}`).pipe(
      map((response: any) => response.data)
    );
  }
}
