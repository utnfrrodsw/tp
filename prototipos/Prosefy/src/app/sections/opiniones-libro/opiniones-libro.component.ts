import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Libro, LibrosService } from '../../services/libros.service';

@Component({
  selector: 'app-opiniones-libro',
  templateUrl: './opiniones-libro.component.html',
  styleUrls: ['./opiniones-libro.component.css'],
})
export class OpinionesLibroComponent implements OnInit {
  libro: Libro | undefined;

  constructor(
    private librosService: LibrosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.route && this.route.paramMap) {
      this.route.paramMap.subscribe((params) => {
        const idParam = params.get('id');

        if (idParam !== null) {
          const libroId = parseInt(idParam, 10);
          this.libro = this.librosService.getLibroById(libroId);
        } else {
          this.router.navigate(['/inicio']);
        }
      });
    } else {
      // Manejo del caso en el que this.route o this.route.paramMap son undefined
      console.error('this.route o this.route.paramMap es undefined');
    }
  }
}  