import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component.js';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component.js';
import { SidebarComponent } from './sidebar/sidebar.component.js';
import { Subscription } from 'rxjs';
import { ScrollService } from '../services/scrollService/scroll.service.js';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,SidebarComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent {
  public showFooter = false;
  private scrollSubscription: Subscription;

  constructor(private scrollService: ScrollService) {
    this.scrollSubscription = this.scrollService.scrollDirection$.subscribe(event => {
      this.onScrollDirection(event);
    });
  }

  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
  }

  onScrollDirection(event: string) {
    // Handle scroll direction event here
    if (event === 'down') {
      this.showFooter = true;
    } else if (event === 'up') {
      this.showFooter = false;
    }

}
}