import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  private apiUrl = environment.apiUrlProvincias;

  constructor(private http: HttpClient) { }

  getProvincias(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (!response || !response.data) {
          throw new Error('Respuesta inválida del servidor.');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error al obtener provincias:', error);
        throw error;
      })
    );
  }

  getProvinciaByDescripcion(descripcion: string): Observable<any> {
    // Codificar la descripción antes de incluirla en la URL
    const encodedDescripcion = encodeURIComponent(descripcion);
    const url = `${this.apiUrl}/get-descripcion/${encodedDescripcion}`;
    return this.http.get(url);
  }

  getDescripcion(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-descripcion/${id}`);
  }

  registrarProvincia(provincia: any): Observable<any> {
    return this.http.post(this.apiUrl, provincia);
  }

  actualizarProvincia(id: string, provincia: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, provincia);
  }

  eliminarProvincia(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}