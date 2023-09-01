import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeadernavComponent } from './shared/header-nav/headernav.component';
import { SeccionOfertasComponent } from './sections/seccion-ofertas/seccion-ofertas.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SeccionLibrosrecomendadosComponent } from './sections/seccion-libros-recomendados/seccion-librosrecomendados.component';
import { AppRoutingModule } from './app-routing.module';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { EditorialesComponent } from './pages/editoriales/editoriales.component';
import { AutoresComponent } from './pages/autores/autores.component';
import { OfertasComponent } from './pages/ofertas/ofertas.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';

@NgModule({
  declarations: [
    AppComponent,
    HeadernavComponent,
    SeccionOfertasComponent,
    FooterComponent,
    SeccionLibrosrecomendadosComponent,
    InicioComponent,
    AcercaDeComponent,
    EditorialesComponent,
    AutoresComponent,
    OfertasComponent,
    AyudaComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
