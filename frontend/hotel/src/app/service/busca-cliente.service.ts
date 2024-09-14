import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaClienteService {

  private apiUrl = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) {}

  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/id=${id}`);
  }
}
