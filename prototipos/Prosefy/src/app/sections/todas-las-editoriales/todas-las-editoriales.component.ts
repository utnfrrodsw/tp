import { Component } from '@angular/core';
import { EditorialesService, Editorial } from '../../services/editoriales.service';

@Component({
  selector: 'app-todas-las-editoriales',
  templateUrl: './todas-las-editoriales.component.html',
  styleUrls: ['./todas-las-editoriales.component.css']
})
export class TodasLasEditorialesComponent {
  
  isHovered = false;
  
  public editoriales = [];

  constructor(private editorialesService: EditorialesService) {}

  ngOnInit() {
    this.editorialesService.getEditoriales()
      .subscribe((data: any) => { this.editoriales = data});
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

}
