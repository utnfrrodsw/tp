import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

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

export interface UpdateEditorialResponse {
  message: string;
  data?: Editorial; // Datos actualizados de la editorial en caso de éxito
}

@Injectable({
  providedIn: 'root',
})
export class EditorialesService {

  private apiUrl: string = environment.apiUrlEditoriales;

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
    return this.http.get<any>(`${this.apiUrl}/get-descripcion/${id}`).pipe(
      map((response: any) => response.data),
    );
  }

  getDireccion(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-direccion/${id}`).pipe(
      map((response: any) => response.data),
    );
  }

  getImagen(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/get-imagen/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getEditorial(id: string): Observable<Editorial | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

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
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleServerError(error);
        })
      );
  }

  validarEditorialExistente(descripcion: string): Observable<Editorial | null> {
    const url = `${this.apiUrl}/descripcion/${descripcion}`;
    return this.http.get<Editorial>(url)
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

  updateEditorial(id: string, editorial: Editorial): Observable<UpdateEditorialResponse> {
    const url = `${this.apiUrl}/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<UpdateEditorialResponse>(url, editorial, httpOptions)
      .pipe(
        tap((response) => {
          console.log('Actualización exitosa', response);
        }),
        catchError((error: HttpErrorResponse) => {
          return this.handleServerError(error);
        })
      );
  }

  getEditoriales(): Observable<Editorial[]> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error al obtener editoriales:', error);
        return of([]);
      })
    );
  }

  getFormatos(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/getformatos/${id}`);
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

    return throwError(() => errorMessage);
  }
}
