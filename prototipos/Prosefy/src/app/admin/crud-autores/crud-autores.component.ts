import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { AutoresService, Autor, autorResponse } from 'src/app/services/autores.service';

@Component({
  selector: 'app-crud-autores',
  templateUrl: './crud-autores.component.html',
  styleUrls: ['./crud-autores.component.css']
})
export class CrudAutoresComponent implements OnInit {
  autoresIds: string[] = [];
  autoresData: { [key: string]: { nombreCompleto: string | undefined, perfil: string | undefined, info: string | undefined } } = {};
  AutorForm: FormGroup;
  EditAutorForm: FormGroup;
  showErrorMessages: boolean = false;
  isPopupOpen: boolean = false;
  isEditPopupOpen: boolean = false;
  modalMessage: string = '';
  showRedirectButton: boolean = false;
  errorMessage: string = '';
  editingAutorId: string | null = null;

  constructor(private autoresService: AutoresService, private formBuilder: FormBuilder) {
    // Inicializa el formulario de creación
    this.AutorForm = this.formBuilder.group({
      nombreCompleto: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,'.]+$/),
        ],
      ],
      perfil: [
        '',
        [
          Validators.required,
        ],
      ],
      info: [
        '',
        [
          Validators.required,
          Validators.pattern(/.+/),
        ],
      ],
    });

    // Inicializa el formulario de edición
    this.EditAutorForm = this.formBuilder.group({
      editNombreCompleto: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚ\s,'.]+$/),
        ],
      ],
      editPerfil: [
        '',
        [
          Validators.required,
        ],
      ],
      editInfo: [
        '',
        [
          Validators.required,
          Validators.pattern(/.+/),
        ],
      ],
    });
  }

  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  openEditPopup(autorId: string): void {
    this.editingAutorId = autorId;
    this.isEditPopupOpen = true;

    // Llena el formulario de edición con los datos actuales del autor
    const autor = this.autoresData[autorId];
    if (autor) {
      this.EditAutorForm.patchValue({
        editNombreCompleto: autor.nombreCompleto,
        editPerfil: autor.perfil,
        editInfo: autor.info
      });
    }
  }

  closeEditPopup(): void {
    this.isEditPopupOpen = false;
  }

  ngOnInit() {
    this.autoresService.getAutoresIds().subscribe((autoresIds: string[]) => {
      this.autoresIds = autoresIds;

      const requests = autoresIds.map(id =>
        forkJoin({
          nombreCompleto: this.autoresService.getNombreCompleto(id),
          perfil: this.autoresService.getPerfil(id),
          info: this.autoresService.getInfo(id)
        }).pipe(map(({ nombreCompleto, perfil, info }) => ({ id, nombreCompleto, perfil, info })))
      );

      forkJoin(requests).subscribe((autores) => {
        autores.forEach(autor => {
          this.autoresData[autor.id] = { nombreCompleto: autor.nombreCompleto, perfil: autor.perfil, info: autor.info };
        });
      });
    });
  }

  registrarAutor(): void {
    console.log('Intentando registrar autor');
    this.showErrorMessages = true;

    if (this.AutorForm.valid) {
      const nombreCompletoControl = this.AutorForm.get('nombreCompleto');
      const perfilControl = this.AutorForm.get('perfil');
      const infoControl = this.AutorForm.get('info');

      if (!nombreCompletoControl || !perfilControl || !infoControl) {
        return;
      }

      const nombreCompleto = nombreCompletoControl.value;
      const perfil = perfilControl.value;
      const info = infoControl.value;

      // Reiniciar errores
      nombreCompletoControl.setErrors(null);
      perfilControl.setErrors(null);
      infoControl.setErrors(null);

      // Validar si el autor ya existe antes de realizar el registro
      this.autoresService.validarAutorExistente(nombreCompleto).subscribe({
        next: (autorExistente) => {
          if (autorExistente !== null) {
            nombreCompletoControl.setErrors({ autorExistente: true });
            this.errorMessage = 'El nombre completo del autor ya está en uso. Por favor, intente con otro.';
          } else {
            this.errorMessage = ''; // Limpiar el mensaje de error si no hay error específico
            this.realizarRegistro();
          }
        },
        error: (error) => {
          console.error('Error al validar el autor', error);

          if (error && error.error && error.error.mensaje) {
            this.errorMessage = error.error.mensaje;
          } else {
            this.errorMessage = 'Error desconocido en el registro';
          }
        }
      });
    }
  }

  private realizarRegistro(): void {
    const autor: Autor = {
      nombreCompleto: this.AutorForm.value.nombreCompleto,
      perfil: this.AutorForm.value.perfil,
      info: this.AutorForm.value.info,
    };

    this.autoresService.registrarAutor(autor).subscribe(
      (response: autorResponse) => {
        console.log('Registro exitoso', response);
        this.closePopup();
        location.reload();
      },
      (error) => {
        console.error('Error al registrar el autor', error);

        if (error && error.error && error.error.mensaje) {
          console.error('Detalles del error:', error.error.mensaje);
        } else {
          console.error('Error desconocido en el registro');
          const errorMessage = 'Error desconocido en el registro';
        }
      }
    );
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

  actualizarAutor(): void {
    if (this.EditAutorForm.valid && this.editingAutorId) {
      const editNombreCompletoControl = this.EditAutorForm.get('editNombreCompleto');
      const editPerfilControl = this.EditAutorForm.get('editPerfil');
      const editInfoControl = this.EditAutorForm.get('editInfo');

      if (!editNombreCompletoControl || !editPerfilControl || !editInfoControl) {
        return;
      }

      const nuevoNombreCompleto = editNombreCompletoControl.value;
      const nuevoPerfil = editPerfilControl.value;
      const nuevaInfo = editInfoControl.value;

      this.autoresService.updateAutor(this.editingAutorId, {
        nombreCompleto: nuevoNombreCompleto,
        perfil: nuevoPerfil,
        info: nuevaInfo
      }).subscribe({
        next: (response) => {
          console.log('Actualización exitosa', response);
          this.closeEditPopup();
          location.reload();
        },
        error: (error) => {
          console.error('Error al actualizar el autor', error);

          if (error && error.mensaje) {
            console.error('Detalles del error:', error.mensaje);
          } else {
            console.error('Error desconocido en la actualización');
          }
        }
      });
    }
  }

  hasError(fieldName: string, errorType: string): boolean {
    const control = this.AutorForm.get(fieldName);
    return !!control?.hasError(errorType) && !!control?.touched;
  }
}