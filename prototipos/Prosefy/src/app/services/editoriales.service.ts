import { Injectable } from '@angular/core';

export interface Editorial {
  id: number;
  descripcion: string;
  direccion: string;
}

@Injectable({
  providedIn: 'root',
})
export class EditorialesService {
  constructor() {}
}
