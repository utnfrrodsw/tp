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
import { CrearCuentaComponent } from './pages/crear-cuenta/crear-cuenta.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { PanelAdminComponent } from './admin/panel-admin/panel-admin.component';
import { CrearEditorialComponent } from './pages/crear-editorial-admin/crear-editorial/crear-editorial.component';
import { EliminarEditorialComponent } from './pages/eliminar-editorial/eliminar-editorial.component';
import { CrudAutoresComponent } from './admin/crud-autores/crud-autores.component';
import { CrudEditorialesComponent } from './admin/crud-editoriales/crud-editoriales.component';
import { CrudLibrosComponent } from './admin/crud-libros/crud-libros.component';
import { CrudOfertasComponent } from './admin/crud-ofertas/crud-ofertas.component';

/* SERVICIOS */
import { UsuarioService } from './services/usuario.service';
import { AuthService } from './services/auth.service';
import { RegistroService } from './services/registro.service';


const routes: Routes = [
  // RUTAS DE LA PÁGINA
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'acerca-de', component: AcercaDeComponent },
  { path: 'editoriales', component: EditorialesComponent },
  { path: 'autores', component: AutoresComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'ayuda', component: AyudaComponent },
  { path: 'libro-seleccionado/:id', component: LibroSeleccionadoComponent },
  { path: 'carrito-compras', component: CarritoComprasComponent },
  { path: 'finalizar-compra', component: FinalizarCompraComponent },
  { path: 'identificarse', component: IdentificarseComponent, canActivate: [RegistroService] },
  { path: 'autor-seleccionado/:id', component: AutorSeleccionadoComponent },
  {
    path: 'perfil', component: PerfilUsuarioComponent,
    providers: [UsuarioService],
    canActivate: [AuthService]
  },
  { path: 'crear-cuenta', component: CrearCuentaComponent, canActivate: [RegistroService] },
  { path: 'busqueda/:term', component: BusquedaComponent },
  { path: 'panel-admin', component: PanelAdminComponent },
  { path: 'panel-admin/autores', component: CrudAutoresComponent },
  { path: 'panel-admin/editoriales', component: CrudEditorialesComponent },
  { path: 'panel-admin/libros', component: CrudLibrosComponent },
  { path: 'panel-admin/ofertas', component: CrudOfertasComponent },
  { path: 'crear-editorial', component: CrearEditorialComponent },
  { path: 'eliminar-editorial', component: EliminarEditorialComponent }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
