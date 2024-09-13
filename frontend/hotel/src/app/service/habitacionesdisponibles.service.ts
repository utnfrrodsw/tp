import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesDisponiblesService {
  private apiUrl = 'http://localhost:3000/habitaciones/disponibles';

  constructor(private http: HttpClient) {}

  getHabitacionesDisponibles(checkin: string, checkout: string, people: string, idLocalidad: number): Observable<any[]> {
    const url = `${this.apiUrl}/${checkin}/${checkout}/${people}/${idLocalidad}`;
    return this.http.get<any[]>(url).pipe(
      catchError(error => {
        console.error('Error en la solicitud de habitaciones:', error);
        return throwError('Error al obtener las habitaciones disponibles');
      })
    );
  }
}
