import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  readonly baseUrl = 'http://localhost:3000/api/'

  constructor(private http: HttpClient) { }

  getPartidos() {
    const url = this.baseUrl + 'partidos'
    return this.http.get<any>(url)
  }

  getOnePartido(id:string){
    const url = this.baseUrl + 'partidos/' + id
    return this.http.get<any>(url)
  }

  remove(id:string){
    const url = this.baseUrl + 'partidos/' + id
    return this.http.delete<any>(url)
  }

  add(fecha: string, torneo: string, equipo1: string, equipo2: string, id: number) {
    const url = this.baseUrl + 'partidos'
    const data = { fecha, torneo, equipo1, equipo2, id }
    return this.http.post<any>(url, data)
  }

  modPartido(fecha: string, torneo: string, equipo1: string, equipo2: string, id: number){
    const url = this.baseUrl + 'partidos/' + id
    const data = { fecha, torneo, equipo1, equipo2, id }
    return this.http.put<any>(url, data)
  }

  addPartidosTorneo(id_torneo: number, E_formato_torneo: any){
    const cant_partidos = E_formato_torneo.data.cant_partidos
    const requests = []
    for (let i=0; i < cant_partidos; i++){
      console.log('entra al for')
      const url = this.baseUrl + 'partidos'
      const data = { torneo: id_torneo }
      requests.push(this.http.post<any>(url, data))
    }
    return forkJoin(requests)
  }

  modPartidoEquipos(id_partido:string, id_equipo1:number, id_equipo2:number, fecha_partidos:string){
    const url = this.baseUrl + 'partidos/' + id_partido
    const data = { equipos: [id_equipo1, id_equipo2], fecha: fecha_partidos }
    return this.http.patch<any>(url, data)
  }

  actualizarGanador(id_partido:string, equipoGanador:string){
    const url = this.baseUrl + 'partidos/' + id_partido
    const data = { ganador: equipoGanador}
    return this.http.patch<any>(url, data)
  }
}

