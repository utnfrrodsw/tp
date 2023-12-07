import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {

  private apiUrlProvincias = environment.apiUrlProvincias;

  constructor(private http: HttpClient) { }

  getProvincias(): Observable<any> {
    const url = `${this.apiUrlProvincias}/provincias`;

    return this.http.get(url);
  }

  getProvinciaByDescripcion(descripcion: string): Observable<any> {
    // Codificar la descripción antes de incluirla en la URL
    const encodedDescripcion = encodeURIComponent(descripcion);
    const url = `${this.apiUrlProvincias}/get-descripcion/${encodedDescripcion}`;
    return this.http.get(url);
  }
}