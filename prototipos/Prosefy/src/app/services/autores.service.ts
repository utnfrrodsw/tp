import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

export interface Autor {
  nombreCompleto: string;
  perfil: string;
  info: string;
}

export interface autorResponse {
  mensaje: string;
  autor: {
    nombreCompleto: string;
    perfil: string;
    info: string;
  };
}

export interface ErrorAutorResponse {
  mensaje: string; // Un mensaje de error descriptivo
  codigo?: number; // Un código de error opcional
}

export interface UpdateAutorResponse {
  message: string;
  data?: Autor; // Datos actualizados del autor en caso de éxito
}


@Injectable({
  providedIn: 'root',
})
export class AutoresService {
  private apiUrl: string = environment.apiUrlAutores;

  constructor(private http: HttpClient) { }

  getAutores(): Observable<Autor[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map((response: any) => response.data)
    );
  }

  getAutoresIds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/autores`).pipe(
      map((response: any) => response.data)
    );
  }

  getNombreCompleto(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-nombre-completo/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getPerfil(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/perfil/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getInfo(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/info/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getAutor(id: string): Observable<Autor | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  eliminarAutor(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  updateAutor(id: string, autor: Autor): Observable<UpdateAutorResponse> {
    const url = `${this.apiUrl}/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<UpdateAutorResponse>(url, autor, httpOptions)
      .pipe(
        tap((response) => {
          console.log('Actualización exitosa', response);
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleServerError(error);
        })
      );
  }

  validarAutorExistente(nombreCompleto: string): Observable<Autor | null> {
    const nombreCompletoEncoded = encodeURIComponent(nombreCompleto);
    const url = `${this.apiUrl}/nombre-completo/${nombreCompletoEncoded}`;
    return this.http.get<Autor>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null);
          } else {
            return throwError(() => error);
          }
        })
      );
  }

  registrarAutor(autor: Autor): Observable<autorResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<autorResponse>(this.apiUrl, autor, httpOptions)
      .pipe(
        tap((response) => {
          console.log('Registro exitoso', response);
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleServerError(error);
        })
      );
  }

  private handleServerError(error: any): Observable<never> {
    console.error('Error en el registro', error);

    const errorMessage: ErrorAutorResponse = {
      mensaje: 'Error desconocido en el registro'
    };

    if (error instanceof HttpErrorResponse) {
      errorMessage.mensaje = error.error?.mensaje || 'Error desconocido en el registro';
      console.error('Detalles del error:', error.error);
    }

    return throwError(() => errorMessage);
  }
}