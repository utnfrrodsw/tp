// src/app/services/scroll.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private scrollDirectionSubject = new BehaviorSubject<string>('none');
  scrollDirection$ = this.scrollDirectionSubject.asObservable();

  private lastScrollTop = 0;
  private threshold = 5; // Small threshold to prevent rapid toggling

  constructor() {
    this.initScrollListener();
  }

  private initScrollListener() {
    window.addEventListener('scroll', () => {
      const st = window.scrollY;

      if (Math.abs(st - this.lastScrollTop) > this.threshold) {
        if (st > this.lastScrollTop) {
          this.scrollDirectionSubject.next('down');
        } else if (st < this.lastScrollTop) {
          this.scrollDirectionSubject.next('up');
        }
        this.lastScrollTop = st <= 0 ? 0 : st;
      }
    });
  }
}
