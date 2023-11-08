import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoresService, Autor } from '../../services/autores.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info-autor',
  templateUrl: './info-autor.component.html',
  styleUrls: ['./info-autor.component.css']
})
export class InfoAutorComponent implements OnInit {
  autor: Observable<Autor | undefined> | undefined;

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
      const parsedId = id;
      this.autor = this.autoresService.getAutor(parsedId);
    }
  }
}