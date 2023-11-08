import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Editorial {
  descripcion: string;
  direccion: string;
  imagen: string;

}

@Injectable({
  providedIn: 'root',
})
export class EditorialesService {
  /*private editoriales: Editorial[] = [
    {
      id: 1,
      nombre: 'Editorial BOOKRACK',
      direccion: 'Direccion 1', 
      imagen: '../../../../assets/img/Editoriales/editorial-bookrack.webp',
    },

    {
      id: 2,
      nombre: 'Editorial DJaen',
      direccion: 'Direccion 2',
      imagen: '../../../../assets/img/Editoriales/editorial-djaen.webp',
    },

    {
      id: 3,
      nombre: 'Editorial Gato Malo',
      direccion: 'Direccion 3',
      imagen: '../../../../assets/img/Editoriales/editorial-gato-malo.webp',
    },

    {
      id: 4,
      nombre: 'Editorial Tierra de Mu',
      direccion: 'Direccion 4',
      imagen: '../../../../assets/img/Editoriales/editorial-tierra-de-mu.webp',
    },

    {
      id: 5,
      nombre: 'Editorial Vealia',
      direccion: 'Direccion 5',
      imagen: '../../../../assets/img/Editoriales/editorial-vealia.webp',
    },
  ];
  constructor() {}

  getEditoriales(): Editorial[] {
    return this.editoriales;
  }*/


  private apiUrl = 'http://Localhost:3000/api/editoriales';

  constructor(private http: HttpClient) {}

  getEditorialesIds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/editoriales`).pipe(
      map((response: any) => response.data)
    );
  }

  getNombreCompleto(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/nombre-completo/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getImagen(id: string): Observable<string | undefined> {
    return this.http.get<any>(`${this.apiUrl}/imagen/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

  getEditorialr(id: string): Observable<Editorial | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data)
    );
  }

}
  
  


