import { Component } from '@angular/core';
import { EditorialesService, Editorial } from '../../services/editoriales.service';

@Component({
  selector: 'app-todas-las-editoriales',
  templateUrl: './todas-las-editoriales.component.html',
  styleUrls: ['./todas-las-editoriales.component.css']
})
export class TodasLasEditorialesComponent {
  
  isHovered = false;
  
  public editoriales: Editorial[] = [];

  constructor(private editorialesService: EditorialesService) {}

  ngOnInit() {
    (this.editorialesService.getEditoriales()).subscribe((editoriales: any) => {
      this.editoriales = editoriales;
    });
  }

  /* async ngOnInit() {
    this.editoriales = this.editorialesService.getEditoriales();
  } */

  onMouseEnter() {
    this.isHovered = true; 
  }

  onMouseLeave() {
    this.isHovered = false;
  }

}
