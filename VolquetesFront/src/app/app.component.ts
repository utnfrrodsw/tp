import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from './app-layout/app-layout.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink,
    AppLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VolquetesFront';
  
}
