import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleComponent } from './detalle/detalle.component';
import { InicioComponent } from './inicio/inicio.component';
import { ListaComponent } from './lista/lista.component';

const routes: Routes = [
  { path: 'detalle', component: DetalleComponent }
  ,{ path: 'lista', component: ListaComponent }
  ,{ path: '', component: InicioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }