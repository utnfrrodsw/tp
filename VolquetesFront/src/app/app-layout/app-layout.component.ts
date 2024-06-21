import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component.js';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component.js';
import { SidebarComponent } from './sidebar/sidebar.component.js';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,SidebarComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent {}
