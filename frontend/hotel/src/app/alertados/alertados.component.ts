import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alertados',
  templateUrl: './alertados.component.html',
  styleUrls: ['./alertados.component.css']
})
export class AlertadosComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertadosComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }  
  ) {}

  cerrarAlerta(): void {
    this.dialogRef.close();  
  }
}
