import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { AutoresService } from 'src/app/services/autores.service';

@Component({
  selector: 'app-crud-autores',
  templateUrl: './crud-autores.component.html',
  styleUrls: ['./crud-autores.component.css']
})
export class CrudAutoresComponent implements OnInit {
  autoresIds: string[] = [];
  autoresData: { [key: string]: { nombreCompleto: string | undefined, perfil: string | undefined, info: string | undefined } } = {};

  constructor(private autoresService: AutoresService) { }

  ngOnInit() {
    this.autoresService.getAutoresIds().subscribe((autoresIds: string[]) => {
      this.autoresIds = autoresIds;
      console.log('Autores IDs:', autoresIds);

      const requests = autoresIds.map(id =>
        forkJoin({
          nombreCompleto: this.autoresService.getNombreCompleto(id),
          perfil: this.autoresService.getPerfil(id),
          info: this.autoresService.getInfo(id)
        }).pipe(map(({ nombreCompleto, perfil, info }) => ({ id, nombreCompleto, perfil, info })))
      );

      forkJoin(requests).subscribe((autores) => {
        console.log('Autores Data:', autores);
        autores.forEach(autor => {
          this.autoresData[autor.id] = { nombreCompleto: autor.nombreCompleto, perfil: autor.perfil, info: autor.info };
        });
      });
    });
  }

  eliminarAutor(autorId: string): void {
    if (confirm('¿Está seguro de que desea eliminar este autor?')) {
      this.autoresService.eliminarAutor(autorId).subscribe(
        () => {
          console.log('Autor eliminado con éxito');
          location.reload();
        },
        (error) => {
          console.error('Error al eliminar el autor', error);
        }
      );
    }
  }

}
