import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  Titulo = 'Administrador de Torneos';
  description = 'Nuestra aplicación desarrollada con Angular está diseñada para la administración integral de torneos de fútbol. Ofrece una gestión robusta de usuarios, permitiendo el registro y autenticación segura de los mismos. Los equipos pueden ser creados y organizados, asignando jugadores. La aplicación facilita la creación y seguimiento de torneos, incluyendo la programación de partidos y la actualización de resultados. Además, soporta múltiples localidades, permitiendo a los administradores configurar y gestionar diversas sedes de juego de manera eficiente.';
  pie = "Reservados todos los derechos® "



}