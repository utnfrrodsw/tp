import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { EditorialesComponent } from './pages/editoriales/editoriales.component';
import { AutoresComponent } from './pages/autores/autores.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';
import { LibroSeleccionadoComponent } from './pages/libro-seleccionado/libro-seleccionado.component';
import { CarritoComprasComponent } from './pages/carrito-compras/carrito-compras.component';
import { FinalizarCompraComponent } from './pages/finalizar-compra/finalizar-compra.component';
import { IdentificarseComponent } from './pages/identificarse/identificarse.component';
import { AutorSeleccionadoComponent } from './pages/autor-seleccionado/autor-seleccionado.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';

const routes: Routes = [
  // Define las rutas aquí
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Ruta de inicio
  { path: 'inicio', component: InicioComponent }, // Ruta al InicioComponent
  { path: 'acerca-de', component: AcercaDeComponent }, // Ruta al AcercaDeComponent
  { path: 'editoriales', component: EditorialesComponent }, // Ruta al EditorialesComponent
  { path: 'autores', component: AutoresComponent }, // Ruta al AutoresComponent
  { path: 'ofertas', component: OfertasComponent }, // Ruta al OfertasComponent
  { path: 'ayuda', component: AyudaComponent }, // Ruta al AyudaComponent
  { path: 'libro-seleccionado', component: LibroSeleccionadoComponent }, // Ruta al LibroSeleccionadoComponent. TODO: El nombre del enlace debe cambiar dependiendo del libro seleccionado
  { path: 'carrito-compras', component: CarritoComprasComponent }, // Ruta al CarritoComprasComponent
  { path: 'finalizar-compra', component: FinalizarCompraComponent }, // Ruta al FinalizarCompraComponent
  { path: 'identificarse', component: IdentificarseComponent }, // Ruta al InicioComponent
  { path: 'autor-seleccionado', component: AutorSeleccionadoComponent }, // Ruta al InicioComponent
  { path: 'perfil', component: PerfilUsuarioComponent }, // Ruta al InicioComponent
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
