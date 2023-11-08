import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Autor {
  id: string;
  nombreCompleto: string;
  perfil: string;
  info: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutoresService {
  private apiUrl = 'http://localhost:3000/api/autores';

  constructor(private http: HttpClient) { }

  getAutoresIds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/autores`).pipe(
      map((response: any) => response.data)
    );
  }

  getNombreCompleto(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/nombre-completo/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getPerfil(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/perfil/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getAutor(id: string): Observable<Autor | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data)
    );
  }
}