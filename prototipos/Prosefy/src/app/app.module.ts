import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeadernavComponent } from './shared/header-nav/headernav.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HeadernavComponent,
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
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
