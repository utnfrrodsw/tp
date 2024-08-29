import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EstadoTorneoComponent } from './estado-torneo/estado-torneo.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { TipoParticipanteComponent } from './tipo-participante/tipo-participante.component';
import { FormatosTorneoComponent } from './formatos-torneo/formatos-torneo.component';

@NgModule({
  declarations: [
    AppComponent,
    EstadoTorneoComponent,
    LocalidadesComponent,
    TipoParticipanteComponent,
    FormatosTorneoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
