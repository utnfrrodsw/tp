import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BurgerMenuComponent } from './burger-button/burger-button.component.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BurgerMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  headerUrl="/assets/logo.svg";
}
