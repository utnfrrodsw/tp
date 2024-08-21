import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TipoVolquete } from '../../model/interfaces/tipo_volquete.interface.js';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})


export class DatosTipoVolqueteService {
  url:string;

  constructor(private _http:HttpClient) { 
    this.url="http://localhost:8080/restExample/api/locale";
  }
 
  getTipoVolquete(id:string,descripcion:string): Observable<TipoVolquete>
  {
    //return this._http.get<Locales[]>(this.url);     
    if (!id || id.trim()=="")
      id="%"; 
    if (!descripcion || descripcion.trim() == '')
      descripcion = '%'; 
    id=encodeURI(id.trim());
    descripcion = encodeURI(descripcion.trim());
    console.log('Codigo: ' + id + ' Nombre: ' + descripcion);
    
    return this._http.get<TipoVolquete>(
      this.url + '/' + id + '/' + descripcion
    );          
  }

  introducirTipoVolquete(tipoVolquete:TipoVolquete ): Observable<any>
  {    
    return this._http.post(this.url,tipoVolquete,httpOptions);
  }

  borrarTipoVolquete(id:string)
  {
    id=encodeURI(id.trim());
    return this._http.delete(this.url+"/"+id);
  }
  
  editarTipoVolquete(tipoVolquete:TipoVolquete)
  {
    console.log('-id: ' + tipoVolquete.id_tipo_volquete);
    console.log('*Codigo local: ' + tipoVolquete.id_tipo_volquete);
    return this._http.put(
      this.url + '/' + tipoVolquete.id_tipo_volquete,
      tipoVolquete,
      httpOptions
    );
  }
}

