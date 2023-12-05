import { Component, OnInit } from '@angular/core';
import { Permiso } from '../servicios/permiso.service';
import { UsuarioActualService } from '../servicios/usuario-actual.service';
import {Router} from "@angular/router";
import { Usuario, UsuarioService as UsuariosService,Amistad,EstadosAmistades } from '../servicios/usuario.service';
import { TokensService } from '../servicios/tokens.service';
import { UsuarioDetalladoService } from '../servicios/usuario-detallado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

	LARGO_MINIMO_CONTRASENIA=8;
	LARGO_MINIMO_NOMBRE_USUARIO=2;
	LARGO_MINIMO_NOMBRE_COMPLETO=5;
	CANTIDAD_MAXIMA_TOKENS_GENERADOS=100000;

  usuarioActual:Usuario={} as Usuario;
  
  // TODO Refactor: DRY
  // TODO Refactor: sort
  get amigosEntrantes() {
    return (this.usuarioActual?.amigos??[]).filter(ami=> ami.amistades.estado=='esperando' && ami.amistades.amigoID==this.usuarioActual.ID);
  }
  get amigosSalientes() {
    return (this.usuarioActual?.amigos??[]).filter(ami=> ami.amistades.estado=='esperando' && ami.amistades.amigoID!=this.usuarioActual.ID);
  }
  get amigosReales() {
    return (this.usuarioActual?.amigos??[]).filter(ami=> ami.amistades.estado!='esperando');
  }

  puedeGenerarTokens:boolean = false;
  puedeAdministrarUsuarios:boolean = false;
  tokensCirculando:number = 0;
  
  console=console;

  busquedaID=0;
  usuariosEncontrados:Usuario[] = [];
  puedeMostrarVacio=false;
  get mostrarVacio(){
    return this.puedeMostrarVacio && this.usuariosEncontrados.length==0;
  }

  amigoSeleccionadoID=0;

  usuariosPaginaActual:Usuario[] = [];
  cantidadPaginas:number=0;
  paginaActual:number=1;
  filtroDePaginacion:string='';
  IDPeticion:number=0;

  constructor(
    private usuarioActualService:UsuarioActualService,
    private usuarioDetalladoService:UsuarioDetalladoService,
    private usuariosService: UsuariosService,
    private tokensService: TokensService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.usuarioActualService.getUsuarioActual()
      .subscribe({
        next:(usuario:any) => {
          this.usuarioActual= usuario as Usuario;

          /* * Cada Usuario.amigos tiene un .amistad con los detalles de la invitación; estado y quien la mando */

          this.puedeGenerarTokens=this.usuarioActual.permisos?.some((per:Permiso)=>per.ID==1) || false;
          if(this.puedeGenerarTokens)
            this.tokensService
              .obtenerCantidadCirculando()
              .subscribe((result: any)=>{
                this.tokensCirculando=result;
              });

          this.puedeAdministrarUsuarios=this.usuarioActual.permisos?.some((per:Permiso)=>per.ID==2) || false;
          if(this.puedeAdministrarUsuarios){
            this.usuariosService.getCantidadDePaginas('')
              .subscribe((cantidadDePaginas: any)=>{
                  this.cantidadPaginas=cantidadDePaginas;
                })

            // TODO ver si puedo hacer algo mejor que esto ''
            this.usuariosService.getUsuariosPagina('',1)
              .subscribe((result: any)=>{
                this.usuariosPaginaActual=result;
              });
          }
        }
        ,error:error=>{
          this.router.navigate(['/'])
        }
      });
  }

  busqueda(e:Event):void{

    // TODO Feature: lo que sea que diga este comentario
    /* Estados de la búsqueda:
    Esperando entrada del usuario (inicial)
      ❌ Hoy es this.mostrarVacío=false y this.usuariosEncontrados vacío, y es literalmente nada. Podría ser una llamada a la acción.
    Buscando (cargando)
      ❌ Falta. Hoy es igual al inicial
    Repuesta positiva, listado de gente
      ✔ Caracterizado por usuariosEncontrados con gente
    Respuesta negativa, vacío, mensaje
      ✔ this.mostrarVacío=false y this.usuariosEncontrados vacío
     */

    let busquedaID=++this.busquedaID;

    let consulta=(e.target as HTMLInputElement).value.trim();

      this.puedeMostrarVacio=false;

    if(consulta.length>3)
      this.usuariosService
        .buscarDifusamentePorNombre(consulta)
        .subscribe((result: any)=>{
          if(this.busquedaID==busquedaID){
            // ! Ya vienen filtrados por habilitados.
            this.usuariosEncontrados=result;
            if(result.length==0){
              this.puedeMostrarVacio=true;
            }
          }
        });
    else{
      this.usuariosEncontrados=[];
    }
  }

  invitar(e:Event):void {
    e.preventDefault();

    let usuarioID=(e.target as any)['usuarioID'].value;

    (document.getElementById('resultados') as HTMLFieldSetElement).disabled=true;
    this.usuariosService
      .invitar(usuarioID)
      .subscribe({
        next:(result: any)=>{
          let indice:number =this.usuariosEncontrados.findIndex(usu=>usu.ID==usuarioID);
          let nuevoAmigo:Usuario= this.usuariosEncontrados[indice] as Usuario;
          this.toastr.success(`¡Invitación enviada a ${nuevoAmigo.nombreCompleto}!`);
          nuevoAmigo.amistades=({estado:'esperando',amigoID:usuarioID}) as Amistad;
          // TODO Feature: Si esto es real, y puede pasar, ¿no deberíamos corregirlo, en un paso como este? Guardar resultado de la investigación en un comentario
          this.usuarioActual.amigos?.push(nuevoAmigo as Usuario);
          
          this.usuariosEncontrados.splice(indice, 1);
        }
        ,error:error=>{
          this.console.log(error);
        }
        ,complete:()=>{
          (document.getElementById('resultados') as HTMLFieldSetElement).disabled=false;
        }
      })

  }

  cancelar(e:Event):void{
    e.preventDefault();

    let usuarioID=(e.target as any)['usuarioID'].value;

    this.usuariosService
      .eliminarInvitacion(usuarioID,true)
      .subscribe({
        next:(result: any)=>{
          if(this.usuarioActual.amigos){
            let indice:number =this.usuarioActual.amigos.findIndex(usu=>usu.ID==usuarioID);
            this.toastr.success(`Invitación a ${this.usuarioActual.amigos[indice].nombreCompleto} eliminada.`);
            this.usuarioActual.amigos.splice(indice, 1);
          }else{
            this.console.log('Error al cancelar invitación. ¿No hay amigos?')
          }
        }
        ,error:error=>{
          this.console.log(error);
        }
      })
  }

  responder(e:Event):void{
    e.preventDefault();

    let usuarioID=(e.target as any)['usuarioID'].value;
    let botonApretado=(e.target as any)['accion'];

    if(+botonApretado.value)
      this.usuariosService
        .aceptarInvitacion(usuarioID)
        .subscribe({
          next:(amigo: any)=>{
            if(this.usuarioActual.amigos){
              let amigoNuevo=this.usuarioActual.amigos.find(ami=>ami.ID==usuarioID) as Usuario;
              amigoNuevo.amistades.estado=EstadosAmistades.Amigos
              // TODO Feature: Ver si esto realmente anda: /* 'amigos' */; //delet, Ig
              this.toastr.success(`¡Ahora vos y ${amigoNuevo.nombreCompleto} son amigos!`);
            }else this.console.log('Error al responder positivamente a una invitación. ¿No hay amigos?');

            return;
          }
          ,error:error=>{
            this.console.log(error);
          }
        });
    else this.usuariosService
      .eliminarInvitacion(usuarioID,false)
      .subscribe({
        next:(result: any)=>{
          if(this.usuarioActual.amigos){
            let indice:number =this.usuarioActual.amigos.findIndex(usu=>usu.ID==usuarioID);
            this.toastr.success(`Invitación de ${this.usuarioActual.amigos[indice].nombreCompleto} eliminada.`);
            this.usuarioActual.amigos.splice(indice, 1);
          }else this.console.log('Error al eliminar invitación. ¿No hay amigos?');
        }
        ,error:error=>{
          this.console.log(error);
        }
      });
  }

  eliminar(e:Event):void{
    e.preventDefault();

    // TODO Feature: Avisar que es no se puede deshacer
    let usuarioID=(e.target as any)['usuarioID'].value;
    this.usuariosService
      .eliminarAmigo(usuarioID)
      .subscribe({
        next:(result: any)=>{
          if(this.usuarioActual.amigos){
            let indice:number =this.usuarioActual.amigos.findIndex(usu=>usu.ID==usuarioID);
            this.toastr.success(`${this.usuarioActual.amigos[indice].nombreCompleto} ya no es tu amigo.`);
            this.usuarioActual.amigos.splice(indice, 1);
          }else this.console.log('Error al eliminar un amigo. ¿No hay array amigos?');
        }
        ,error:error=>{
          this.console.log(error);
        }
      });
  }

  generarTokens(e:Event):void{
    e.preventDefault();

    // TODO por que no anda as number
    let cantidad=+((e.target as any)['form-generar-cantidad'].value);
    this.tokensService
      .generar(cantidad)
      .subscribe({
        next:()=>{
          this.toastr.success(`Se han generado ${cantidad} tokens, y se agregaron a tu cuenta.`);
          this.tokensCirculando+=cantidad;
          this.usuarioActual.tokens+=cantidad;
        }
        ,error:error=>{
          this.console.log(error);
        }
      });
  }

  // TODO Refactor: Seguro puede volar esto...
  asignarNombreABoton(e:Event):void{
    (e.target as HTMLInputElement).name='accion';
  }

  salir(){
    this.usuariosService
      .salir()
      .subscribe({
        next:()=>{
          this.router.navigate(['/'])
        }
      })
  }

  // TODO Refactor: Queda feo... quitar?
  actualizarAmigoSeleccionadoID(e:Event){
    this.amigoSeleccionadoID=+(e.target as HTMLInputElement).value;
  }

  enviarTokens(e:Event){
    e.preventDefault();
    
    let cantidad=+((e.target as any)['form-enviar-cantidad'].value)
      ,amigoID=+((e.target as any)['form-enviar-usuario'].value)
      ,boton:HTMLInputElement=(e.target as any)['form-enviar-submit'];
    boton.disabled=true;
    this.tokensService.enviar(cantidad,amigoID).subscribe({
      next:()=>{
        // TODO reiniciar formulario
        this.toastr.success('¡Se han enviado los tokens exitosamente!');
        this.usuarioActual.tokens-=cantidad;
      }
      ,error:error=>{
        this.console.log(error);
      }
      ,complete:()=>{
        boton.disabled=false;
      }
    })
  }

  crearUsuario(e:Event){
    e.preventDefault();
    
    let fD:FormData = new FormData(e.target as HTMLFormElement);

    let u: Usuario=(((Object.fromEntries(fD))) as unknown) as Usuario;
    u.permisos=fD.getAll('permisoID').map(permisoID => ({ID:permisoID}) as unknown as Permiso)

    // TODO Feature: que funcione bien  ??? anda bien qué decís
    this.usuariosService
      .create(u)
      .subscribe((result:any)=>{
        this.toastr.success(`El usuario se creó exitosamente.`);
      });
  }

  // TODO Feature: (en realidad creo que es más Refactor) ver si esta tabla de actualizar permisos puede ser un componente hijo, como dijo Butti

  actualizarPermisos(e:Event) {
    e.preventDefault();
    
    let fd=new FormData(e.target as HTMLFormElement);
    let nuevoVectorPermisos:Permiso[]=fd.getAll('permiso').map((e:FormDataEntryValue)=>(({ID:((e as any) as number)}) as Permiso));
    let usuarioID:number = fd.get('usuario-id') as any as number;
    // TODO Refactor: as any as BASTA

    this.usuariosService
      .actualizarPermisos(usuarioID,nuevoVectorPermisos)
      .subscribe({
        next:(result: any)=>{
          ((e.target as HTMLElement).closest('TR') as HTMLElement).dataset['sucio']='0';
          // TODO UX: Considerar si hace falta el cartel de éxito en ciertos casos, como este; que tienen una respuesta muy clara.
          this.toastr.success(`Permisos del usuario ${this.usuariosPaginaActual.find(usu=>usu.ID==usuarioID)?.nombreCompleto} actualizados.`);
        }
        ,error:error=>{
          this.console.log(error);
        }
      })

    return false;
  }

  // TODO Refactor: private? Maybe esa es la solución al tema de las funcioncitas helper
  nuevaIDPeticion():Number{
    return ++this.IDPeticion;
  }

  actualizarFiltroTablaAdministracion(e:Event) {
    this.filtroDePaginacion=(e.target as HTMLInputElement).value.trim();
    let nuevaID:Number=this.nuevaIDPeticion();
    // TODO Refactor: hacer alguna reacción o DRY con el primero.
    this.usuariosService.getCantidadDePaginas(this.filtroDePaginacion)
      .subscribe((cantidadDePaginas: any)=>{
        if(this.IDPeticion==nuevaID) {
          this.cantidadPaginas=cantidadDePaginas;
        }
      });
    this.actualizarTablaAdministracion(nuevaID);
  }

  navegar(e:Event){
    e.preventDefault();

    if(!(e.target instanceof HTMLInputElement))
      return
  
  // TODO UX: disable stuff on send and such.
    this.paginaActual+= +(e.target as HTMLInputElement).value;
    this.actualizarTablaAdministracion();
  }

  actualizarTablaAdministracion(nuevaID:Number|null=null){
    if(!nuevaID){
      nuevaID=this.nuevaIDPeticion();
    }
    // TODO UX: deshabilitar formulario de navegacion y mostrar que se está actualizando
    this.usuariosService.getUsuariosPagina(this.filtroDePaginacion,this.paginaActual)
      .subscribe((data:any) =>{
        if(this.IDPeticion==nuevaID) {
          this.usuariosPaginaActual=data;
        }
      });
  }

// TODO Refactor: privada
  usuarioTienePermiso(usu:Usuario,perID:number){
    return usu.permisos?.some(p=>p.ID==perID) || false;
  }
  
  establecerUsuarioADetallar(e:Event){
    let usuarioADetallarID:any=((<HTMLElement>e.target).dataset['id']);
    if(usuarioADetallarID){
      usuarioADetallarID=parseInt(usuarioADetallarID);
      let usuarioADetallar=this.usuariosPaginaActual.find(usu=>usu.ID==usuarioADetallarID);
      if(usuarioADetallar){
        this.usuarioDetalladoService.setUsuarioDetallado(usuarioADetallar);
      }
    }
  }

  ERRORES_DE_CONTRASENIA=[
    'Los campos no deben estar vacíos.'
    ,'La contraseña debe tener más de '+this.LARGO_MINIMO_CONTRASENIA+' caracteres.'
    ,'Las contraseñas deben coincidir.'
  ];

  verificarCamposContrasenia(e:Event, form:HTMLFormElement){
    e.preventDefault();
    
    let fD:FormData = new FormData(form);

    let contrasenia=(<String>fD.get('contrasenia')).trim();
    let contraseniaRepetida=(<String>fD.get('contrasenia-repetida')).trim();

    let error='-1'

    switch (true){
    case (!contrasenia || !contraseniaRepetida):
      error='0'
      break;
    case contrasenia.length<this.LARGO_MINIMO_CONTRASENIA:
      error='1'
      break;
    case contrasenia!=contraseniaRepetida:
      error='2'
      break;
    }

    // TODO Refactor: Meter directamente el error, disable= error!=''
    form.dataset['puedeEnviar']=error;
  }

  enviarActualizacionDeDatos(e:Event){
    e.preventDefault();

    let form=<HTMLFormElement>e.target;
    let fd=new FormData(form);
    let dato:string=[...fd.keys()][0];
    let valor=<string>fd.get(dato);
    form.dataset['enviando']='1';
    this.usuariosService.actualizarDatos(
      this.usuarioActual.ID
      ,dato
      ,valor
    )
      .subscribe((result: any)=>{
        let datoMensaje;

        switch(dato){
        case 'nombreCompleto':
          // TODO Feature: Permitir these two si es admin
        // case 'DNI':
        // case 'nombreUsuario':
          this.usuarioActual.nombreCompleto=valor;
          datoMensaje='Nombre completo';
          break;
        case 'correo':
          this.usuarioActual.correo=valor;
          datoMensaje='Correo';
          break;
        }

        form.dataset['sucio']='0';
        form.dataset['enviando']='0';

        this.toastr.success(`${datoMensaje} actualizado.`);
      });
      ;
  }
}
