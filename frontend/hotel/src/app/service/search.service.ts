import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiLocalidadesUrl = 'http://localhost:3000/localidades/nombre';

  constructor(private http: HttpClient) {}

  getLocalidadByName(name: string): Observable<any> {
    const encodedName = encodeURIComponent(name);
    return this.http.get<any>(`${this.apiLocalidadesUrl}/${encodedName}`).pipe(
      catchError(err => {
        console.error('Error fetching localidad:', err);
        throw err;
      })
    );
  }
}

