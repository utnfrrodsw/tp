import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TipoVolquete, TipoVolqueteModel } from '../../model/interfaces/tipo_volquete.interface.js';

@Injectable({
  providedIn: 'root'
})

export class TiposVolqueteService {
  
  private tiposVolqueteSubject = new BehaviorSubject<TipoVolquete[]>([]);
  public tiposVolquete$ : Observable<TipoVolquete[]> = this.tiposVolqueteSubject.asObservable();
  
  private apiUrl = 'http://localhost:3000/api/tipoVolquetes';
  
  private http = inject(HttpClient); // Use inject() to get HttpClient
  
  // tiposVolquete: TipoVolquete[]=[];
  
  constructor() {
    this.loadInitialData();
  }
  
  private loadInitialData() {
    this.getAll().subscribe(tiposVolquete => this.tiposVolqueteSubject.next(tiposVolquete));
  }
  
getAll(): Observable<TipoVolquete[]> {
  console.log('getAll called')
  return this.http
    .get<{data: TipoVolquete[]}>(this.apiUrl)
    .pipe(
      map(response=> response.data || [] ),
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

update(tipoVolquete: TipoVolqueteModel): Observable<TipoVolqueteModel> {
  const id = tipoVolquete.id_tipo_volquete;
  if (!id || isNaN(id)) {
    throw new Error("ID inválido para la actualización del tipo de volquete");
  }
  return this.http.put<TipoVolqueteModel>(`${this.apiUrl}/${id}`, tipoVolquete).pipe(
    tap(() => this.loadInitialData()), // Refresh list
    catchError(this.handleError<TipoVolqueteModel>('update'))
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
