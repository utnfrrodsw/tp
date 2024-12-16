import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.component.html',
  styleUrls: ['./alerta.component.css']
})
export class AlertaComponent {

  constructor(
    public dialogRef: MatDialogRef<AlertaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  // Si el usuario confirma
  confirmar(): void {
    this.dialogRef.close(true); // Retorna true si se confirma
  }

  // Si el usuario cancela
  cancelar(): void {
    this.dialogRef.close(false); // Retorna false si se cancela
  }
}

