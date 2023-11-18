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
    // Verifica el estado de inicio de sesión al iniciar la aplicación
    const isLoggedIn = localStorage.getItem('token') !== null;
    this.iniciarSesionService.setLoggedInState(isLoggedIn);
  }

}  