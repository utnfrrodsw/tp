import { Injectable } from '@angular/core';

export interface Autor {
  id: number;
  nombreCompleto: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutoresService {
  private autores: Autor[] = [
    {
      id: 1,
      nombreCompleto: 'Robert C. Martin',
      perfil: '../../../../assets/img/Autores/Robert C. Martin.jpg',
    },
    {
      id: 2,
      nombreCompleto: 'James Clear',
      perfil: '../../../../assets/img/Autores/James Clear.png',
    },
    {
      id: 3,
      nombreCompleto: 'Autor 3',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      id: 4,
      nombreCompleto: 'Autor 4',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      id: 5,
      nombreCompleto: 'Autor 5',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      id: 6,
      nombreCompleto: 'Autor 6',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      id: 7,
      nombreCompleto: 'Autor 7',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      id: 8,
      nombreCompleto: 'Autor 8',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      id: 9,
      nombreCompleto: 'Autor 9',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
    {
      id: 10,
      nombreCompleto: 'Autor 10',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
    },
  ];
  constructor() {}

  getAutores(): Autor[] {
    return this.autores;
  }
}
