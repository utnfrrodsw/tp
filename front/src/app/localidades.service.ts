import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {
  
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getLocalidades() {
    const url = this.baseUrl + 'localidades';
    return this.http.get<any>(url);
  }
}