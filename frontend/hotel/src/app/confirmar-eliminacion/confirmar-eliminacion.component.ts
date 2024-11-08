import { Component } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-confirmar-eliminacion',
  templateUrl: './confirmar-eliminacion.component.html',
  styleUrls: ['./confirmar-eliminacion.component.css']
})
export class ConfirmarEliminacionComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
