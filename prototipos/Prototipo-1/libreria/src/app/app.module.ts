import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeadernavComponent } from './shared/headernav/headernav.component';
import { SeccionOfertasComponent } from './seccion-ofertas/seccion-ofertas.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SeccionLibrosrecomendadosComponent } from './seccion-librosrecomendados/seccion-librosrecomendados.component';

@NgModule({
  declarations: [
    AppComponent,
    HeadernavComponent,
    SeccionOfertasComponent,
    FooterComponent,
    SeccionLibrosrecomendadosComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
