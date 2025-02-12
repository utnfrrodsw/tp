import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormatosService {

  private apiUrl = environment.apiUrlFormatos;

  constructor(private http: HttpClient) { }

  getFormatos(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (!response || !response.data) {
          throw new Error('Respuesta inválida del servidor.');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error al obtener formatos:', error);
        throw error;
      })
    );
  }

  getFormatoByDescripcion(descripcion: string): Observable<any> {
    // Codificar la descripción antes de incluirla en la URL
    const encodedDescripcion = encodeURIComponent(descripcion);
    const url = `${this.apiUrl}/get-descripcion/${encodedDescripcion}`;
    return this.http.get(url);
  }

  getDescripcion(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-descripcion/${id}`);
  }

  registrarFormato(formato: any): Observable<any> {
    return this.http.post(this.apiUrl, formato);
  }

  actualizarFormato(id: string, formato: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formato);
  }

  eliminarFormato(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
