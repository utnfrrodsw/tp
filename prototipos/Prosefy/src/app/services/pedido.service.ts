import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

// Interfaces para los pedidos
export interface Pedido {
  fecha: string;
  usuario: string; // ObjectId del usuario
  libro: string[]; // Array de ObjectIds de libros
  _id?: string; // Opcional, ya que MongoDB lo genera automáticamente
}

export interface PedidoResponse {
  mensaje: string;
  pedido: Pedido;
}

export interface ErrorPedidoResponse {
  mensaje: string; // Mensaje de error descriptivo
  codigo?: number; // Código de error opcional
}

export interface UpdatePedidoResponse {
  message: string;
  data?: Pedido; // Datos actualizados del pedido en caso de éxito
}

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private apiUrl: string = environment.apiUrlPedidos;

  constructor(private http: HttpClient) { }

  // Obtener todos los pedidos
  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}`).pipe(
      map((response: any) => response.data), // Ajusta según la estructura de tu backend
      catchError(this.handleServerError)
    );
  }

  getPedidosIds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/pedidos`).pipe(
      map((response: any) => response.data)
    );
  }

  // Obtener un pedido por ID
  getPedido(id: string): Observable<Pedido | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data),
      catchError(this.handleServerError)
    );
  }

  // Crear un nuevo pedido
  crearPedido(pedido: Pedido): Observable<PedidoResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<PedidoResponse>(this.apiUrl, pedido, httpOptions).pipe(
      tap((response) => {
        console.log('Pedido creado con éxito', response);
      }),
      catchError(this.handleServerError)
    );
  }

  // Actualizar un pedido existente
  actualizarPedido(id: string, pedido: Pedido): Observable<UpdatePedidoResponse> {
    const url = `${this.apiUrl}/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<UpdatePedidoResponse>(url, pedido, httpOptions).pipe(
      tap((response) => {
        console.log('Pedido actualizado con éxito', response);
      }),
      catchError(this.handleServerError)
    );
  }

  // Eliminar un pedido
  eliminarPedido(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        console.log('Pedido eliminado con éxito');
      }),
      catchError(this.handleServerError)
    );
  }

  // Manejo de errores
  private handleServerError(error: any): Observable<never> {
    console.error('Error en el servicio de pedidos', error);

    const errorMessage: ErrorPedidoResponse = {
      mensaje: 'Error desconocido en el servicio de pedidos',
    };

    if (error instanceof HttpErrorResponse) {
      errorMessage.mensaje = error.error?.mensaje || 'Error desconocido en el servicio de pedidos';
      console.error('Detalles del error:', error.error);
    }

    return throwError(() => errorMessage);
  }

  getFechaById(id: string): Observable<string | undefined> {
    return this.http.get(`${this.apiUrl}/fecha/${id}`).pipe(
      map((response: any) => response.data),
      catchError(this.handleServerError)
    );
  }

  getUsuarioById(id: string): Observable<string | undefined> {
    return this.http.get(`${this.apiUrl}/usuario/${id}`).pipe(
      map((response: any) => response.data),
      catchError(this.handleServerError)
    );
  }

  getLibroById(id: string): Observable<string[] | undefined> {
    return this.http.get(`${this.apiUrl}/libros/${id}`).pipe(
      map((response: any) => response.data),
      catchError(this.handleServerError)
    );
  }

  setTipo(id: string, estado: string): Observable<any> {
    const url = `${this.apiUrl}/estado/${id}`;
    const body = { estado };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put(url, body, httpOptions).pipe(
      tap((response) => {
        console.log('Estado actualizado con éxito', response);
      }),
      catchError(this.handleServerError)
    );
  }
}