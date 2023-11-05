import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoresService, Autor } from '../../services/autores.service';

@Component({
  selector: 'app-info-autor',
  templateUrl: './info-autor.component.html',
  styleUrls: ['./info-autor.component.css']
})
export class InfoAutorComponent {
  autor: Autor | undefined;

  constructor(
    private route: ActivatedRoute,
    private autoresService: AutoresService
  ) { }

  ngOnInit(): void {
    this.getAutor();
  }

  getAutor(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const parsedId = parseInt(id, 10);
      this.autor = this.autoresService.getAutor(parsedId);
    }
  }
}