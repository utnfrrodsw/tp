import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-libro-seleccionado',
  templateUrl: './libro-seleccionado.component.html',
  styleUrls: ['./libro-seleccionado.component.css'],
})
export class LibroSeleccionadoComponent implements OnInit, AfterViewChecked {
  libroId: string | null = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Suscribirse a los cambios del parámetro 'id' para que el componente se actualice cuando cambie el parámetro
    this.route.paramMap.subscribe(params => {
      this.libroId = params.get('id');
      // Aquí puedes hacer la lógica de recarga de contenido, si es necesario
    });
  }

  ngAfterViewChecked(): void {
    // Asegura que el scroll se desplace hacia arriba cuando se cargue o cambie la vista
    window.scrollTo(0, 0);
  }
}