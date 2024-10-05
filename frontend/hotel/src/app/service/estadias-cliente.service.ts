import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadiasClienteService {
  private apiUrl = 'http://localhost:3000/estadias/cliente';  
  private api = 'http://localhost:3000/estadias';

  constructor(private http: HttpClient) {}

  // Obtener headers con el token de autorización
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('Token no encontrado en localStorage');
    }
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
  }

  // Método para obtener estadías del cliente usando el idCli almacenado en el localStorage
  getEstadiasPorCliente(): Observable<any> {
    const headers = this.getHeaders();
    const idCli = localStorage.getItem('idCliente');  // Recuperar el idCli del localStorage
    if (!idCli) {
      console.error('ID del cliente no encontrado en localStorage');
      return new Observable(observer => observer.error('ID del cliente no encontrado'));
    }
    return this.http.get(`${this.apiUrl}/${idCli}`, { headers });
  }


  cancelarReserva(idEst: number): Observable<any> {
    const body = { estado: 'Cancelado' };
    return this.http.put(`${this.api}/${idEst}`, body, { headers: this.getHeaders() })
      .pipe(
        catchError((error: any) => {
          console.error('Error al cancelar la reserva', error);
          return throwError(error);
        })
      );
}

}
