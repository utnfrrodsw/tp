import { Injectable } from '@angular/core';

export interface Autor {
  id: number;
  nombreCompleto: string;
  perfil: string;
  info: string;
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
      info: 'Conocido como "Uncle Bob", es un influyente ingeniero de software y autor de libros destacado en el desarrollo ágil y la programación limpia. Su enfoque práctico y sus libros, como "Clean Code", han impulsado estándares de excelencia en la industria del software.',
    },
    {
      id: 2,
      nombreCompleto: 'James Clear',
      perfil: '../../../../assets/img/Autores/James Clear.png',
      info: 'Es un escritor y conferencista reconocido por su trabajo en el campo del desarrollo personal y la mejora del rendimiento. Su libro "Atomic Habits" ha ganado popularidad al ofrecer consejos prácticos para construir hábitos duraderos y alcanzar el éxito personal y profesional.',
    },
    {
      id: 3,
      nombreCompleto: 'Mark Lutz',
      perfil: '../../../../assets/img/Autores/Mark Lutz.jpg',
      info: 'Es un reconocido autor y programador de software, ampliamente conocido por su trabajo en el campo de Python. Sus libros, incluido "Learning Python", han sido recursos fundamentales para estudiantes y profesionales que buscan dominar el lenguaje de programación Python.',
    },
    {
      id: 4,
      nombreCompleto: 'Luis Joyanes Aguilar',
      perfil: '../../../../assets/img/Autores/Luis Joyanes Aguilar.jpg',
      info: 'Es un destacado ingeniero informático y autor de renombre en el ámbito de la programación. Sus libros, como "Programación en C" y "Fundamentos de Programación", han sido ampliamente utilizados en la enseñanza de la programación y la informática a nivel universitario y profesional.',
    },
    {
      id: 5,
      nombreCompleto: 'Autor 5',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
      info: 'lorem',
    },
    {
      id: 6,
      nombreCompleto: 'Autor 6',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
      info: 'lorem',
    },
    {
      id: 7,
      nombreCompleto: 'Autor 7',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
      info: 'lorem',
    },
    {
      id: 8,
      nombreCompleto: 'Autor 8',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
      info: 'lorem',
    },
    {
      id: 9,
      nombreCompleto: 'Autor 9',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
      info: 'lorem',
    },
    {
      id: 10,
      nombreCompleto: 'Autor 10',
      perfil: '../../../../assets/img/Autores/perfil-autor-default.jpg',
      info: 'lorem',
    },
  ];
  constructor() { }

  getAutores(): Autor[] {
    return this.autores;
  }

  getAutorByNombre(nombre: string): Autor | undefined {
    return this.autores.find((autor) => autor.nombreCompleto === nombre);
  }
}