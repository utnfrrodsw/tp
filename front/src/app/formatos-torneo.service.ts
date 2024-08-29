import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatosTorneoService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getFormatos() {
    const url = this.baseUrl + 'formatos_torneo';
    return this.http.get<any>(url);
  }
}
