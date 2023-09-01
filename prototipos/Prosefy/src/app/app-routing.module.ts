import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { EditorialesComponent } from './pages/editoriales/editoriales.component';
import { AutoresComponent } from './pages/autores/autores.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';

const routes: Routes = [
  // Define las rutas aquí
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta de inicio
  { path: 'inicio', component: InicioComponent }, // Ruta al InicioComponent
  { path: 'acerca-de', component: AcercaDeComponent }, // Ruta al AcercaDeComponent
  { path: 'editoriales', component: EditorialesComponent }, // Ruta al EditorialesComponent
  { path: 'autores', component: AutoresComponent }, // Ruta al AutoresComponent
  { path: 'ofertas', component: OfertasComponent }, // Ruta al OfertasComponent
  { path: 'ayuda', component: AyudaComponent }, // Ruta al AyudaComponent
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
