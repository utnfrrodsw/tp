import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import { TorneoService } from '../torneo.service';
import { FormatosTorneoService } from '../formatos-torneo.service';
import { EquipoService } from '../equipo.service';
import { PartidoService } from '../partido.service';
import { ToastrService } from 'ngx-toastr';
import { ParticipanteService } from '../participante.service';
import { response } from 'express';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})

export class AdminComponent {

  constructor (private service: AdminService, private torneoService: TorneoService, private formatoService: FormatosTorneoService, private equipoService: EquipoService, private partidoService: PartidoService, private toastr: ToastrService, private participanteService: ParticipanteService) {}
  
  torneos:any[] = []
  participantes:any[] = []
  objetos:any = Object

  ngOnInit(): void{
    this.torneoService.getTorneos().subscribe(response => this.torneos = response.data)
    this.participanteService.getParticipantes().subscribe(response => this.participantes = response.data)
  }

  addTorneo(nombre_torneo:string, fecha_inicio_torneo:string, fecha_fin_torneo:string, admin:string, sucursal:string, estado_torneo: string, formato_torneo: string, id: string){
    if(nombre_torneo == '' || fecha_inicio_torneo == '' || fecha_fin_torneo == '' || admin == '' || sucursal == '' || estado_torneo == '' || formato_torneo == '' || id == ''){
      this.toastr.error('Todos los campos son obligatorios', 'Error')
      return
    }
    this.torneoService.addTorneo(nombre_torneo, fecha_inicio_torneo, fecha_fin_torneo, parseInt(admin), parseInt(sucursal), parseInt(estado_torneo), parseInt(formato_torneo), parseInt(id)).subscribe(response => this.objetos = response)
    this.formatoService.getFormato(formato_torneo).subscribe(E_formato_torneo => {
    this.equipoService.addEquiposTorneo(parseInt(id), E_formato_torneo).subscribe(response => this.objetos = response);
    this.partidoService.addPartidosTorneo(parseInt(id), E_formato_torneo).subscribe(response => this.objetos = response);
    })
    location.reload()
  }

  cambiarEstado(id_estado: number, torneo_id: number){
    this.torneoService.modTorneo(id_estado, torneo_id).subscribe(response => this.objetos = response)
    location.reload()
    }

  actualizarFechaIni(fecha_inicio_torneo: string, torneo_id:number){
    this.torneoService.modTorneoFechaIni(fecha_inicio_torneo, torneo_id).subscribe(response => this.objetos = response)
    location.reload()
  }

  actualizarFechaFin(fecha_fin: string, torneo_id:number){
    this.torneoService.modTorneoFechaFin(fecha_fin, torneo_id).subscribe(response => this.objetos = response)
    location.reload()
  }
  
  eliminarParticipante(participante_id: number){
    this.participanteService.remove(participante_id).subscribe(response => this.objetos = response)
    location.reload()
  }
}
    
 /*loadAdmins(){
    return this.service.getAdmins().subscribe(response => this.list = response);
  }

  loadOne(id:string){
    return this.service.getOneAdmin(id).subscribe(response => this.admin = response);
  }

  removeAdmin(id:string){
    return this.service.remove(id).subscribe(response => this.admin = response);
  }*/

  /*putAdmin(nombre:string, contraseña:string, apellido:string, mail:string, fecha_nacimiento:string, id: string){
    return this.service.modAdmin(nombre, contraseña, apellido, mail, fecha_nacimiento, parseInt(id)).subscribe(response => this.admin = response);
  }*/