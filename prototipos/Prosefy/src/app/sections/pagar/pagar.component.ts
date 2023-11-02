import { Component } from '@angular/core';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.css']
})
export class PagarComponent {

  contador = 1;

  aumentarContador() {
    if (this.contador < 10) {
      this.contador++;
    }
  }
  disminuirContador() {
    if (this.contador > 1) {
      this.contador--;
    }
  }
  
  divStyles: any = {
    'background-color': 'white'
  };

  changeBackgroundColor() {
    // Cambia el color de fondo al hacer click
    this.divStyles['background-color'] = 'lightblue'
  };

}
