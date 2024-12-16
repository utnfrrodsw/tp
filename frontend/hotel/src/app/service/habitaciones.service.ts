import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  private urlApi = 'http://localhost:3000/habitaciones';

  constructor(private http: HttpClient) { }

 
  public getData(): Observable<any[]> {  
    return this.http.get<any[]>(this.urlApi);
  }

  
  updateHabitacion(id: number, habitacionData: any): Observable<any> {
    const empleadoToken = localStorage.getItem('empleadoToken'); 

    if (!empleadoToken) {
      throw new Error('No se encontró el token de empleado en el localStorage');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${empleadoToken}`);

    return this.http.put<any>(`${this.urlApi}/${id}`, habitacionData, { headers });
  }


  createHabitacion(habitacionData: any): Observable<any> {
    const empleadoToken = localStorage.getItem('empleadoToken'); 

    if (!empleadoToken) {
      throw new Error('No se encontró el token de empleado en el localStorage');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${empleadoToken}`);

    return this.http.post<any>(this.urlApi, habitacionData, { headers });
  }


  deleteHabitacion(id: number): Observable<any> {
    const empleadoToken = localStorage.getItem('empleadoToken'); 

    if (!empleadoToken) {
      throw new Error('No se encontró el token de empleado en el localStorage');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${empleadoToken}`);

    return this.http.delete<any>(`${this.urlApi}/${id}`, { headers });
  }

 


}
