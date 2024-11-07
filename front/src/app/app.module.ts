import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EstadoTorneoComponent } from './estado-torneo/estado-torneo.component';
import { LocalidadesComponent } from './localidades/localidades.component';
import { TipoParticipanteComponent } from './tipo-participante/tipo-participante.component';
import { FormatosTorneoComponent } from './formatos-torneo/formatos-torneo.component';
import { PartidoComponent } from './partido/partido.component';
import { ParticipanteComponent } from './participante/participante.component';
import { AdminComponent } from './admin/admin.component';
import { SucursalComponent } from './sucursal/sucursal.component';
import { EquipoComponent } from './equipo/equipo.component';
import { TorneoComponent } from './torneo/torneo.component';
import { LoginComponent } from './login/login.component';
import { PaginaInicioComponent } from './pagina-inicio/pagina-inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    EstadoTorneoComponent,
    LocalidadesComponent,
    TipoParticipanteComponent,
    FormatosTorneoComponent,
    PartidoComponent,
    ParticipanteComponent,
    AdminComponent,
    SucursalComponent,
    EquipoComponent,
    TorneoComponent,
    LoginComponent,
    PaginaInicioComponent
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
