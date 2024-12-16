import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TiposHabitacionService {
  private apiUrl = 'http://localhost:3000/tiposHabitacion';

  constructor(private http: HttpClient) {}

  getTiposHabitacion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error en la solicitud de tipos de habitación:', error);
        return throwError('Error al obtener los tipos de habitación');
      })
    );
  }
}
