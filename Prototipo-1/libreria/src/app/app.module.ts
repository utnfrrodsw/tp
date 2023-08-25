import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { HeadernavComponent } from './headernav/headernav.component';

@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    UsuarioComponent,
    HeadernavComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
