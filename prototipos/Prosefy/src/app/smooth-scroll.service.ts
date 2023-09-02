import { Injectable } from '@angular/core';
import Scrollbar from 'smooth-scrollbar';

@Injectable({
  providedIn: 'root',
})
export class SmoothScrollService {
  private scrollbar: Scrollbar | null = null;

  constructor() {}

  initializeSmoothScrollbar() {
    this.scrollbar = Scrollbar.init(document.body, {
      damping: 0.1, // Ajusta la amortiguación
    });
  }

  getScrollbarInstance(): Scrollbar | null {
    return this.scrollbar;
  }
}
