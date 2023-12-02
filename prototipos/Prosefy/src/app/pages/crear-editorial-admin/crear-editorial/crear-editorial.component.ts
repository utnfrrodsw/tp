import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Editorial, EditorialesService, editorialResponse } from 'src/app/services/editoriales.service';

@Component({
  selector: 'app-crear-editorial',
  templateUrl: './crear-editorial.component.html',
  styleUrls: ['./crear-editorial.component.css']
})
export class CrearEditorialComponent {
  EditorialForm: FormGroup;
  showErrorMessages: boolean = false;
  isPopupOpen: boolean = false;
  modalMessage: string = '';
  showRedirectButton: boolean = false;

  closePopup() {
    this.isPopupOpen = false;
  }

  constructor(private formBuilder: FormBuilder, private router: Router, private editorialesService: EditorialesService) {
    this.EditorialForm = this.formBuilder.group(
      {
        descripcion: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        imagen: ['', [Validators.required]],
      }
    );
  }

  registrarEditorial(): void {
    this.showErrorMessages = true;
  
    if (this.EditorialForm.valid) {
  
      const descripcionControl = this.EditorialForm.get('descripcion');
      const direccionControl = this.EditorialForm.get('direccion');
      const imagenControl = this.EditorialForm.get('imagen');
  
      if (!descripcionControl || !direccionControl || !imagenControl) {
        return;
      }
  
      const descripcion = descripcionControl.value;
      const direccion = direccionControl.value;
      const imagen = imagenControl.value;
  
      // Validar si la editorial ya existe antes de realizar el registro
      this.editorialesService.validarEditorialExistente(descripcion).subscribe({
        next: (editorialExistente) => {
          if (editorialExistente !== null) {
            descripcionControl.setErrors({ editorialExistente: true });
            console.error('El nombre de la editorial ya está en uso. Por favor, intente con otro.');
            this.updateModalContent('El nombre de la editorial ya está en uso. Por favor, intente con otro.');
          } 
          this.realizarRegistro();
        }, 
        
        error: (error) => {
          console.error('Error al validar la editorial', error);
          console.error('Detalles del error:', error);
  
          if (error && error.error && error.error.mensaje) {
            this.updateModalContent(error.error.mensaje);
          } else {
            const errorMessage = 'Error desconocido en el registro';
            this.updateModalContent(errorMessage);
          }
        }
      });
    }
  }
  
  private realizarRegistro(): void {
  
    const editorial: Editorial = {
      descripcion: this.EditorialForm.value.descripcion,
      direccion: this.EditorialForm.value.direccion,
      imagen: this.EditorialForm.value.imagen,
    };
  
    this.editorialesService.registrarEditorial(editorial).subscribe(
      (response: editorialResponse) => {
        console.log('Registro exitoso', response);
        const message = 'Editorial registrada exitosamente.';
        this.updateModalContent(message, true);
      },
      (error) => {
        console.error('Error al registrar la editorial', error);
  
        // Imprime detalles específicos del error en la consola
        if (error && error.error && error.error.mensaje) {
          console.error('Detalles del error:', error.error.mensaje);
          this.updateModalContent(error.error.mensaje);
        } else {
          console.error('Error desconocido en el registro');
          const errorMessage = 'Error desconocido en el registro';
          this.updateModalContent(errorMessage);
        }
      }
    );
  }
  
  private updateModalContent(message: string, showRedirectButton: boolean = false): void {
    this.modalMessage = message;
    this.showRedirectButton = showRedirectButton;
    this.isPopupOpen = true;
  }
}

