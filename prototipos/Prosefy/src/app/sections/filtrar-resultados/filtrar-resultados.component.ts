import { Component } from '@angular/core';

@Component({
  selector: 'app-filtrar-resultados',
  templateUrl: './filtrar-resultados.component.html',
  styleUrls: ['./filtrar-resultados.component.css'],
})
export class FiltrarResultadosComponent {
  idiomas: string[] = ['Inglés', 'Español', 'Francés', 'Alemán'];
  formatos: string[] = ['Físico', 'Ebook'];
  categorias: string[] = [
    'Ficción',
    'No ficción',
    'Literatura infantil',
    'Educación y referencia',
    'Ciencia y naturaleza',
    'Religión y espiritualidad',
    'Política y sociedad',
    'Salud y bienestar',
    'Negocios y finanzas',
  ];
  ordenarPor: string[] = ['Fecha', 'Popularidad', 'Alfabético'];

  selectedIdiomas: string[] = [];
  selectedFormatos: string[] = [];
  selectedCategorias: string[] = [];
  selectedOrdenarPor: string = '';
}
