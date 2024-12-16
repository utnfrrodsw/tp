import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = 'http://localhost:3000/clientes'; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) {}

  crearCliente(clienteData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, clienteData);
  }
}
