import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-boton-volver',
  templateUrl: './boton-volver.component.html',
  styleUrls: ['./boton-volver.component.css'],
})
export class BotonVolverComponent {
  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.listen('window', 'popstate', () => {
      console.log('Se produjo el evento Popstate.');
    });
  }

  goBack() {
    window.history.back();
  }
}
