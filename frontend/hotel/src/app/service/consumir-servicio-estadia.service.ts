import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsumirServicioEstadiaService {
  private apiUrl = 'http://localhost:3000/estadiaServicio'; 

  constructor(private http: HttpClient) { }

  inscribirse(idServicio: number, idEstadia: number): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = {
      idServicio: idServicio,
      idEstadia: idEstadia
    };
    return this.http.post(this.apiUrl, body, { headers });
  }
}
