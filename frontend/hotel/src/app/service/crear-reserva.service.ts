import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrearReservaService {
  private apiUrl = 'http://localhost:3000/estadias/reservar-habitacion'; 

  constructor(private http: HttpClient) {}

  reservarHabitacion(reservaData: any): Observable<any> {
    
    const token = localStorage.getItem('authToken');

    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('Token de autenticación:', token);

    return this.http.post<any>(this.apiUrl, reservaData, { headers: headers }).pipe(
      catchError(error => {
        console.error('Error en la solicitud de reserva:', error);
        return throwError('Error al reservar la habitación');
      })
    );
  }
}
