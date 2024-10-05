import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario, UsuarioModel } from '../../model/interfaces/usuario.interface.js';


@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuario$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

  private apiUrl = 'http://localhost:3000/api/usuarios';

  private http = inject(HttpClient); // Use inject() to get HttpClient

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getAll().subscribe((usuario) => this.usuariosSubject.next(usuario));
  }

  getAll(): Observable<Usuario[]> {
    console.log('getAll called');
    return this.http.get<{ data: Usuario[] }>(this.apiUrl).pipe(
      map((response) => response.data || []),
      catchError(this.handleError<Usuario[]>('getAll', []))
    );
  }

  getTipo(id: number): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<Usuario>('getTipo')));
  }

  add(auxUser: Usuario): Observable<Usuario> {
    if (!auxUser.nombre_usuario) {
      throw new Error('Falta indicar el nombre');
    }
    return this.http.post<Usuario>(this.apiUrl, auxUser).pipe(
      tap(() => this.loadInitialData()), // Refresh list
      catchError(this.handleError<Usuario>('add'))
    );
  }

  update(auxUser: UsuarioModel): Observable<UsuarioModel> {
    const id = auxUser.id_usuario;
    if (!id || isNaN(id)) {
      throw new Error('ID inválido para la actualización del tipo de volquete');
    }
    return this.http.put<UsuarioModel>(`${this.apiUrl}/${id}`, auxUser).pipe(
      tap(() => this.loadInitialData()), // Refresh list
      catchError(this.handleError<UsuarioModel>('update'))
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
    this.getAll().subscribe((auxUser) => {
      this.usuariosSubject.next(auxUser);
    });
  }
}
