import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService {
  private apiUrl = 'http://localhost:3000/provincias';

  constructor(private http: HttpClient) {}

  getProvincias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
