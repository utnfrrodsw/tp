import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadiasClienteService {
  private apiUrl = 'http://localhost:3000/estadias/cliente';  
  private api = 'http://localhost:3000/estadias';

  constructor(private http: HttpClient) {}

  getEstadiasPorCliente(): Observable<any> {
    const idCli = localStorage.getItem('idCliente');
    const token = localStorage.getItem('authToken');
    if (!idCli || !token) {
      console.error('ID del cliente o token no encontrado en localStorage');
      return new Observable(observer => observer.error('ID del cliente o token no encontrado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/${idCli}`, { headers });
  }

  getAllEstadias(): Observable<any> {
    const empleadoToken = localStorage.getItem('empleadoToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${empleadoToken}`
    });

    return this.http.get(this.api, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error al obtener todas las estadías', error);
          return throwError(error);
        })
      );
  }

  cancelarReserva(idEst: number): Observable<any> {
    const body = { estado: 'Cancelado' };
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.put(`${this.api}/${idEst}`, body, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error al cancelar la reserva', error);
          return throwError(error);
        })
      );
  }

  checkinEstadia(idEstadia: number): Observable<any> {
    const token = localStorage.getItem('empleadoToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.api}/${idEstadia}/checkin`, {}, { headers }) 
      .pipe(
        catchError((error: any) => {
          console.error('Error al realizar check-in', error);
          return throwError(error);
        })
      );
}



}
