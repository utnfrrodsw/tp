/* ANGULAR */
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe, registerLocaleData, CommonModule } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

/* BOOTSTRAP */
import { PaginationModule } from 'ngx-bootstrap/pagination';

/* ------------------------------------------------------------------- */

/* COMPONENTES */
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { OfertasDestacadasComponent } from './sections/ofertas-destacadas/ofertas-destacadas.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LibrosRecomendadosComponent } from './sections/libros-recomendados/libros-recomendados.component';
import { AppRoutingModule } from './app-routing.module';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { EditorialesComponent } from './pages/editoriales/editoriales.component';
import { AutoresComponent } from './pages/autores/autores.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';
import { AutoresPopularesComponent } from './sections/autores-populares/autores-populares.component';
import { NuevosLanzamientosComponent } from './sections/nuevos-lanzamientos/nuevos-lanzamientos.component';
import { LibrosMasVendidosComponent } from './sections/libros-mas-vendidos/libros-mas-vendidos.component';
import { PopupLocalidadComponent } from './shared/popup-localidad/popup-localidad.component';
import { AutoresNuevosComponent } from './sections/autores-nuevos/autores-nuevos.component';
import { TodasLasEditorialesComponent } from './sections/todas-las-editoriales/todas-las-editoriales.component';
import { IdentificarseComponent } from './pages/identificarse/identificarse.component';
import { IniciarSesionComponent } from './sections/iniciar-sesion/iniciar-sesion.component';
import { RegistrarseComponent } from './sections/registrarse/registrarse.component';
import { TodasLasOfertasComponent } from './sections/todas-las-ofertas/todas-las-ofertas.component';
import { FiltrarResultadosComponent } from './sections/filtrar-resultados/filtrar-resultados.component';
import { LibroSeleccionadoComponent } from './pages/libro-seleccionado/libro-seleccionado.component';
import { InfoLibroSeleccionadoComponent } from './sections/info-libro-seleccionado/info-libro-seleccionado.component';
import { InfoDetalladaLibroComponent } from './sections/info-detallada-libro/info-detallada-libro.component';
import { OpinionesLibroComponent } from './sections/opiniones-libro/opiniones-libro.component';
import { CarritoComprasComponent } from './pages/carrito-compras/carrito-compras.component';
import { ProductosCarritoComprasComponent } from './sections/productos-carrito-compras/productos-carrito-compras.component';
import { BotonVolverComponent } from './shared/boton-volver/boton-volver.component';
import { FinalizarCompraComponent } from './pages/finalizar-compra/finalizar-compra.component';
import { PagarComponent } from './sections/pagar/pagar.component';
import { AutorSeleccionadoComponent } from './pages/autor-seleccionado/autor-seleccionado.component';
import { InfoAutorComponent } from './sections/info-autor/info-autor.component';
import { LibrosAutorComponent } from './sections/libros-autor/libros-autor.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { InfoUsuarioComponent } from './sections/info-usuario/info-usuario.component';
import { SeccionesAyudaComponent } from './sections/secciones-ayuda/secciones-ayuda.component';
import { BusquedaComponent } from './pages/busqueda/busqueda.component';
import { ResultadosComponent } from './sections/resultados/resultados.component';
import { CrearCuentaComponent } from './pages/crear-cuenta/crear-cuenta.component';
import { ListaLibrosComponent } from './shared/lista-libros/lista-libros.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ComentarioUsuarioComponent } from './shared/comentario-usuario/comentario-usuario.component';
import { ListaAutoresComponent } from './shared/lista-autores/lista-autores.component';
import { NuevoComentarioComponent } from './shared/nuevo-comentario/nuevo-comentario/nuevo-comentario.component';
import { PanelAdminComponent } from './admin/panel-admin/panel-admin.component';
import { CrudCategoriasComponent } from './admin/crud-categorias/crud-categorias.component';
import { CrudProvinciasComponent } from './admin/crud-provincias/crud-provincias.component';
import { CrudPedidosComponent } from './admin/crud-pedidos/crud-pedidos.component';

/* ------------------------------------------------------------------- */

/* SERVICIOS */

import { IniciarSesionService } from './services/iniciar-sesion.service';
import { CarritoComprasService } from './services/carrito-compras.service';
import { CurrencyService } from './services/currency.service';
import { AutoresService } from './services/autores.service';
import { HeaderAdminComponent } from './admin/header-admin/header-admin.component';
import { CrudAutoresComponent } from './admin/crud-autores/crud-autores.component';
import { CrudEditorialesComponent } from './admin/crud-editoriales/crud-editoriales.component';
import { CrudLibrosComponent } from './admin/crud-libros/crud-libros.component';
import { CrudOfertasComponent } from './admin/crud-ofertas/crud-ofertas.component';
import { CrudUsuariosComponent } from './admin/crud-usuarios/crud-usuarios.component';
import { ResumenPedidoComponent } from './sections/resumen-pedido/resumen-pedido.component';
import { PedidosService } from './services/pedido.service';

registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OfertasDestacadasComponent,
    FooterComponent,
    LibrosRecomendadosComponent,
    InicioComponent,
    AcercaDeComponent,
    EditorialesComponent,
    AutoresComponent,
    OfertasComponent,
    AyudaComponent,
    AutoresPopularesComponent,
    NuevosLanzamientosComponent,
    LibrosMasVendidosComponent,
    PopupLocalidadComponent,
    AutoresNuevosComponent,
    TodasLasEditorialesComponent,
    IdentificarseComponent,
    IniciarSesionComponent,
    RegistrarseComponent,
    TodasLasOfertasComponent,
    FiltrarResultadosComponent,
    LibroSeleccionadoComponent,
    InfoLibroSeleccionadoComponent,
    InfoDetalladaLibroComponent,
    OpinionesLibroComponent,
    CarritoComprasComponent,
    ProductosCarritoComprasComponent,
    BotonVolverComponent,
    FinalizarCompraComponent,
    PagarComponent,
    AutorSeleccionadoComponent,
    InfoAutorComponent,
    LibrosAutorComponent,
    PerfilUsuarioComponent,
    InfoUsuarioComponent,
    SeccionesAyudaComponent,
    BusquedaComponent,
    ResultadosComponent,
    CrearCuentaComponent,
    ListaLibrosComponent,
    NavbarComponent,
    ComentarioUsuarioComponent,
    ListaAutoresComponent,
    NuevoComentarioComponent,
    PanelAdminComponent,
    HeaderAdminComponent,
    CrudAutoresComponent,
    CrudEditorialesComponent,
    CrudLibrosComponent,
    CrudOfertasComponent,
    CrudUsuariosComponent,
    CrudProvinciasComponent,
    CrudCategoriasComponent,
    ResumenPedidoComponent,
    CrudPedidosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    FormsModule,
    PaginationModule.forRoot(),
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    CurrencyService,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' },
    AutoresService,
    CarritoComprasService,
    IniciarSesionService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
