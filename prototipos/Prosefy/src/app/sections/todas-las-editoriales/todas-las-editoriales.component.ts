import { Component, OnInit } from '@angular/core';
import { EditorialesService, Editorial } from '../../services/editoriales.service';

@Component({
  selector: 'app-todas-las-editoriales',
  templateUrl: './todas-las-editoriales.component.html',
  styleUrls: ['./todas-las-editoriales.component.css']
})
export class TodasLasEditorialesComponent implements OnInit {
  editorialesIds: string[] = [];
  editorialesData: { [key: string]: { descripcion: string | undefined, imagen: string | undefined } } = {};
  currentPage = 1;
  itemsPerPage = 12;
  isHovered = false;
  public editoriales: Editorial[] = [];

  constructor(private editorialesService: EditorialesService) { }

  ngOnInit(): void {
    this.editorialesService.getEditorialesIds().subscribe(
      (editorialesIds: string[]) => {
        this.editorialesIds = editorialesIds;

        Promise.all(this.editorialesIds.map(id =>
          new Promise<void>((resolve) => {
            this.editorialesService.getDescripcion(id).subscribe(
              (descripcion) => {
                this.editorialesData[id] = { descripcion: descripcion, imagen: '' };
                resolve();
              },
              (error) => {
                console.error(`Error al obtener la descripción de la editorial ${id}`, error);
                resolve();
              }
            );
          })
        )).then(() => {
          Promise.all(this.editorialesIds.map(id =>
            new Promise<void>((resolve) => {
              this.editorialesService.getImagen(id).subscribe(
                (imagen) => {
                  if (this.editorialesData[id]) {
                    this.editorialesData[id].imagen = imagen;
                  }
                  resolve();
                },
                (error) => {
                  console.error(`Error al obtener la imagen de la editorial ${id}`, error);
                  resolve();
                }
              );
            })
          ));
        });
      },
      (error) => {
        console.error('Error al obtener IDs editoriales', error);
      }
    );
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
  }

  get totalPages(): number {
    return Math.ceil(this.editorialesIds.length / this.itemsPerPage);
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }
}
