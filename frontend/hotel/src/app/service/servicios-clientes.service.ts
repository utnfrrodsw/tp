import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosClientesService {
  private apiUrl = 'http://localhost:3000/estadiaServicio';

  constructor(private http: HttpClient) { }

  obtenerServicios(): Observable<any> {
    const empleadoToken = localStorage.getItem('empleadoToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${empleadoToken}` 
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
