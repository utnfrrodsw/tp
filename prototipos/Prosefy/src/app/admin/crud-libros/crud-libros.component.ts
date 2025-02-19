import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibrosService, Libro } from '../../services/libros.service';
import { AutoresService } from '../../services/autores.service';
import { CategoriasService } from '../../services/categorias.service';
import { EditorialesService } from '../../services/editoriales.service';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { switchMap, map, of } from 'rxjs';
import { FormatosService } from 'src/app/services/formatos.service';
import { combineLatest, catchError } from 'rxjs';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud-libros',
  templateUrl: './crud-libros.component.html',
  styleUrls: ['./crud-libros.component.css']
})
export class CrudLibrosComponent implements OnInit {
  librosIds: string[] = [];
  librosData: any = {};
  LibroForm: FormGroup;
  EditLibroForm: FormGroup;
  autores: any[] = [];
  categorias: any[] = [];
  editoriales: any[] = [];
  formatos: any[] = [];
  isPopupOpen: boolean = false;
  isEditPopupOpen: boolean = false;
  editingLibroId: string | null = null;
  showErrorMessages: boolean = false;
  errorMessage: string = '';

  constructor(
    private librosService: LibrosService,
    private autoresService: AutoresService,
    private categoriasService: CategoriasService,
    private editorialesService: EditorialesService,
    private formatosService: FormatosService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.LibroForm = this.formBuilder.group({
      isbn: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      idioma: ['', [Validators.required]],
      descripcion: [''],
      precio: ['', [Validators.required, Validators.min(0)]],
      fecha_edicion: ['', [Validators.required]],
      autores: [[]],
      editorial: ['', [Validators.required]],
      categorias: [[]],
      formatos: [[]],
      portada: ['', [Validators.required]],
      calificacion: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });

    this.EditLibroForm = this.formBuilder.group({
      editIsbn: ['', [Validators.required]],
      editTitulo: ['', [Validators.required]],
      editIdioma: ['', [Validators.required]],
      editDescripcion: [''],
      editPrecio: ['', [Validators.required, Validators.min(0)]],
      editFechaEdicion: ['', [Validators.required]],
      editAutores: [[]],
      editEditorial: ['', [Validators.required]],
      editCategorias: [[]],
      editFormatos: [[]],
      editPortada: ['', [Validators.required]],
      editCalificacion: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit() {
    this.librosService.getLibrosIds().pipe(
      switchMap((librosIds: string[]) => {
        this.librosIds = librosIds;
        const requests = librosIds.map(id =>
          this.librosService.getLibro(id).pipe(
            map(libro => ({ id, libro })),
            catchError(error => {
              console.error(`Error obteniendo datos del libro con ID ${id}: ${error}`);
              return of({ id, libro: null });
            })
          )
        );
        return combineLatest(requests);
      })
    ).subscribe((libros) => {
      libros.forEach(({ id, libro }) => {
        if (libro) {
          this.librosData[id] = libro;
        }
      });
      this.loadInitialData(); // Cargar datos adicionales
    });
  }

  loadInitialData() {
    forkJoin({
      autores: this.autoresService.getAutores(),
      categorias: this.categoriasService.getCategorias(),
      editoriales: this.editorialesService.getEditoriales(),
      formatos: this.formatosService.getFormatos()
    }).subscribe(
      ({ autores, categorias, editoriales, formatos }) => {
        // Validar que los datos sean arrays antes de usar .map()
        this.autores = Array.isArray(autores)
          ? autores.map((autor: any) => ({ id: autor._id, nombre: autor.nombreCompleto }))
          : [];

        this.categorias = categorias?.data && Array.isArray(categorias.data)
          ? categorias.data.map((categoria: any) => ({ id: categoria._id, descripcion: categoria.descripcion }))
          : [];

        this.editoriales = Array.isArray(editoriales)
          ? editoriales.map((editorial: any) => ({ id: editorial._id, descripcion: editorial.descripcion }))
          : [];

        this.formatos = Array.isArray(formatos)
          ? formatos.map((formato: any) => ({ id: formato._id, descripcion: formato.descripcion }))
          : [];
      },
      (error) => {
        console.error('Error al cargar datos iniciales:', error);
      }
    );
  }

  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  openEditPopup(libroId: string): void {
    console.log('Abriendo modal de edición para libro ID:', libroId);
    this.editingLibroId = libroId;
    this.isEditPopupOpen = true;

    const libro = this.librosData[libroId];
    if (libro) {
      this.EditLibroForm.patchValue({
        editIsbn: libro.isbn,
        editTitulo: libro.titulo,
        editIdioma: libro.idioma,
        editDescripcion: libro.descripcion,
        editPrecio: libro.precio,
        editFechaEdicion: libro.fecha_edicion,
        editAutores: libro.autores,
        editEditorial: libro.editorial,
        editCategorias: libro.categorias,
        editFormatos: libro.formatos,
        editPortada: libro.portada,
        editCalificacion: libro.calificacion
      });
    }
  }

  closeEditPopup(): void {
    console.log('Cerrando modal de edición');
    this.isEditPopupOpen = false;
  }

  registrarLibro(): void {
    this.showErrorMessages = true;
    if (this.LibroForm.valid) {
      const nuevoLibro = this.LibroForm.value;
      this.librosService.registrarLibro(nuevoLibro).subscribe(() => {
        location.reload();
      });
    }
  }

  actualizarLibro(): void {
    if (this.EditLibroForm.valid && this.editingLibroId) {
      const nuevoTitulo = this.EditLibroForm.value.editTitulo;
      const nuevaDescripcion = this.EditLibroForm.value.editDescripcion;
      const nuevoIsbn = this.EditLibroForm.value.editIsbn;
      const nuevoIdioma = this.EditLibroForm.value.editIdioma;
      const nuevoPrecio = this.EditLibroForm.value.editPrecio;
      const nuevaFechaEdicion = this.EditLibroForm.value.editFechaEdicion;
      const nuevosAutores = this.EditLibroForm.value.editAutores;
      const nuevaEditorial = this.EditLibroForm.value.editEditorial;
      const nuevasCategorias = this.EditLibroForm.value.editCategorias;
      const nuevosFormatos = this.EditLibroForm.value.editFormatos;
      const nuevaPortada = this.EditLibroForm.value.editPortada;
      const nuevaCalificacion = this.EditLibroForm.value.editCalificacion;

      const libroActualizado: Libro = {
        _id: this.editingLibroId,
        isbn: nuevoIsbn,
        titulo: nuevoTitulo,
        idioma: nuevoIdioma,
        descripcion: nuevaDescripcion,
        precio: nuevoPrecio,
        fecha_edicion: nuevaFechaEdicion,
        autores: nuevosAutores,
        editorial: nuevaEditorial,
        categorias: nuevasCategorias,
        formatos: nuevosFormatos,
        portada: nuevaPortada,
        calificacion: nuevaCalificacion
      };

      this.librosService.actualizarLibro(this.editingLibroId, libroActualizado).subscribe({
        next: (response) => {
          console.log('Actualización exitosa', response);
          this.closeEditPopup();
          location.reload();
        },
        error: (error) => {
          console.error('Error al actualizar el libro', error);
        },
      });
    }
  }

  eliminarLibro(libroId: string): void {
    if (confirm('¿Está seguro de que desea eliminar este libro?')) {
      this.librosService.eliminarLibro(libroId).subscribe(
        () => {
          console.log('Libro eliminado con éxito');
          location.reload();
        },
        (error) => {
          console.error('Error al eliminar el libro', error);
        }
      );
    }
  }

  formatearFecha(fecha: Date | string | undefined): string {
    if (fecha) {
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      if (fechaObj instanceof Date) {
        const fechaFormateada = this.datePipe.transform(fechaObj, 'dd/MM/yyyy', 'es');
        if (fechaFormateada) {
          return fechaFormateada;
        }
      }
    }
    return 'N/A';
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.LibroForm.get(fieldName);
    return !!control?.hasError(errorType) && !!control?.touched;
  }

  selectedFormatos: string[] = [];

  onFormatoChange(event: any): void {
    const formatoId = event.target.value;
    if (event.target.checked) {
      this.selectedFormatos.push(formatoId);
    } else {
      this.selectedFormatos = this.selectedFormatos.filter(id => id !== formatoId);
    }
    this.LibroForm.get('formatos')?.setValue(this.selectedFormatos);
  }

  isFormatoSelected(formatoId: string): boolean {
    return this.selectedFormatos.includes(formatoId);
  }

}
