import { Component, OnInit } from '@angular/core';
import { SmoothScrollService } from './smooth-scroll.service';
import { nombreSitio } from '../app/shared/constants';
import { IniciarSesionService, IniciarSesionResponse, ErrorIniciarSesionResponse } from './services/iniciar-sesion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  nombreSitio: string;

  constructor(private smoothScrollService: SmoothScrollService, private iniciarSesionService: IniciarSesionService) {
    this.nombreSitio = nombreSitio;
  }

  ngOnInit() {
    this.smoothScrollService.initializeSmoothScrollbar();
  }

  iniciarSesion() {
    // TODO: Reemplazar email y contraseña con lógica para obtenerlos
    const email = 'usuario@example.com';
    const contraseña = 'contraseña123';

    this.iniciarSesionService.iniciarSesion(email, contraseña).subscribe(
      (response: IniciarSesionResponse) => {
        console.log('Inicio de sesión exitoso', response);
        // TODO: manejar la respuesta exitosa y la lógica adicional, como almacenar el token en el almacenamiento local
      },
      (error: ErrorIniciarSesionResponse) => {
        console.error('Error en el inicio de sesión', error);
        // TODO: Manejar el error y mostrar un mensaje de error al usuario
      }
    );
  }
}  