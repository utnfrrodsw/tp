var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
export let AppComponent = class AppComponent {
    constructor() {
        this.titulo = 'Administrador de Torneos';
        this.description = 'Nuestra aplicación desarrollada con Angular está diseñada para la administración integral de torneos de fútbol. Ofrece una gestión robusta de usuarios, permitiendo el registro y autenticación segura de los mismos. Los equipos pueden ser creados y organizados, asignando jugadores. La aplicación facilita la creación y seguimiento de torneos, incluyendo la programación de partidos y la actualización de resultados. Además, soporta múltiples localidades, permitiendo a los administradores configurar y gestionar diversas sedes de juego de manera eficiente.';
        this.pie = "Reservados todos los derechos® ";
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        standalone: true,
        imports: [RouterOutlet],
        templateUrl: './app.component.html',
        styleUrl: './app.component.scss'
    })
], AppComponent);
//# sourceMappingURL=app.component.js.map