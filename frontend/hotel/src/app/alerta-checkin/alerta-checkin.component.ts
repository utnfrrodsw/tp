import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alerta-checkin',
  templateUrl: './alerta-checkin.component.html',
  styleUrls: ['./alerta-checkin.component.css']
})
export class AlertaCheckinComponent {
 mensaje: string = '¿Estás seguro que deseas realizar el check-in para esta reserva?';
  constructor(
    public dialogRef: MatDialogRef<AlertaCheckinComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  
  confirmar(): void {
    this.dialogRef.close(true); 
  }

  
  cancelar(): void {
    this.dialogRef.close(false);
  }
}
