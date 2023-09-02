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
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
