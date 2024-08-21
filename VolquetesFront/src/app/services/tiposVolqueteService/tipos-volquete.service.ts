import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TipoVolquete } from '../../model/interfaces/tipo_volquete.interface.js';
import { Observable, BehaviorSubject, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposVolqueteService {
  
  private apiUrl = 'http://localhost:3000/api/tipovolquetes';
  
  private http = inject(HttpClient); // Use inject() to get HttpClient
  
  private tiposVolqueteSubject = new BehaviorSubject<TipoVolquete[]>([]);
  tiposVolquete$ = this.tiposVolqueteSubject.asObservable();
  // tiposVolquete: TipoVolquete[]=[];
  
  constructor() {
    this.loadInitialData();
  }
  
  private loadInitialData() {
    this.getAll().subscribe(tiposVolquete => this.tiposVolqueteSubject.next(tiposVolquete));
  }
  
getAll(): Observable<TipoVolquete[]> {
  return this.http.get<TipoVolquete[]>(this.apiUrl).pipe(
    catchError(this.handleError<TipoVolquete[]>('getAll', []))
  );
}

getTipo(id: number): Observable<TipoVolquete> {
  return this.http.get<TipoVolquete>(`${this.apiUrl}/${id}`).pipe(
    catchError(this.handleError<TipoVolquete>('getTipo'))
  );
}

add(tipo: TipoVolquete): Observable<TipoVolquete> {
  if (!tipo.descripcion_tipo_volquete) {
    throw new Error('Falta indicar la descripcion');
  }
  return this.http.post<TipoVolquete>(this.apiUrl, tipo).pipe(
    tap(() => this.loadInitialData()), // Refresh list
    catchError(this.handleError<TipoVolquete>('add'))
  );
}

update(id: number, tipoVolquete: TipoVolquete): Observable<TipoVolquete> {
  if (!id || isNaN(id)) {
    throw new Error("ID inválido para la actualización del tipo de volquete");
  }
  return this.http.put<TipoVolquete>(`${this.apiUrl}/${id}`, tipoVolquete).pipe(
    tap(() => this.loadInitialData()), // Refresh list
    catchError(this.handleError<TipoVolquete>('update'))
  );
}

delete(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    tap(() => this.loadInitialData()), // Refresh list
    catchError(this.handleError<void>('delete'))
  );
}

private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(`${operation} failed: ${error.message}`);
    return of(result as T);
  };
}

private emitirListadoActualizado() {
  this.getAll().subscribe(tiposVolquete => {
    this.tiposVolqueteSubject.next(tiposVolquete);
  });
}

}
