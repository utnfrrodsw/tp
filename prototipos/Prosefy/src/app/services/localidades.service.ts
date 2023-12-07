import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

  private apiUrlLocalidades = environment.apiUrlLocalidades;

  constructor(private http: HttpClient) { }

  getLocalidadesByProvincia(provinciaId: string): Observable<any> {
    const url = `${this.apiUrlLocalidades}/localidades`;
    const body = { provincia: provinciaId };

    return this.http.post(url, body);
  }
}
