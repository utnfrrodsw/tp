import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoVolquete } from '../../model/interfaces/tipo_volquete.interface.js';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiposVolqueteService {
  private apiUrl = 'http://localhost:3000/api/tipoVolquetes';
  constructor(private http: HttpClient) {}

  tiposVolquete: TipoVolquete[]=[];
  
  private tiposVolqueteSubject = new Subject<TipoVolquete[]>()
  tiposVolquete$ = this.tiposVolqueteSubject.asObservable();

getAll(): Observable<TipoVolquete[]> {
  return this.http.get<TipoVolquete[]>(this.apiUrl);
}

getTipo(id: number): Observable<TipoVolquete> {
  return this.http.get<TipoVolquete>(`${this.apiUrl}/${id}`);
}

add(tipo: TipoVolquete): Observable<TipoVolquete> {
  console.log("COMENTARIO A BORRAR: (service. addProveedor)",tipo.descripcion)
  if (!tipo.descripcion){
    throw new Error("Falta indicar la descripcion");
  }
  return this.http.post<TipoVolquete>(this.apiUrl, tipo).pipe(
    tap(() => this.emitirListadoActualizado())
  );
}

update(id: number, tipoVolquete: TipoVolquete): Observable<TipoVolquete> {
  if (!id || isNaN(id)) {
    throw new Error("ID inválido para la actualización del tipo de volquete");
  }
  return this.http.put<TipoVolquete>(`${this.apiUrl}/${id}`, tipoVolquete).pipe(
    tap(() => this.emitirListadoActualizado())
  );
}

delete(id: number): Observable<void> {
  console.log("COMENTARIO A BORRAR: (service. delete)",id)
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    tap(() => this.emitirListadoActualizado())
  );
}


private emitirListadoActualizado() {
  this.getAll().subscribe(tiposVolquete => {
    this.tiposVolqueteSubject.next(tiposVolquete);
  });
}

}
