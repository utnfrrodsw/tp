import {inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Volquete, VolqueteModel} from '../../model/interfaces/volquete.interface.js';

@Injectable({
  providedIn: 'root',
})
export class VolqueteService {
  private volqueteSubject = new BehaviorSubject<Volquete[]>([]);
  public volquetes$: Observable<Volquete[]> =
    this.volqueteSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/volquetes';

  private http = inject(HttpClient);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getAll().subscribe((volquete) => this.volqueteSubject.next(volquete));
  }

  getAll(): Observable<Volquete[]> {
    console.log('getAll called');
    return this.http.get<{ data: Volquete[] }>(this.apiUrl).pipe(
      map((response) => response.data || []),
      catchError(this.handleError<Volquete[]>('getAll', []))
    );
  }

  getVolquete(id: number): Observable<Volquete> {
    return this.http
      .get<Volquete>('${this.apiUrl}/${id}')
      .pipe(catchError(this.handleError<Volquete>('getVolquete')));
  }

  add(volquete: Volquete): Observable<Volquete> {
    if (!volquete.nro) {
      throw new Error('Falta indicar nro');
    }
    return this.http.post<Volquete>(this.apiUrl, volquete).pipe(
      tap(() => this.loadInitialData()),
      catchError(this.handleError<Volquete>('add'))
    );
  }

  update(volquete: VolqueteModel): Observable<VolqueteModel> {
    const nro = volquete.nro;
    if (!nro || isNaN(nro)) {
      throw new Error('Nro inválido para la actualización del volquete');
    }
    return this.http.put<VolqueteModel>('${this.apiUrl}/${nro}', volquete).pipe(
      tap(() => this.loadInitialData()),
      catchError(this.handleError<VolqueteModel>('Update'))
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
}
