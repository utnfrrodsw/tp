import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { ErrorRegistroResponse } from './registro.service';

export interface Editorial {
  descripcion: string;
  direccion: string;
  imagen: string;
}

export interface editorialResponse {
  mensaje: string;
  editorial: {
    descripcion: string;
    direccion: string;
    imagen: string;
  };
}

export interface ErrorEditorialResponse {
  mensaje: string; // Un mensaje de error descriptivo
  codigo?: number; // Un código de error opcional
}

@Injectable({
  providedIn: 'root',
})
export class EditorialesService {
  
  private apiUrl = 'http://Localhost:3000/api/editoriales';

  constructor(private http: HttpClient) { }

  getEditorialesIds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/editoriales`).pipe(
      map((response: any) => response.data)
    );
  }

  eliminarEditorial(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  getDescripcion(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/descripcion/${id}`).pipe(
      map((response: any) => response.data),
    );
  }

  getDireccion(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/direccion/${id}`).pipe(
      map((response: any) => response.data),
    );
  }


  getImagen(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/imagen/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getEditorial(id: string): Observable<Editorial | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  // Registro de la editorial

  registrarEditorial(editorial: Editorial): Observable<editorialResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<editorialResponse>(this.apiUrl, editorial, httpOptions)
    .pipe(
      tap((response) => {
        console.log('Registro exitoso', response);
        // Lógica para manejar la respuesta exitosa del registro
      }),
      catchError((error: HttpErrorResponse) => {
        return this.handleServerError(error);
      })
    );
  }

  validarEditorialExistente(descripcion: string): Observable<Editorial | null> {
    const url = `${this.apiUrl}{/descripcion/}${descripcion}`;
    return this.http.get<Editorial>(url)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of(null);
          } else {
            return throwError(error);
          }
        })
      );
  }

private handleServerError(error: any): Observable<never> {
  console.error('Error en el registro', error);

  const errorMessage: ErrorEditorialResponse = {
    mensaje: 'Error desconocido en el registro'
  };

  if (error instanceof HttpErrorResponse) {
    errorMessage.mensaje = error.error?.mensaje || 'Error desconocido en el registro';
    console.error('Detalles del error:', error.error);
  }

  return throwError(errorMessage);
  }



}


