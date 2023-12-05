import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DetalleComponent } from './detalle/detalle.component';
import { ListaComponent } from './lista/lista.component';
import { InicioComponent } from './inicio/inicio.component';
import { PanelComponent } from './panel/panel.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// let baseURL="https://unpkg.com/egalink-toasty.js@1.5.5//dist/sounds/";

@NgModule({
  declarations: [
    AppComponent,
    DetalleComponent,
    ListaComponent,
    InicioComponent,
    PanelComponent
  ],
  imports: [
    BrowserModule
    ,HttpClientModule, AppRoutingModule
    ,BrowserAnimationsModule,ToastrModule.forRoot(/* {enableSounds:true,sounds: {
      info: baseURL+"info/1.mp3",
      success: baseURL+"success/1.mp3",
      warning: baseURL+"warning/1.mp3",
      error: baseURL+"error/1.mp3",
    }} */)
  ], 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
