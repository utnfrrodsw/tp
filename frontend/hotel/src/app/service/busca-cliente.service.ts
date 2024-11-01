import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaClienteService {
  private apiUrl = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no encontrado en localStorage');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private getHeadersEmpleado(): HttpHeaders {
    const token = localStorage.getItem('empleadoToken');
    if (!token) {
      console.error('Token no encontrado en localStorage');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }); 
  }

  
  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id=${id}`, { headers: this.getHeaders() });
  }

  obtenerClientes(): Observable<any> { 
    return this.http.get<any>(this.apiUrl,{ headers: this.getHeadersEmpleado() }); 
  }

}
