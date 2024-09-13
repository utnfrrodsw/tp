import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {
  private apiUrl = 'http://localhost:3000/localidades';

  constructor(private http: HttpClient) {}

  getLocalidadesByProvincia(idProvincia: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?provincia=${idProvincia}`);
  }

  searchLocalidades(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?nombre_like=${nombre}`);
  }
}
