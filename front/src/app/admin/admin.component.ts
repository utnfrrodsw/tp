import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import { TorneoService } from '../torneo.service';
import { FormatosTorneoService } from '../formatos-torneo.service';
import { EquipoService } from '../equipo.service';
import { PartidoService } from '../partido.service';
import { ToastrService } from 'ngx-toastr';
import { ParticipanteService } from '../participante.service';
import { SucursalService } from '../sucursal.service';
import { LocalidadesService } from '../localidades.service';
import { EstadoTorneoService } from '../estado-torneo.service.js';




@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})

export class AdminComponent {

  constructor (private service: AdminService, private torneoService: TorneoService, private formatoService: FormatosTorneoService, private equipoService: EquipoService, private partidoService: PartidoService, private toastr: ToastrService, private participanteService: ParticipanteService, private sucursalService: SucursalService, private localidadService: LocalidadesService, private estadoTorneoService: EstadoTorneoService) {}
  
  torneos:any[] = []
  participantes:any[] = []
  objetos:any = Object
  partidos:any[] = []
  equipos:any[] = []
  equipo:string = ""
  equipo2:string= ""
  localidades:any[] = []
  localidad:string = ""
  admins:any[] = []
  admin:string = ""
  sucursales:any[] = []
  sucursal:string = ""
  estado_torneos:any[] = []
  estado_torneo:string = ""
  formato_torneos:any[] = []
  formato_torneo:string = ""

  ngOnInit(): void{
    this.torneoService.getTorneos().subscribe(response => this.torneos = response.data)
    this.participanteService.getParticipantes().subscribe(response => this.participantes = response.data)
    this.localidadService.getLocalidades().subscribe(response => this.localidades = response.data)
    this.service.getAdmins().subscribe(response => this.admins = response.data)
    this.sucursalService.getSucursales().subscribe(response => this.sucursales = response.data)
    this.estadoTorneoService.getEstados().subscribe(response => this.estado_torneos = response.data)
    this.formatoService.getFormatos().subscribe(response => this.formato_torneos = response.data)
    


  }

  addTorneo(nombre_torneo:string, fecha_inicio_torneo:string, fecha_fin_torneo:string, admin:string, sucursal:string, estado_torneo: string, formato_torneo: string, id: string){
  /*  if(nombre_torneo == '' || admin == ''|| sucursal == '' || estado_torneo == '' || formato_torneo == ''){
      this.toastr.error('Todos los campos son obligatorios', 'Error')
      return
    }*/
    this.torneoService.addTorneo(nombre_torneo, fecha_inicio_torneo, fecha_fin_torneo, parseInt(admin), parseInt(sucursal), parseInt(estado_torneo), parseInt(formato_torneo), parseInt(id)).subscribe(response => this.objetos = response)
    this.formatoService.getFormato(formato_torneo).subscribe(E_formato_torneo => {
    this.equipoService.addEquiposTorneo(parseInt(id), E_formato_torneo).subscribe(response => this.objetos = response)
    this.partidoService.addPartidosTorneo(parseInt(id), E_formato_torneo).subscribe(response => this.objetos = response)
    location.reload()
    })
    /*this.toastr.success('Torneo Creado Correctamente', 'Torneo Creado')*/
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

  mostrarPartidos(id_torneo: string){
    this.partidos = []
    this.torneoService.getOneTorneo(id_torneo).subscribe(torneo_e => {
      const cont = torneo_e.data.partidos.length
      for(let i=0;i<cont;i++){
        const id_partido = torneo_e.data.partidos[i].id
        this.partidoService.getOnePartido(id_partido).subscribe(response => {
          this.partidos.push(response.data)
        })
      }
    })
  }

  mostrarEquipos(id_torneo: string){
    this.equipos = []
    this.torneoService.getOneTorneo(id_torneo).subscribe(torneo_e => {
      const cont = torneo_e.data.equipos.length
      for(let i=0;i < cont; i++){
        const id_equipo = torneo_e.data.equipos[i].id
        this.equipoService.getOneEquipo(id_equipo).subscribe(response => {
          this.equipos.push(response.data)
        })
      }
    })
  }

  actualizarGanador(id_torneo: string, id_ganador: string){
    this.torneoService.actualizarGanadorTorneo(id_torneo,id_ganador.toString()).subscribe(torneo_e => this.objetos = torneo_e)
    location.reload()
  }
  addSucursal(id_sucursal:string, nombre_sucursal:string, id_localidad:string){
    /*if(id_localidad == '' || nombre_sucursal == '' ){
      this.toastr.error('Todos los campos deben estar completos')
      return
    }
    try{*/
      this.sucursalService.addSucursal(nombre_sucursal, parseInt(id_localidad), parseInt(id_sucursal)).subscribe(response => this.objetos = response)
      this.toastr.success('Sucursal cargada correctamente', 'Sucursal Cargada')
    /*}catch{
      this.toastr.error('No se pudo cargar la sucursal, intente nuevamente', 'Error')*/
    
  }
  addLocalidad(nombre_localidad: string , id:string){
    if(nombre_localidad == ''){
      this.toastr.error('El nombre de la localidad debe estar completo')
      return 
    }
    try{
      this.localidadService.addLocalidad(nombre_localidad, parseInt(id)).subscribe(response => this.objetos = response)
      this.toastr.success('Localidad cargada correctamente', 'Localidad Cargada')
    }catch{
      this.toastr.error('No se pudo cargar la localidad, intente nuevamente', 'Error')
    }
  }
  
  botoncito(id_del_equipo: string){
    this.equipo = id_del_equipo
  }

  botoncito2(id_del_equipo: string){
    this.equipo2 = id_del_equipo
  }

  actualizarPartido(id_partido:string, id_equipo1:string, id_equipo2:string, fecha_partidos:string){
    if(id_equipo1 == '' || id_equipo2 == '' || fecha_partidos == ''){
      this.toastr.error('Todos lo campos son obligatorios', 'Error')
      return
    }
    if(id_equipo1 == id_equipo2){
      this.toastr.error('Un mismo equipo no puede estar registrado 2 veces en un mismo partido', 'Error')
      return
    }
    if(this.validarFecha(fecha_partidos) == false){
      this.toastr.error('La feche debe ser mayor a la actual', 'Error')
      return
    } 
    this.partidoService.modPartidoEquipos(id_partido, parseInt(id_equipo1), parseInt(id_equipo2), fecha_partidos).subscribe(response => this.objetos = response)
    location.reload()
  }

  validarFecha(fechas:string){
    const fecha = new Date(fechas)
    const fecha_actual = new Date()
    if(fecha < fecha_actual){
      return false
    }
    return true
  }

  ganadorPartido(id_partido:string, equipoGanador:string){
    this.partidoService.actualizarGanador(id_partido, equipoGanador).subscribe(response => this.objetos = response)
    location.reload()
  }

  mostrarLocalidades(id: string){
    this.localidadService.getLocalidades().subscribe(response => this.localidades = response.data)
    this.localidad = id.toString()
    
}
mostrarAdmins(id: string){
  this.service.getAdmins().subscribe(response => this.admins = response.data)
  this.admin = id.toString()
}
mostrarSucursales(id: string){
  this.sucursalService.getSucursales().subscribe(response => this.sucursales = response.data)
  this.sucursal = id.toString()
}
mostrarEstadoTorneos(id: string){
  this.estadoTorneoService.getEstados().subscribe(response => this.estado_torneos = response.data)
  this.estado_torneo = id.toString()
}
mostrarFormatoTorneos(id: string){
  this.formatoService.getFormatos().subscribe(response => this.formato_torneos = response.data)
  this.formato_torneo = id.toString()


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
  