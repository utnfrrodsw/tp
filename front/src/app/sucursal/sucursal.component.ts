import { Component } from '@angular/core';
import { SucursalService } from '../sucursal.service';

@Component({
  selector: 'app-sucursal',
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.scss'
})
export class SucursalComponent {
  constructor (private service: SucursalService) {
  }
  
  list:any = [];
  sucursal:any = Object;

  ngOnInit(): void{

  }

  loadSucursales(){
    return this.service.getSucursales().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneSucursal(id).subscribe(response => this.sucursal = response);
  }

  removeSucursal(id:string){
    return this.service.remove(id).subscribe(response => this.sucursal = response);
  }

  addSucursal(nombre_sucursal:string, localidad:string, id:string){
    return this.service.add(nombre_sucursal, localidad, parseInt(id)).subscribe(response => this.sucursal = response);
  }

  putSucursal(nombre_sucursal:string, localidad:string, id:string){
    return this.service.modSucursal(nombre_sucursal, localidad, parseInt(id)).subscribe(response => this.sucursal = response);
  }
}