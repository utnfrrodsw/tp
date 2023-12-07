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
    });
  }

  goBack() {
    window.history.back();
  }
}
