import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { SideBarOption } from './sidebar.interface.js';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private fixed = true;
  public collapsed = false;
  public expandedOption: string | null = null;

  public sidebarOptions: SideBarOption[] = [
    {
      name: 'Alquileres',
      picture: 'assets/sidebar-icons/Alquileres.png',
      route: '/alquileres',
      tooltipText: 'Alquileres',
    },
    {
      name: 'Gastos',
      picture: 'assets/sidebar-icons/Gastos.png',
      route: '/gastos',
      tooltipText: 'Gastos',
      subOptions: [
        { name: 'Ordenes de Compra', route: '/sub-opcion-1' },
        { name: 'Proveedores', route: '/proveedores' },
        { name: 'Materiales', route: '/sub-opcion-3' },
      ],
    },
    {
      name: 'Configuraciones',
      picture: 'assets/sidebar-icons/Configuraciones.png',
      route: '/configuraciones',
      tooltipText: 'Configuraciones',
      subOptions: [{ name: 'Usuarios', route: '/subopcion-usuarios' }],
    },

  ];

  @Output() opened = new EventEmitter<any>();

  toggleOptions(option: any) {
    if (!this.collapsed) {
      this.toggleSuboptions(option);
    } else {
      this.toggleCollapse();
    }
  }

  toggleSuboptions(option: any) {
    this.toggleExpand(option);
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    // Implement your logic here to toggle the sidebar collapse state
    if (this.expandedOption) {
      this.toggleExpand(this.expandedOption);
    }
    console.log(this.collapsed);
    // You can add logic here to change the sidebar's appearance or state
  }

  toggleExpand(option: any) {
    this.expandedOption =
      this.expandedOption === option.name ? null : option.name;
  }

  tooltipText(option: any): string {
    return this.collapsed ? option.tooltipText : '';
  }
}
