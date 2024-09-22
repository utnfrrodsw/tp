import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimalComponent } from './components/animal/animal.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnimalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'patas-alegres-front'
  userName: string = 'Marcelo';
}
