import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-headernav',
  templateUrl: './headernav.component.html',
  styleUrls: ['./headernav.component.css'],
})
export class HeadernavComponent {
  headerScrolled = false;
  isPopupOpen: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.headerScrolled = window.scrollY > 0;
  }

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
}
