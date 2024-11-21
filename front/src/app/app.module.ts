import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { RegistroComponent } from './registro/registro.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule } from 'ngx-toastr'
import { addTokenInterceptor } from './utils/add-token.interceptor';

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
    PaginaInicioComponent,
    RegistroComponent,
    InscripcionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,  
    }),
  ],
  providers: [
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, 
      useClass: addTokenInterceptor, 
      multi:true },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
