import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleComponent } from './detalle/detalle.component';
import { InicioComponent } from './inicio/inicio.component';
import { ListaComponent } from './lista/lista.component';
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
  { path: 'detalle', component: DetalleComponent }
  ,{ path: 'lista', component: ListaComponent }
  ,{ path: 'panel', component: PanelComponent }
  ,{ path: '', component: InicioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }