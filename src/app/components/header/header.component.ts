import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  navbg:any;

  @HostListener('document:scroll') scrollover() {
    if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) {
      this.navbg = {
        'background-color': '#ffffff'
      }
    }
  }
}
